const expression = document.getElementById("expression");
const display = document.getElementById("display");
const keys = document.querySelector(".keys");

const state = {
  firstValue: null,
  operator: null,
  waitingForSecondValue: false,
  displayValue: "0",
  expressionValue: "",
  justEvaluated: false,
};

function formatOperator(operator) {
  return operator === "*" ? "x" : operator;
}

function formatResult(result) {
  if (result === "Error") return "Error";
  return String(Number(result.toFixed(10)));
}

function updateDisplay() {
  expression.textContent = state.expressionValue;
  display.textContent = state.displayValue;
}

function syncExpression() {
  if (state.firstValue !== null && state.operator) {
    const symbol = formatOperator(state.operator);
    state.expressionValue = state.waitingForSecondValue
      ? `${state.firstValue} ${symbol}`
      : `${state.firstValue} ${symbol} ${state.displayValue}`;
  } else if (!state.justEvaluated) {
    state.expressionValue = "";
  }
}

function inputNumber(number) {
  if (state.justEvaluated) {
    resetCalculator();
    state.displayValue = number;
    return;
  }

  if (state.waitingForSecondValue) {
    state.displayValue = number;
    state.waitingForSecondValue = false;
    syncExpression();
    return;
  }

  state.displayValue = state.displayValue === "0" ? number : state.displayValue + number;
  syncExpression();
}

function inputDecimal() {
  if (state.justEvaluated) {
    resetCalculator();
    state.displayValue = "0.";
    return;
  }

  if (state.waitingForSecondValue) {
    state.displayValue = "0.";
    state.waitingForSecondValue = false;
    syncExpression();
    return;
  }

  if (!state.displayValue.includes(".")) {
    state.displayValue += ".";
    syncExpression();
  }
}

function calculate(first, second, operator) {
  const a = Number(first);
  const b = Number(second);

  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return b === 0 ? "Error" : a / b;

  return b;
}

function inputOperator(nextOperator) {
  if (state.displayValue === "Error") return;

  if (state.justEvaluated) {
    state.firstValue = state.displayValue;
    state.justEvaluated = false;
  }

  const inputValue = state.displayValue;

  if (state.firstValue === null) {
    state.firstValue = inputValue;
  } else if (state.operator && !state.waitingForSecondValue) {
    const result = calculate(state.firstValue, inputValue, state.operator);
    state.displayValue = formatResult(result);
    state.firstValue = state.displayValue;
  }

  state.operator = nextOperator;
  state.waitingForSecondValue = true;
  syncExpression();
}

function evaluate() {
  if (!state.operator || state.waitingForSecondValue) return;

  const left = state.firstValue;
  const right = state.displayValue;
  const symbol = formatOperator(state.operator);
  const result = calculate(left, right, state.operator);

  state.expressionValue = `${left} ${symbol} ${right} =`;
  state.displayValue = formatResult(result);
  state.firstValue = null;
  state.operator = null;
  state.waitingForSecondValue = false;
  state.justEvaluated = true;
}

function resetCalculator() {
  state.firstValue = null;
  state.operator = null;
  state.waitingForSecondValue = false;
  state.displayValue = "0";
  state.expressionValue = "";
  state.justEvaluated = false;
}

keys.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const { action, value } = target.dataset;

  if (action === "number") inputNumber(value);
  if (action === "decimal") inputDecimal();
  if (action === "operator") inputOperator(value);
  if (action === "equals") evaluate();
  if (action === "clear") resetCalculator();

  updateDisplay();
});

window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) inputNumber(key);
  if (key === ".") inputDecimal();
  if (["+", "-", "*", "/"].includes(key)) inputOperator(key);
  if (key === "Enter" || key === "=") evaluate();
  if (key === "Escape" || key.toLowerCase() === "c") resetCalculator();

  updateDisplay();
});

updateDisplay();
