from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # --- SCENARIO 1: Before Wedding (Nov 1, 2024) ---
        print("\n--- SCENARIO 1: Before Wedding (2024) ---")
        context1 = browser.new_context()
        context1.add_init_script("""
            const MOCKED_DATE = new Date('2024-11-01T12:00:00').getTime();
            const START_TIME = Date.now();
            const OriginalDate = Date;
            window.Date = class extends OriginalDate {
                constructor(...args) {
                    if (args.length === 0) return new OriginalDate(MOCKED_DATE + (OriginalDate.now() - START_TIME));
                    return new OriginalDate(...args);
                }
                static now() { return MOCKED_DATE + (OriginalDate.now() - START_TIME); }
            };
        """)
        page1 = context1.new_page()
        page1.goto(f"file://{os.getcwd()}/index.html")
        page1.wait_for_timeout(1000)

        # Click Enter on Overlay
        if page1.is_visible("#enterBtn"):
            page1.click("#enterBtn")
            page1.wait_for_timeout(1000)

        # Verify Relationship Timer
        rel_timer = page1.inner_text("#relationship-timer")
        print(f"Rel Timer (2024): {rel_timer.replace('\\n', ' ')}")
        if "DIAS" in rel_timer.upper():
            print("SUCCESS: Relationship timer active.")
        else:
            print("FAILURE: Relationship timer missing.")

        # Verify Wedding Countdown
        wedding_title = page1.inner_text("#wedding-title")
        print(f"Wedding Title: {wedding_title}")
        assert "CONTAGEM REGRESSIVA" in wedding_title.upper()

        wedding_timer = page1.inner_text("#wedding-timer")
        print(f"Wedding Timer (2024): {wedding_timer.replace('\\n', ' ')}")
        assert "DIAS" in wedding_timer.upper()

        # Verify Bodas hidden
        bodas_visible = page1.is_visible("#bodas-display")
        if not bodas_visible:
            print("SUCCESS: Bodas hidden.")
        else:
            print("FAILURE: Bodas visible prematurely!")

        page1.screenshot(path="verify_scenario_1.png")

        # --- SCENARIO 2: After Wedding (Nov 30, 2030 - 5 Years Married) ---
        print("\n--- SCENARIO 2: After Wedding (2030) ---")
        context2 = browser.new_context()
        context2.add_init_script("""
            const MOCKED_DATE = new Date('2030-11-30T12:00:00').getTime(); // 5 years and 1 day after wedding
            const START_TIME = Date.now();
            const OriginalDate = Date;
            window.Date = class extends OriginalDate {
                constructor(...args) {
                    if (args.length === 0) return new OriginalDate(MOCKED_DATE + (OriginalDate.now() - START_TIME));
                    return new OriginalDate(...args);
                }
                static now() { return MOCKED_DATE + (OriginalDate.now() - START_TIME); }
            };
        """)
        page2 = context2.new_page()
        page2.goto(f"file://{os.getcwd()}/index.html")
        page2.wait_for_timeout(1000)

        # Click Enter on Overlay
        if page2.is_visible("#enterBtn"):
            page2.click("#enterBtn")
            page2.wait_for_timeout(1000)

        # Verify Wedding Title (Should change to "Casados há")
        wedding_title_2 = page2.inner_text("#wedding-title")
        print(f"Wedding Title (2030): {wedding_title_2}")
        assert "CASADOS HÁ" in wedding_title_2.upper()

        # Verify Bodas
        bodas_text = page2.inner_text("#bodas-display")
        print(f"Bodas Text: {bodas_text}")
        assert "Bodas de Madeira" in bodas_text
        print("SUCCESS: Bodas de Madeira detected.")

        page2.screenshot(path="verify_scenario_2.png")

        browser.close()

if __name__ == "__main__":
    run()
