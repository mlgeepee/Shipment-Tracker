const form = document.getElementById("mortgageForm");
const clearBtn = document.getElementById("clearBtn");

const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const rateInput = document.getElementById("rate");
const mortgageTypeInputs = document.querySelectorAll('input[name="mortgageType"]');

const emptyState = document.getElementById("emptyState");
const completeState = document.getElementById("completeState");
const monthlyRepaymentEl = document.getElementById("monthlyRepayment");
const totalRepaymentEl = document.getElementById("totalRepayment");

const groupRefs = {
  amount: document.querySelector('[data-field="amount"]'),
  term: document.querySelector('[data-field="term"]'),
  rate: document.querySelector('[data-field="rate"]'),
  type: document.querySelector('[data-field="type"]'),
};

function parseAmount(value) {
  const normalized = value.replace(/,/g, "").trim();
  return Number.parseFloat(normalized);
}

function formatAmountInput(value) {
  if (!value) {
    return "";
  }

  const digits = value.replace(/[^\d.]/g, "");
  if (!digits) {
    return "";
  }

  const [whole, fractional] = digits.split(".");
  const grouped = Number(whole || "0").toLocaleString("en-GB");

  return fractional !== undefined ? `${grouped}.${fractional.slice(0, 2)}` : grouped;
}

function getSelectedMortgageType() {
  const checked = Array.from(mortgageTypeInputs).find((input) => input.checked);
  return checked ? checked.value : "";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function setErrorState(groupName, hasError) {
  groupRefs[groupName].classList.toggle("is-error", hasError);
}

function resetErrors() {
  Object.keys(groupRefs).forEach((groupName) => setErrorState(groupName, false));
}

function validateForm() {
  const amount = parseAmount(amountInput.value);
  const term = Number.parseFloat(termInput.value);
  const rate = Number.parseFloat(rateInput.value);
  const type = getSelectedMortgageType();

  const amountInvalid = !Number.isFinite(amount) || amount <= 0;
  const termInvalid = !Number.isFinite(term) || term <= 0;
  const rateInvalid = !Number.isFinite(rate) || rate <= 0;
  const typeInvalid = !type;

  setErrorState("amount", amountInvalid);
  setErrorState("term", termInvalid);
  setErrorState("rate", rateInvalid);
  setErrorState("type", typeInvalid);

  return {
    isValid: !(amountInvalid || termInvalid || rateInvalid || typeInvalid),
    data: { amount, term, rate, type },
  };
}

function calculateResults({ amount, term, rate, type }) {
  const months = term * 12;
  const monthlyRate = rate / 100 / 12;

  let monthlyRepayment;

  if (type === "interest-only") {
    monthlyRepayment = amount * monthlyRate;
  } else {
    monthlyRepayment =
      (amount * monthlyRate * (1 + monthlyRate) ** months) /
      ((1 + monthlyRate) ** months - 1);
  }

  const totalRepayment = monthlyRepayment * months;

  return { monthlyRepayment, totalRepayment };
}

function showCompleteState(monthlyRepayment, totalRepayment) {
  monthlyRepaymentEl.textContent = formatCurrency(monthlyRepayment);
  totalRepaymentEl.textContent = formatCurrency(totalRepayment);

  completeState.removeAttribute("hidden");
  emptyState.hidden = true;
  completeState.hidden = false;
}

function showEmptyState() {
  emptyState.removeAttribute("hidden");
  completeState.hidden = true;
  emptyState.hidden = false;
}

function clearForm() {
  form.reset();
  amountInput.value = "";
  resetErrors();
  showEmptyState();
}

amountInput.addEventListener("input", (event) => {
  const cursorStart = event.target.selectionStart;
  const raw = event.target.value;
  const formatted = formatAmountInput(raw);

  event.target.value = formatted;

  if (cursorStart !== null) {
    const newPosition = Math.min(formatted.length, cursorStart + (formatted.length - raw.length));
    event.target.setSelectionRange(newPosition, newPosition);
  }

  if (groupRefs.amount.classList.contains("is-error") && parseAmount(formatted) > 0) {
    setErrorState("amount", false);
  }
});

[termInput, rateInput].forEach((input) => {
  input.addEventListener("input", () => {
    const key = input.id === "term" ? "term" : "rate";
    if (groupRefs[key].classList.contains("is-error") && Number.parseFloat(input.value) > 0) {
      setErrorState(key, false);
    }
  });
});

mortgageTypeInputs.forEach((input) => {
  input.addEventListener("change", () => setErrorState("type", false));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const { isValid, data } = validateForm();

  if (!isValid) {
    showEmptyState();
    return;
  }

  const { monthlyRepayment, totalRepayment } = calculateResults(data);
  showCompleteState(monthlyRepayment, totalRepayment);
});

clearBtn.addEventListener("click", clearForm);

resetErrors();
showEmptyState();
