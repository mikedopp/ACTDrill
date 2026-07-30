(() => {
  "use strict";

  function guidedMathSteps(question, pattern, formula) {
    if (Array.isArray(question.steps) && question.steps.length) {
      return question.steps.map(step => ({
        do: String(step.do || "").trim(),
        why: String(step.why || "").trim()
      })).filter(step => step.do);
    }
    if (!pattern || pattern.subject !== "Math") return [];

    const correct = question.choices.find(choice => choice.correct);
    const steps = [{
      do: question.decode || pattern.cue,
      why: "First name the job. Do not calculate until you know what the question wants."
    }];

    if (formula) {
      steps.push({
        do: "Write the key: " + formula.key + ". " + formula.expr,
        why: "Putting the formula on the page gives the numbers somewhere to go."
      });
      if (formula.data) {
        steps.push({
          do: "Put in the given numbers: " + formula.data,
          why: "Copy one value at a time. This is where sign and unit mistakes get caught."
        });
      }
    } else {
      steps.push({
        do: "Use this rule: " + pattern.rule,
        why: "This is the repeatable move for this question family."
      });
    }

    if (correct?.why) {
      steps.push({
        do: correct.why.replace(/\s*✓\s*$/, ""),
        why: "Work only this line. The full problem is now a small calculation."
      });
    }
    if (correct?.text) {
      steps.push({
        do: "Match the result to the choices: " + correct.text,
        why: "You have finished the math. Now select the choice that says the same thing."
      });
    }
    return steps;
  }

  window.ACTDrillCoaching = { guidedMathSteps };
})();
