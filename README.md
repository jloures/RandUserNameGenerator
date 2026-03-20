# RandUserNameGenerator

A minimalist, high-performance Firefox extension for generating and auto-filling random usernames.

![UserGen Icon](icons/icon128.png)

## Features

- **Minimalist Design**: Clean, monochrome interface that stays out of your way.
- **Two Generation Modes**:
  - **Friendly**: Human-readable combinations (e.g., `SwiftFalcon77`).
  - **Alphanumeric**: Secure random strings (e.g., `a7f2kL9_x`).
- **One-Click Fill**: Detects and fills username/email fields on any website.
- **Customization**: Toggle numbers, symbols, and adjust length.
- **Privacy First**: Runs entirely locally; no data ever leaves your browser.

## Installation (Local Development)

1. Clone or download this repository.
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file in this directory.

## Usage

1. Click the **UserGen** icon in your toolbar.
2. Choose your preferred style and options.
3. Click **Regenerate** to get a new name.
4. Click **Fill Active Field** to inject the name into the signup form on your current page.

## License
MIT
