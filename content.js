// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fill") {
        fillUsername(request.value);
    }
});

function fillUsername(value) {
    // Try to find the best input field
    // Priority: 
    // 1. Current active element if it's an input
    // 2. First input with name/id containing 'user', 'email', 'login', 'name'
    // 3. First visible text input

    let target = document.activeElement;

    if (!isInput(target)) {
        target = findBestInput();
    }

    if (target) {
        target.focus();
        target.value = value;

        // Trigger events for reactive frameworks (React, Vue, etc.)
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));

        console.log("RandUserNameGenerator: Filled field", target);
    } else {
        console.log("RandUserNameGenerator: No suitable input field found.");
    }
}

function isInput(el) {
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
        !["checkbox", "radio", "submit", "button", "hidden"].includes(el.type);
}

function findBestInput() {
    const inputs = Array.from(document.querySelectorAll("input:not([type='password']):not([type='hidden']):not([type='submit'])"));

    // Look for cues in name/id/placeholder
    const cues = ["user", "name", "login", "handle", "email"];

    for (const input of inputs) {
        const attrString = (input.name + " " + input.id + " " + input.placeholder).toLowerCase();
        if (cues.some(cue => attrString.includes(cue))) {
            return input;
        }
    }

    // Return first visible text input if no better match
    return inputs.find(input => {
        const rect = input.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && input.type !== "email"; // prefer text over email if possible for username
    }) || inputs[0];
}
