# Image Credit Extension

A small Chrome extension (Manifest V3). Right click an image on any page, choose "העתק קרדיט לתמונה" (Copy image credit), and a credit line is copied to the clipboard.

## Output format

The whole credit line is written in the language of the page. On a Hebrew page:

```
קרדיט תמונה: <photographer or creator>, <site name> (<site URL>), "<page title>" (תועד בתאריך <date>)
```

On an English page (and on pages in any other language):

```
Image credit: <photographer or creator>, <site name> (<site URL>), "<page title>" (documented on <date>)
```

Example:

```
Image credit: Israel Police, The Times of Israel (https://www.timesofisrael.com), "Article title" (documented on 29 September 2026)
```

If no photographer or creator is found, that part is left out:

```
Image credit: <site name> (<site URL>), "<page title>" (documented on <date>)
```

**Language detection:** the page title decides. If it has more Hebrew letters than Latin letters, the Hebrew format is used, and if it has more Latin letters, the English format is used. If the title does not decide (for example it has no letters), the `lang` attribute of the page is used. The date is written as `29.9.2026` in Hebrew and `29 September 2026` in English. The photographer name, site name and page title are copied as the page publishes them, and are not translated.

- **Photographer or creator:** read from the credit that the page publishes for the clicked image (see below).
- **Site name:** taken from the `og:site_name` meta tag if the page defines one, otherwise from the domain name.
- **Site URL:** the main address of the site (`location.origin`), without the article path.
- **Page title:** the browser tab title (`document.title`).
- **Date:** the day the credit was created, in Hebrew locale format.

Nothing is sent to any external service. All processing happens inside the page.

## How the photographer or creator is found

The extension locates the clicked image in the page and looks for a credit in this order:

1. A dedicated credit element near the image: an element whose class name contains `credit` or `photographer`, whose `aria-label` contains `credit` (for example `aria-label="Image credit"`), or an `itemprop="creator"` element. The element does not have to be inside the same wrapper as the image. The extension searches the surrounding containers, up to five levels up, as long as they contain this one image and no other.
2. The image caption (`<figcaption>`, inside a `<figure>` or directly inside a `<picture>`, or an element whose class name or `aria-label` contains `caption`), then the `title` and `alt` attributes of the image.

From caption text it takes:

- A labeled credit such as `Photo: Name`, `Photo by Name`, `Credit: Name` or `צילום: שם`.
- A credit after a copyright sign, such as `© Name, AFP`.
- Otherwise, the last parenthetical at the end of the caption, for example `(Ronen Zvulun, Pool Photo via AP)`. This is the format used by The Times of Israel.

Only containers that hold the clicked image alone are searched, so a credit that belongs to a neighboring image in a gallery is not attached by mistake. When nothing is found, the credit line is still copied without a name, and the on page message says so.

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

- Sites publish credits in many different ways. The detection is a heuristic and may miss a credit, or take a trailing parenthetical that is not a credit. Check the copied text before publishing.
- The menu item appears only when the right click lands on an `<img>` element. Some sites place a transparent layer over the image or use a CSS background image, and there the menu will not appear.
- The extension cannot run on restricted pages such as `chrome://` pages and the Chrome Web Store.
- Many sites include the site name at the end of the page title, so the name may appear twice in the credit.
- The credit extraction was tested against mock page structures only, not against live sites. Clipboard behavior may differ between sites.

---

# תוסף קרדיט לתמונה

תוסף כרום קטן (Manifest V3). קליק ימני על תמונה בכל דף, בחירה ב"העתק קרדיט לתמונה", והטקסט מועתק ללוח.

## פורמט הקרדיט

כל שורת הקרדיט נכתבת בשפת הדף. בדף בעברית:

```
קרדיט תמונה: <צלם או יוצר>, <שם האתר> (<כתובת האתר>), "<כותרת הדף>" (תועד בתאריך <תאריך>)
```

בדף באנגלית (ובדף בכל שפה אחרת):

```
Image credit: <photographer or creator>, <site name> (<site URL>), "<page title>" (documented on <date>)
```

אם לא נמצא צלם או יוצר, החלק הזה מושמט, והקרדיט מורכב משם האתר, כתובתו, כותרת הדף והתאריך.

**זיהוי השפה:** כותרת הדף מכריעה. אם יש בה יותר אותיות עבריות מלטיניות, נבחר הפורמט בעברית, ואם יש יותר אותיות לטיניות, נבחר הפורמט באנגלית. אם הכותרת לא מכריעה (למשל אין בה אותיות), נעשה שימוש בתכונה `lang` של הדף. התאריך נכתב כ־`29.9.2026` בעברית וכ־`29 September 2026` באנגלית. שם הצלם, שם האתר וכותרת הדף מועתקים כפי שהדף מפרסם אותם ולא מתורגמים.

- **צלם או יוצר:** נקרא מהקרדיט שהדף מפרסם עבור התמונה שעליה לחצת.
- **שם האתר:** מתג `og:site_name` אם קיים בדף, ואחרת שם הדומיין.
- **כתובת האתר:** הכתובת הראשית של האתר, ללא הנתיב של הכתבה.
- **כותרת הדף:** כותרת הלשונית בדפדפן.
- **תאריך:** מועד יצירת הקרדיט.

לא נשלח מידע לשום שירות חיצוני.

## איך נמצא שם הצלם או היוצר

התוסף מאתר את התמונה בדף ומחפש קרדיט לפי הסדר הבא:

1. אלמנט קרדיט ייעודי ליד התמונה: אלמנט ששם המחלקה שלו כולל `credit` או `photographer`, שה־`aria-label` שלו כולל `credit` (למשל `aria-label="Image credit"`), או אלמנט עם `itemprop="creator"`. האלמנט לא חייב להיות באותה עטיפה של התמונה. התוסף מחפש בקונטיינרים שמסביב, עד חמש רמות למעלה, כל עוד הם מכילים את התמונה הזו ואף תמונה אחרת.
2. כיתוב התמונה (`<figcaption>`, בתוך `<figure>` או ישירות בתוך `<picture>`, או אלמנט ששם המחלקה או ה־`aria-label` שלו כוללים `caption`), ואחריו התכונות `title` ו־`alt` של התמונה.

מתוך טקסט הכיתוב נלקח:

- קרדיט עם תווית, כמו `Photo: Name`, `Photo by Name`, `Credit: Name` או `צילום: שם`.
- קרדיט אחרי סימן זכויות יוצרים, כמו `© Name, AFP`.
- אחרת, הסוגריים האחרונים בסוף הכיתוב, למשל `(Ronen Zvulun, Pool Photo via AP)`. זה הפורמט של The Times of Israel.

מחפשים רק בקונטיינרים שמכילים את התמונה הזו בלבד, כדי שקרדיט של תמונה שכנה בגלריה לא יצורף בטעות. אם לא נמצא דבר, הקרדיט עדיין מועתק בלי שם, וההודעה על המסך מציינת זאת.

## התקנה

1. מורידים או משכפלים את הריפו.
2. נכנסים ל־`chrome://extensions` ומפעילים "מצב מפתח".
3. לוחצים "טען הרחבה שאינה ארוזה" ובוחרים את תיקיית הריפו (התיקייה שמכילה את `manifest.json`).
4. קליק ימני על תמונה ובחירה ב"העתק קרדיט לתמונה".

אחרי שינוי בקוד יש ללחוץ על כפתור הרענון בכרטיס ההרחבה.

## מגבלות ידועות

- אתרים מפרסמים קרדיטים בדרכים שונות. הזיהוי מבוסס היוריסטיקה ועלול לפספס קרדיט, או לקחת סוגריים בסוף כיתוב שאינם קרדיט. כדאי לבדוק את הטקסט המועתק לפני פרסום.
- האפשרות מופיעה רק כשהקליק הימני נופל על אלמנט `<img>`. באתרים שבהם מונחת שכבה שקופה מעל התמונה או שהתמונה מוגדרת כרקע ב־CSS, התפריט לא יופיע.
- התוסף לא פועל בדפים מוגבלים כמו `chrome://` וחנות ההרחבות.
- באתרים רבים שם האתר מופיע כבר בסוף כותרת הדף, ולכן הוא עלול להופיע פעמיים בקרדיט.
- חילוץ הקרדיט נבדק על מבני דפים מדומים בלבד ולא על אתרים חיים. התנהגות ההעתקה ללוח עשויה להשתנות בין אתרים.
