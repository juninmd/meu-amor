from playwright.sync_api import sync_playwright
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f"file://{os.getcwd()}/index.html")

        # Verify Reasons Section exists
        reasons_btn = page.locator("#reasonsBtn")
        assert reasons_btn.is_visible(), "Reasons button not found"

        # Click the button
        print("Clicking 'Reasons' button...")
        reasons_btn.click()

        # Wait for animation/text
        time.sleep(1)

        # Check text in display
        display = page.locator("#reason-display")
        text = display.inner_text()
        print(f"Reason displayed: {text}")

        assert len(text) > 0, "No reason text displayed"
        assert '"' in text, "Reason text should be quoted"

        page.screenshot(path="verify_reasons.png")
        print("SUCCESS: Reasons feature verified.")

        browser.close()

if __name__ == "__main__":
    run()
