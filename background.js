// background.js - Firefox MV3
// This script runs when events occur and unloads when idle.

chrome.runtime.onInstalled.addListener(() => {
    console.log("RandUserNameGenerator installed.");

    // Initialize default settings
    chrome.storage.sync.get(["settings"], (result) => {
        if (!result.settings) {
            chrome.storage.sync.set({
                settings: {
                    style: "friendly", // "friendly" or "random"
                    includeNumbers: true,
                    includeSymbols: false,
                    length: 12
                }
            });
        }
    });
});
