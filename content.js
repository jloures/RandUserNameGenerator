// content.js - In-page suggestions

let suggestionPopup = null;
let activeInput = null;

// Initialize the suggestion UI
function createSuggestionUI() {
    if (suggestionPopup) return;

    suggestionPopup = document.createElement("div");
    suggestionPopup.id = "usergen-suggestion-popup";
    suggestionPopup.style.cssText = `
    position: absolute;
    z-index: 1000000;
    background: #ffffff;
    border: 1px solid #000000;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 8px 12px;
    cursor: pointer;
    display: none;
    font-family: 'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, sans-serif;
    font-size: 14px;
    color: #111111;
    transition: transform 0.1s, opacity 0.1s;
    user-select: none;
    line-height: 1.4;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

    suggestionPopup.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">✨</span>
      <span id="usergen-suggested-name" style="font-weight: 600;"></span>
    </div>
    <div style="font-size: 10px; color: #666; margin-top: 2px;">Use Suggested Username</div>
  `;

    suggestionPopup.addEventListener("mousedown", (e) => {
        e.preventDefault(); // Prevent blur on the input
        if (activeInput) {
            const name = document.getElementById("usergen-suggested-name").textContent;
            activeInput.value = name;
            activeInput.dispatchEvent(new Event('input', { bubbles: true }));
            activeInput.dispatchEvent(new Event('change', { bubbles: true }));
            hideSuggestion();
        }
    });

    suggestionPopup.addEventListener("mouseenter", () => {
        suggestionPopup.style.background = "#f5f5f5";
        suggestionPopup.style.transform = "translateY(-1px)";
    });

    suggestionPopup.addEventListener("mouseleave", () => {
        suggestionPopup.style.background = "#ffffff";
        suggestionPopup.style.transform = "translateY(0)";
    });

    document.body.appendChild(suggestionPopup);
}

function showSuggestion(input) {
    createSuggestionUI();
    activeInput = input;

    chrome.storage.sync.get(["settings"], (data) => {
        const settings = data.settings || { style: "friendly", includeNumbers: true, includeSymbols: false, length: 12 };
        const name = generateUsernameLogic(settings);

        const nameEl = document.getElementById("usergen-suggested-name");
        nameEl.textContent = name;

        const rect = input.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        suggestionPopup.style.top = `${rect.bottom + scrollTop + 5}px`;
        suggestionPopup.style.left = `${rect.left + scrollLeft}px`;
        suggestionPopup.style.display = "block";
        suggestionPopup.style.opacity = "0";

        setTimeout(() => {
            suggestionPopup.style.opacity = "1";
        }, 10);
    });
}

function hideSuggestion() {
    if (suggestionPopup) {
        suggestionPopup.style.display = "none";
    }
}

// Event Listeners
document.addEventListener("focusin", (e) => {
    if (isInput(e.target)) {
        // Only show for potential username/email fields
        const cues = ["user", "name", "login", "handle", "email", "id"];
        const attrString = (e.target.name + " " + e.target.id + " " + e.target.placeholder + " " + e.target.className).toLowerCase();

        if (cues.some(cue => attrString.includes(cue)) || e.target.type === "email") {
            showSuggestion(e.target);
        }
    }
});

document.addEventListener("focusout", (e) => {
    // Give a small delay to allow mousedown on the popup
    setTimeout(() => {
        if (document.activeElement !== activeInput) {
            hideSuggestion();
        }
    }, 150);
});

// Existing functionality for the "Fill" button in popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fill") {
        fillUsername(request.value);
    }
});

function fillUsername(value) {
    let target = document.activeElement;
    if (!isInput(target)) {
        target = findBestInput();
    }
    if (target) {
        target.focus();
        target.value = value;
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function isInput(el) {
    return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
        !["checkbox", "radio", "submit", "button", "hidden", "password"].includes(el.type);
}

function findBestInput() {
    const inputs = Array.from(document.querySelectorAll("input:not([type='password']):not([type='hidden']):not([type='submit'])"));
    const cues = ["user", "name", "login", "handle", "email"];
    for (const input of inputs) {
        const attrString = (input.name + " " + input.id + " " + input.placeholder).toLowerCase();
        if (cues.some(cue => attrString.includes(cue))) return input;
    }
    return inputs.find(input => {
        const rect = input.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && input.type !== "email";
    }) || inputs[0];
}
