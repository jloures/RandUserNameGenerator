// popup.js

const ADJECTIVES = [
    "Swift", "Quiet", "Bold", "Frosty", "Golden", "Crimson", "Neon", "Classic", "Ancient", "Mystic",
    "Electric", "Lunar", "Solar", "Brave", "Crafty", "Daring", "Eager", "Fluffy", "Gentle", "Hidden",
    "Icy", "Jolly", "Kind", "Lucky", "Mighty", "Noble", "Ocean", "Proud", "Quick", "Rare",
    "Silver", "Tough", "Urban", "Vivid", "Wild", "Young", "Zesty", "Amber", "Bright", "Calm"
];

const NOUNS = [
    "Tiger", "Falcon", "Phoenix", "Ranger", "Seeker", "Glider", "Echo", "Aura", "Pulse", "Nomad",
    "Wolf", "Bear", "Panda", "Eagle", "Raven", "Shark", "Whale", "Dragon", "Knight", "Wizard",
    "Storm", "Cloud", "River", "Mountain", "Forest", "Star", "Moon", "Sun", "Shadow", "Light",
    "Spark", "Flame", "Wave", "Leaf", "Stone", "Iron", "Steel", "Gold", "Silver", "Copper"
];

const SYMBOLS = ["_", "-", "."];

// DOM Elements
const display = document.getElementById("username-display");
const styleSelect = document.getElementById("style-select");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");
const lengthControl = document.getElementById("length-control");
const lengthSlider = document.getElementById("length-slider");
const lengthVal = document.getElementById("length-val");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");
const fillBtn = document.getElementById("fill-btn");
const toast = document.getElementById("toast");

// State
let currentUsername = "";

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["settings"], (data) => {
        if (data.settings) {
            const s = data.settings;
            styleSelect.value = s.style || "friendly";
            includeNumbers.checked = s.includeNumbers ?? true;
            includeSymbols.checked = s.includeSymbols ?? false;
            lengthSlider.value = s.length || 12;
            lengthVal.textContent = lengthSlider.value;

            toggleLengthControl();
        }
        generateUsername();
    });
});

// Event Listeners
styleSelect.addEventListener("change", () => {
    toggleLengthControl();
    saveSettings();
    generateUsername();
});

[includeNumbers, includeSymbols].forEach(el => {
    el.addEventListener("change", () => {
        saveSettings();
        generateUsername();
    });
});

lengthSlider.addEventListener("input", (e) => {
    lengthVal.textContent = e.target.value;
});

lengthSlider.addEventListener("change", () => {
    saveSettings();
    generateUsername();
});

generateBtn.addEventListener("click", generateUsername);

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(currentUsername).then(() => {
        showToast();
    });
});

fillBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "fill", value: currentUsername });
        }
    });
});

// Functions
function toggleLengthControl() {
    lengthControl.style.display = styleSelect.value === "alphanumeric" ? "block" : "none";
}

function saveSettings() {
    const settings = {
        style: styleSelect.value,
        includeNumbers: includeNumbers.checked,
        includeSymbols: includeSymbols.checked,
        length: parseInt(lengthSlider.value)
    };
    chrome.storage.sync.set({ settings });
}

function generateUsername() {
    const style = styleSelect.value;
    const useNumbers = includeNumbers.checked;
    const useSymbols = includeSymbols.checked;

    let result = "";

    if (style === "friendly") {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        result = adj + noun;

        if (useSymbols) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            result = adj + sym + noun;
        }

        if (useNumbers) {
            result += Math.floor(Math.random() * 100);
        }
    } else {
        // Alphanumeric
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (useNumbers) chars += "0123456789";
        if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        const len = parseInt(lengthSlider.value);
        for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }

    currentUsername = result;
    display.value = result;
}

function showToast() {
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
