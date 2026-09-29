# Image Credit Extension

A small Chrome extension (Manifest V3). Right click an image on any page, choose "העתק קרדיט לתמונה" (Copy image credit), and a credit line is copied to the clipboard.

## Output format

```
קרדיט תמונה: <site name> (<site URL>), "<page title>" (נוצר בתאריך <date>)
```

Example:

```
קרדיט תמונה: ynet (https://www.ynet.co.il), "Article title" (נוצר בתאריך 29.9.2026)
```

- **Site name:** taken from the `og:site_name` meta tag if the page defines one, otherwise from the domain name.
- **Site URL:** the main address of the site (`location.origin`), without the article path.
- **Page title:** the browser tab title (`document.title`).
- **Date:** the day the credit was created, in Hebrew locale format.

Nothing is sent to any external service. All processing happens inside the page.

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Turn on "Developer mode".
4. Click "Load unpacked" and select the repository folder (the one containing `manifest.json`).
5. Right click an image on any page and choose "העתק קרדיט לתמונה".

After changing the code, click the reload button on the extension card.

## Files

- `manifest.json`: extension definition and permissions (`contextMenus`, `activeTab`, `scripting`).
- `background.js`: creates the context menu item and runs the credit builder inside the active page.

## Known limitations

- The menu item appears only when the right click lands on an `<img>` element. Some sites place a transparent layer over the image or use a CSS background image, and there the menu will not appear.
- The extension cannot run on restricted pages such as `chrome://` pages and the Chrome Web Store.
- Many sites include the site name at the end of the page title, so the name may appear twice in the credit.
- The code has been tested manually in Chrome only. Clipboard behavior may differ between sites.

---

# תוסף קרדיט לתמונה

תוסף כרום קטן (Manifest V3). קליק ימני על תמונה בכל דף, בחירה ב"העתק קרדיט לתמונה", והטקסט מועתק ללוח.

## פורמט הקרדיט

```
קרדיט תמונה: <שם האתר> (<כתובת האתר>), "<כותרת הדף>" (נוצר בתאריך <תאריך>)
```

- **שם האתר:** מתג `og:site_name` אם קיים בדף, ואחרת שם הדומיין.
- **כתובת האתר:** הכתובת הראשית של האתר, ללא הנתיב של הכתבה.
- **כותרת הדף:** כותרת הלשונית בדפדפן.
- **תאריך:** מועד יצירת הקרדיט.

לא נשלח מידע לשום שירות חיצוני.

## התקנה

1. מורידים או משכפלים את הריפו.
2. נכנסים ל־`chrome://extensions` ומפעילים "מצב מפתח".
3. לוחצים "טען הרחבה שאינה ארוזה" ובוחרים את תיקיית הריפו (התיקייה שמכילה את `manifest.json`).
4. קליק ימני על תמונה ובחירה ב"העתק קרדיט לתמונה".

אחרי שינוי בקוד יש ללחוץ על כפתור הרענון בכרטיס ההרחבה.

## מגבלות ידועות

- האפשרות מופיעה רק כשהקליק הימני נופל על אלמנט `<img>`. באתרים שבהם מונחת שכבה שקופה מעל התמונה או שהתמונה מוגדרת כרקע ב־CSS, התפריט לא יופיע.
- התוסף לא פועל בדפים מוגבלים כמו `chrome://` וחנות ההרחבות.
- באתרים רבים שם האתר מופיע כבר בסוף כותרת הדף, ולכן הוא עלול להופיע פעמיים בקרדיט.
- הקוד נבדק ידנית בכרום בלבד. התנהגות ההעתקה ללוח עשויה להשתנות בין אתרים.
