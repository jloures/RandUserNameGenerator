// utils.js - Shared username generation logic

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

function generateUsernameLogic({ style, includeNumbers, includeSymbols, length }) {
    let result = "";

    if (style === "friendly") {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        result = adj + noun;

        if (includeSymbols) {
            const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            result = adj + sym + noun;
        }

        if (includeNumbers) {
            result += Math.floor(Math.random() * 100);
        }
    } else {
        let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        const len = parseInt(length);
        for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    return result;
}
