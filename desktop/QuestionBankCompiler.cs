using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Esprima;
using Esprima.Utils;

namespace ACTDrill.Desktop;

internal sealed record CompiledQuestionBank(
    string JavaScript,
    string Version,
    int PatternCount,
    int QuestionCount);

internal static partial class QuestionBankCompiler
{
    private const int MaxSourceBytes = 2 * 1024 * 1024;
    private const int MaxStringLength = 20_000;

    private static readonly JsonSerializerOptions OutputOptions = new()
    {
        Encoder = JavaScriptEncoder.Default,
        WriteIndented = false
    };

    internal static CompiledQuestionBank Compile(string source)
    {
        if (Encoding.UTF8.GetByteCount(source) > MaxSourceBytes)
        {
            throw new InvalidDataException("Question bank is larger than the 2 MB safety limit.");
        }

        source = DefaultSubjectStatement().Replace(source, string.Empty, 1);
        var parser = new JavaScriptParser(new ParserOptions { Tolerant = false });
        var program = parser.ParseScript(source);
        using var ast = JsonDocument.Parse(program.ToJsonString());

        var variables = new Dictionary<string, JsonNode?>(StringComparer.Ordinal);
        foreach (var statement in ast.RootElement.GetProperty("body").EnumerateArray())
        {
            ProcessStatement(statement, variables);
        }

        if (variables.GetValueOrDefault("ACT_PATTERNS") is not JsonObject patterns ||
            variables.GetValueOrDefault("ACT_QUESTIONS") is not JsonArray questions ||
            variables.GetValueOrDefault("BANK_VERSION") is not JsonValue versionNode ||
            !versionNode.TryGetValue<string>(out var version) ||
            string.IsNullOrWhiteSpace(version))
        {
            throw new InvalidDataException(
                "Question bank must define ACT_PATTERNS, ACT_QUESTIONS, and BANK_VERSION.");
        }

        foreach (var pattern in patterns)
        {
            if (pattern.Value is JsonObject value && value["subject"] is null)
            {
                value["subject"] = "English";
            }
        }

        ValidateSchema(patterns, questions, version);

        var trustedJavaScript =
            "const ACT_PATTERNS = " + patterns.ToJsonString(OutputOptions) + ";\n" +
            "const ACT_QUESTIONS = " + questions.ToJsonString(OutputOptions) + ";\n" +
            "const BANK_VERSION = " + JsonSerializer.Serialize(version, OutputOptions) + ";\n";

        return new CompiledQuestionBank(
            trustedJavaScript,
            version,
            patterns.Count,
            questions.Count);
    }

    private static void ProcessStatement(
        JsonElement statement,
        Dictionary<string, JsonNode?> variables)
    {
        var type = statement.GetProperty("type").GetString();
        switch (type)
        {
            case "VariableDeclaration":
                foreach (var declaration in statement.GetProperty("declarations").EnumerateArray())
                {
                    var name = ReadIdentifier(declaration.GetProperty("id"));
                    if (name is not ("ACT_PATTERNS" or "ACT_QUESTIONS" or "BANK_VERSION") ||
                        variables.ContainsKey(name))
                    {
                        throw new InvalidDataException($"Unsupported or duplicate declaration '{name}'.");
                    }

                    variables[name] = EvaluateDataNode(declaration.GetProperty("init"));
                }
                break;

            case "ExpressionStatement":
                ProcessAllowedCall(statement.GetProperty("expression"), variables);
                break;

            case "EmptyStatement":
                break;

            default:
                throw new InvalidDataException($"Unsupported top-level statement '{type}'.");
        }
    }

    private static void ProcessAllowedCall(
        JsonElement expression,
        Dictionary<string, JsonNode?> variables)
    {
        if (expression.GetProperty("type").GetString() != "CallExpression")
        {
            throw new InvalidDataException("Only data append calls are allowed.");
        }

        var callee = expression.GetProperty("callee");
        if (callee.GetProperty("type").GetString() != "MemberExpression" ||
            callee.GetProperty("computed").GetBoolean())
        {
            throw new InvalidDataException("Only direct data append calls are allowed.");
        }

        var target = ReadIdentifier(callee.GetProperty("object"));
        var method = ReadIdentifier(callee.GetProperty("property"));
        var arguments = expression.GetProperty("arguments").EnumerateArray().ToArray();

        if (target == "Object" && method == "assign" &&
            arguments.Length == 2 &&
            ReadIdentifier(arguments[0]) == "ACT_PATTERNS" &&
            variables.GetValueOrDefault("ACT_PATTERNS") is JsonObject patterns &&
            EvaluateDataNode(arguments[1]) is JsonObject additions)
        {
            foreach (var item in additions)
            {
                if (patterns.ContainsKey(item.Key))
                {
                    throw new InvalidDataException($"Duplicate pattern '{item.Key}'.");
                }
                patterns[item.Key] = item.Value?.DeepClone();
            }
            return;
        }

        if (target == "ACT_QUESTIONS" && method == "push" &&
            variables.GetValueOrDefault("ACT_QUESTIONS") is JsonArray questions)
        {
            foreach (var argument in arguments)
            {
                questions.Add(EvaluateDataNode(argument));
            }
            return;
        }

        throw new InvalidDataException($"Unsupported call '{target}.{method}'.");
    }

    private static JsonNode? EvaluateDataNode(JsonElement node)
    {
        var type = node.GetProperty("type").GetString();
        switch (type)
        {
            case "Literal":
                var value = node.GetProperty("value");
                if (value.ValueKind == JsonValueKind.String &&
                    value.GetString()!.Length > MaxStringLength)
                {
                    throw new InvalidDataException("Question-bank string exceeds 20,000 characters.");
                }
                return JsonNode.Parse(value.GetRawText());

            case "ArrayExpression":
                var array = new JsonArray();
                foreach (var element in node.GetProperty("elements").EnumerateArray())
                {
                    if (element.ValueKind == JsonValueKind.Null)
                    {
                        throw new InvalidDataException("Sparse arrays are not allowed.");
                    }
                    array.Add(EvaluateDataNode(element));
                }
                return array;

            case "ObjectExpression":
                var result = new JsonObject();
                foreach (var property in node.GetProperty("properties").EnumerateArray())
                {
                    if (property.GetProperty("type").GetString() != "Property" ||
                        property.GetProperty("computed").GetBoolean() ||
                        property.GetProperty("kind").GetString() != "init" ||
                        property.GetProperty("method").GetBoolean())
                    {
                        throw new InvalidDataException("Computed, method, getter, and setter properties are blocked.");
                    }

                    var keyNode = property.GetProperty("key");
                    var key = keyNode.GetProperty("type").GetString() == "Identifier"
                        ? ReadIdentifier(keyNode)
                        : keyNode.GetProperty("value").GetString() ?? string.Empty;
                    if (key is "__proto__" or "prototype" or "constructor" ||
                        string.IsNullOrWhiteSpace(key) ||
                        result.ContainsKey(key))
                    {
                        throw new InvalidDataException($"Unsafe or duplicate property '{key}'.");
                    }
                    result[key] = EvaluateDataNode(property.GetProperty("value"));
                }
                return result;

            case "UnaryExpression":
                if (node.GetProperty("operator").GetString() == "-" &&
                    EvaluateDataNode(node.GetProperty("argument")) is JsonValue number &&
                    number.TryGetValue<double>(out var numeric))
                {
                    return JsonValue.Create(-numeric);
                }
                throw new InvalidDataException("Only negative numeric literals are allowed.");

            default:
                throw new InvalidDataException($"Executable expression '{type}' is blocked.");
        }
    }

    private static string ReadIdentifier(JsonElement node)
    {
        if (node.GetProperty("type").GetString() != "Identifier")
        {
            throw new InvalidDataException("Expected a plain identifier.");
        }
        return node.GetProperty("name").GetString() ?? string.Empty;
    }

    private static void ValidateSchema(
        JsonObject patterns,
        JsonArray questions,
        string version)
    {
        if (patterns.Count is < 1 or > 200)
        {
            throw new InvalidDataException("Pattern count must be between 1 and 200.");
        }
        if (questions.Count is < 1 or > 5_000)
        {
            throw new InvalidDataException("Question count must be between 1 and 5,000.");
        }
        RequireText(version, "BANK_VERSION", 80);

        foreach (var pattern in patterns)
        {
            if (!SafeId().IsMatch(pattern.Key) || pattern.Value is not JsonObject value)
            {
                throw new InvalidDataException($"Invalid pattern '{pattern.Key}'.");
            }
            foreach (var field in new[] { "name", "rule", "cue", "example", "subject" })
            {
                RequireText(value[field], $"pattern {pattern.Key}.{field}", 4_000);
            }
            var subject = value["subject"]!.GetValue<string>();
            if (subject is not ("English" or "Math" or "Reading"))
            {
                throw new InvalidDataException($"Pattern '{pattern.Key}' has unsupported subject '{subject}'.");
            }
        }

        var ids = new HashSet<string>(StringComparer.Ordinal);
        foreach (var node in questions)
        {
            if (node is not JsonObject question)
            {
                throw new InvalidDataException("Each question must be an object.");
            }

            var id = RequireText(question["id"], "question.id", 80);
            var pattern = RequireText(question["pattern"], $"{id}.pattern", 80);
            if (!SafeId().IsMatch(id) || !ids.Add(id))
            {
                throw new InvalidDataException($"Question id '{id}' is invalid or duplicated.");
            }
            if (!patterns.ContainsKey(pattern))
            {
                throw new InvalidDataException($"Question '{id}' references unknown pattern '{pattern}'.");
            }
            if (question["prompt"] is null && question["passage"] is null)
            {
                throw new InvalidDataException($"Question '{id}' needs a prompt or passage.");
            }
            if (question["prompt"] is not null)
            {
                RequireText(question["prompt"], $"{id}.prompt", MaxStringLength);
            }
            if (question["passage"] is not null)
            {
                RequireText(question["passage"], $"{id}.passage", MaxStringLength);
            }

            if (question["choices"] is not JsonArray choices || choices.Count != 4)
            {
                throw new InvalidDataException($"Question '{id}' must have exactly four choices.");
            }

            var correct = 0;
            foreach (var choiceNode in choices)
            {
                if (choiceNode is not JsonObject choice)
                {
                    throw new InvalidDataException($"Question '{id}' contains an invalid choice.");
                }
                RequireText(choice["text"], $"{id}.choice.text", 4_000);
                RequireText(choice["why"], $"{id}.choice.why", 8_000);
                if (choice["correct"] is JsonValue flag &&
                    flag.TryGetValue<bool>(out var isCorrect) &&
                    isCorrect)
                {
                    correct++;
                }
            }
            if (correct != 1)
            {
                throw new InvalidDataException($"Question '{id}' must have exactly one correct choice.");
            }
        }
    }

    private static string RequireText(JsonNode? node, string field, int maxLength)
    {
        if (node is not JsonValue value ||
            !value.TryGetValue<string>(out var text) ||
            string.IsNullOrWhiteSpace(text) ||
            text.Length > maxLength)
        {
            throw new InvalidDataException($"'{field}' is missing or exceeds {maxLength} characters.");
        }
        return text;
    }

    [GeneratedRegex("^[A-Za-z0-9_-]{1,80}$", RegexOptions.CultureInvariant)]
    private static partial Regex SafeId();

    [GeneratedRegex(
        @"Object\.values\(ACT_PATTERNS\)\.forEach\(p\s*=>\s*\{\s*if\s*\(!p\.subject\)\s*p\.subject\s*=\s*[""']English[""'];?\s*\}\);?",
        RegexOptions.CultureInvariant)]
    private static partial Regex DefaultSubjectStatement();
}
