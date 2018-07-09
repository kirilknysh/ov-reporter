# ov-reporter
## Google Chrome extension

1. Clone the repository or download the sources
2. Enable "Developer mode":

![Enable "Developer mode"](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/chrome-ext-enable.gif)

3. Click "Load unpacked" and choose the chrome-ext directory:
![Load unpacked](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/chrome-ext-load.gif)

4. Verify that the grayed out icon has appeared in the extensions bar:

![Disabled icon](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/icon-disabled.png)

5. Go to https://www.ov-chipkaart.nl/mijn-ov-chip/mijn-ov-reishistorie.htm (log in if not yet);
6. Select the card:

![Select the card](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/choose-card.png)

7. Select the reporting period:

![Select the period](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/period.png)

8. Verify that the icon in the extensions bar is now active:

![Active icon](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/icon-enabled.png)

9. Click the icon and check the weekdays you want to include into the report. Check the "PDF export once done" if you don't want to make any changes once the report is generated (in the end you'll see the prompt to save the output PDF file):

![Extension window](https://github.com/kirilknysh/ov-reporter/blob/master/chrome-ext/docs/window.png)

10. Click "Make report" button and wait. It's important to not switch the tab - just wait, it should take couple of seconds:

![Progress](https://github.com/kirilknysh/ov-reporter/blob/master/chrome-ext/docs/progress.png)

11. Choose one of the export options or immediately save the proposed report (if "PDF export once done" has been checked):


![Export](https://raw.githubusercontent.com/kirilknysh/ov-reporter/master/chrome-ext/docs/export-to.png)
