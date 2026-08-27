/* =========================
DOM References
========================= */

const metricRadio = document.querySelector("#metric");
const imperialRadio = document.querySelector("#imperial");
const metricInputs = document.querySelector(".metric");
const imperialHeightInputs = document.querySelector(".imperial-height");
const imperialWeightInputs = document.querySelector(".imperial-weight");
const metricHeightInput = document.querySelector("#height-1");
const metricWeightInput = document.querySelector("#weight-1");
const imperialHeightFtInput = document.querySelector("#height-2");
const imperialHeightInInput = document.querySelector("#height-3");
const imperialWeightStInput = document.querySelector("#weight-2");
const imperialWeightLbsInput = document.querySelector("#weight-3");
const bmiValue = document.querySelector(".bmi-value");
const calculatedValue = document.querySelector(".calculated-value");
const defaultBMISuggestion =
    "Enter your height and weight to calculate your BMI.";
const bmiSuggestionMessage =
    document.querySelector(".bmi-suggestion-message");
const healthyRangeMessage =
    document.querySelector(".healthy-range-message");
const bmiResultContainer = document.querySelector(".bmi-result-container");

/* =========================
Measurement Unit
========================= */

function updateMeasurementUnit() {
    const isImperial = imperialRadio.checked;

    metricInputs.classList.toggle("hidden", isImperial);
    imperialHeightInputs.classList.toggle("hidden", !isImperial);
    imperialWeightInputs.classList.toggle("hidden", !isImperial);
}

function resetBMIForm() {
    metricHeightInput.value = "";
    metricWeightInput.value = "";

    imperialHeightFtInput.value = "";
    imperialHeightInInput.value = "";
    imperialWeightStInput.value = "";
    imperialWeightLbsInput.value = "";

    bmiValue.textContent = "00.0";
    bmiSuggestionMessage.textContent = defaultBMISuggestion;
    healthyRangeMessage.textContent = "";
    calculatedValue.textContent = "";
}

function animateElement(element) {
    element.classList.remove("animation-enter");
    void element.offsetWidth;
    element.classList.add("animation-enter");
}

metricRadio.addEventListener("change", () => {
    updateMeasurementUnit();
    resetBMIForm();
    
    animateElement(metricInputs);
    animateElement(bmiResultContainer);
});

imperialRadio.addEventListener("change", () => {
    updateMeasurementUnit();
    resetBMIForm();
    
    animateElement(imperialHeightInputs);
    animateElement(imperialWeightInputs);
    animateElement(bmiResultContainer);
});

updateMeasurementUnit();

/* =========================
BMI Calculation
========================= */

function calculateMetricBMI(heightCm, weightKg) {
    const heightM = heightCm / 100;

    return weightKg / (heightM * heightM);
}

function calculateImperialBMI(heightFt, heightIn, weightSt, weightLbs) {
    const totalInches = (heightFt * 12) + heightIn;
    const totalPounds = (weightSt * 14) + weightLbs;

    return (totalPounds / (totalInches * totalInches)) * 703;
}

function getMetricBMI() {
    const height = Number(metricHeightInput.value);
    const weight = Number(metricWeightInput.value);

    if (!height || !weight) {
        return null;
    }

    return calculateMetricBMI(height, weight);
}

function getImperialBMI() {
    const heightFt = Number(imperialHeightFtInput.value);
    const heightIn = Number(imperialHeightInInput.value);
    const weightSt = Number(imperialWeightStInput.value);
    const weightLbs = Number(imperialWeightLbsInput.value);

    if (
        imperialHeightFtInput.value.trim() === "" ||
        imperialHeightInInput.value.trim() === "" ||
        imperialWeightStInput.value.trim() === "" ||
        imperialWeightLbsInput.value.trim() === ""
    ) {
        return null;
    }

    return calculateImperialBMI(
        heightFt,
        heightIn,
        weightSt,
        weightLbs
    );
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "underweight";
    }

    if (bmi < 25) {
        return "a healthy weight";
    }

    if (bmi < 30) {
        return "overweight";
    }

    return "obese";
}

function calculateHealthyWeightRange(heightCm) {
    const heightM = heightCm / 100;

    const minimumWeight = 18.5 * (heightM * heightM);
    const maximumWeight = 24.9 * (heightM * heightM);

    return {
        minimum: minimumWeight,
        maximum: maximumWeight
    };
}

function calculateHealthyWeightRangeImperial(heightFt, heightIn) {
    const totalInches = (heightFt * 12) + heightIn;

    const minimumPounds = (18.5 * totalInches * totalInches) / 703;
    const maximumPounds = (24.9 * totalInches * totalInches) / 703;

    return {
        minimum: minimumPounds,
        maximum: maximumPounds
    };
}

function formatStoneAndPounds(totalPounds) {
    const stones = Math.floor(totalPounds / 14);
    const pounds = Math.round(totalPounds % 14);

    return `${stones}st ${pounds}lbs`;
}

/* =========================
Form Validation
========================= */

function isValidNumber(value) {
    if (value.trim() === "") {
        return false;
    }

    return /^\d*\.?\d+$/.test(value.trim());
}

function allowNumericInput(event) {
    const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
    ];

    if (allowedKeys.includes(event.key)) {
        return;
    }
    
    const isMetricInput =
        event.target === metricHeightInput ||
        event.target === metricWeightInput;

    if (isMetricInput) {
        if (!/[0-9.]/.test(event.key)) {
            event.preventDefault();
        }

        return;
    }

    if (!/[0-9.]/.test(event.key)) {
        event.preventDefault();
    }
}

const allNumberInputs = [
    metricHeightInput,
    metricWeightInput,
    imperialHeightFtInput,
    imperialHeightInInput,
    imperialWeightStInput,
    imperialWeightLbsInput
];

allNumberInputs.forEach(input => {
    input.addEventListener("keydown", allowNumericInput);
});

function validateMetricHeight(heightCm) {
    if (heightCm < 50 || heightCm > 275) {
        return "Height must be between 50 cm and 275 cm.";
    }

    return null;
}

function validateMetricWeight(weightKg) {
    if (weightKg < 2 || weightKg > 650) {
        return "Weight must be between 2 kg and 650 kg.";
    }

    return null;
}

function validateImperialHeight(heightFt, heightIn) {
    if (heightIn < 0 || heightIn > 11) {
        return "Height inches must be between 0 and 11.";
    }

    const totalInches = (heightFt * 12) + heightIn;

    if (totalInches < 20 || totalInches > 108) {
        return "Height must be between 1 ft 8 in and 9 ft 0 in.";
    }

    return null;
}

function validateImperialWeight(weightSt, weightLbs) {
    if (weightLbs < 0 || weightLbs > 13) {
        return "Weight pounds must be between 0 and 13.";
    }

    const totalPounds = (weightSt * 14) + weightLbs;

    if (totalPounds < 4.41 || totalPounds > 1433.0) {
        return "Weight must be between 4 lbs and 1,433 lbs.";
    }

    return null;
}

/* =========================
UI Updates
========================= */

function updateMetricBMI() {
    const bmi = getMetricBMI();
    const height = Number(metricHeightInput.value);

    if (!isValidNumber(metricHeightInput.value) || !isValidNumber(metricWeightInput.value)) {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = defaultBMISuggestion;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }
    
    const heightError = validateMetricHeight(height);

    if (heightError) {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = heightError;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }
    
    const weight = Number(metricWeightInput.value);

    const weightError = validateMetricWeight(weight);

    if (weightError) {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = weightError;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }
    
    bmiValue.textContent = bmi.toFixed(1);
    
    updateHealthyWeightRange(height);
    updateBMICategory(bmi);
}

function updateImperialBMI() {
    const bmi = getImperialBMI();
    const heightFt = Number(imperialHeightFtInput.value);
    const heightIn = Number(imperialHeightInInput.value);

    if (
        !isValidNumber(imperialHeightFtInput.value) ||
        !isValidNumber(imperialHeightInInput.value) ||
        !isValidNumber(imperialWeightStInput.value) ||
        !isValidNumber(imperialWeightLbsInput.value)) 
    {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = defaultBMISuggestion;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }
    
    const heightError = validateImperialHeight(heightFt, heightIn);

    if (heightError) {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = heightError;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }
    
    const weightSt = Number(imperialWeightStInput.value);
    const weightLbs = Number(imperialWeightLbsInput.value);

    const weightError = validateImperialWeight(weightSt, weightLbs);

    if (weightError) {
        bmiValue.textContent = "00.0";
        bmiSuggestionMessage.textContent = weightError;
        healthyRangeMessage.textContent = "";
        calculatedValue.textContent = "";
        return;
    }

    bmiValue.textContent = bmi.toFixed(1);

    updateBMICategory(bmi);
    updateImperialHealthyWeightRange(heightFt, heightIn);
}

function updateImperialHealthyWeightRange(heightFt, heightIn) {
    const range = calculateHealthyWeightRangeImperial(heightFt, heightIn);

    const minimum = formatStoneAndPounds(range.minimum);
    const maximum = formatStoneAndPounds(range.maximum);

    calculatedValue.textContent = `${minimum} - ${maximum}`;
}

function updateHealthyWeightRange(heightCm) {
    const range = calculateHealthyWeightRange(heightCm);
    
    calculatedValue.textContent =
        `${range.minimum.toFixed(1)}kg - ${range.maximum.toFixed(1)}kg`;
}

function updateBMICategory(bmi) {
    const category = getBMICategory(bmi);

    bmiSuggestionMessage.textContent =
        `Your BMI suggests you’re ${category}. `;
    
    healthyRangeMessage.textContent =
        " A healthy weight range for your height is ";
}

imperialHeightFtInput.addEventListener("input", updateImperialBMI);
imperialHeightInInput.addEventListener("input", updateImperialBMI);
imperialWeightStInput.addEventListener("input", updateImperialBMI);
imperialWeightLbsInput.addEventListener("input", updateImperialBMI);
metricHeightInput.addEventListener("input", updateMetricBMI);
metricWeightInput.addEventListener("input", updateMetricBMI);

/* =========================
   Scroll Animations
========================= */

const tipItems = document.querySelectorAll(".tips-content > div");

const tipObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("tip-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2
    }
);

tipItems.forEach(tip => {
    tipObserver.observe(tip);
});

const limitationCards = document.querySelectorAll(
    ".limitations-of-bmi .card"
);

const limitationObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("limitations-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2
    }
);

limitationCards.forEach(card => {
    limitationObserver.observe(card);
});


