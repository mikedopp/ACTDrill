using System.Text.Json;

namespace ACTDrill.Desktop;

internal sealed record BridgeRequest(
    string Type,
    string Id,
    string Method,
    JsonElement Params);

internal static class BridgeProtocol
{
    internal const string RequestType = "micdrop-message";
    internal const string ResponseType = "micdrop-response";
    internal const string EventType = "micdrop-event";
}
