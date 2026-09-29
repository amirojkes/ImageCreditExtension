# Image Credit

A small Chrome extension (Manifest V3). Right click an image on any page, choose "Copy image credit", and a credit line is copied to the clipboard.

## Output format

On an English page, and on pages in any language other than Hebrew:

```
Image credit: <photographer or creator>, <site name> (<site URL>), "<page title>" (documented on <date>)
```

On a Hebrew page:

```
קרדיט תמונה: <photographer or creator>, <site name> (<site URL>), "<page title>" (תועד בתאריך <date>)
```

Example:

```
Image credit: Israel Police, The Times of Israel (https://www.timesofisrael.com), "Article title" (documented on 29 September 2026)
```

If no photographer or creator is found, that part is left out:

```
Image credit: <site name> (<site URL>), "<page title>" (documented on <date>)
```

- **Photographer or creator:** read from the credit that the page publishes for the clicked image (see below).
- **Site name:** taken from the `og:site_name` meta tag if the page defines one, otherwise from the domain name.
- **Site URL:** the main address of the site (`location.origin`), without the article path.
- **Page title:** the browser tab title (`document.title`).
- **Date:** the day the credit was created. It is written as `29 September 2026` in English and `29.9.2026` in Hebrew.

The photographer name, site name and page title are copied as the page publishes them and are not translated. Nothing is sent to any external service. All processing happens inside the page.

## Page language

The page title decides the language of the credit line. If it has more Hebrew letters than Latin letters, the Hebrew format is used, and if it has more Latin letters, the English format is used. If the title does not decide (for example it has no letters), the `lang` attribute of the page is used. Pages in other languages get the English format.

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
5. Right click an image on any page and choose "Copy image credit".

After changing the code, click the reload button on the extension card.

## Files

- `manifest.json`: extension definition and permissions (`contextMenus`, `activeTab`, `scripting`).
- `background.js`: creates the context menu item and runs the credit builder inside the active page.
- `icons/`: the extension icons. `tools/make_icons.py` regenerates them using only the Python standard library.
- `PRIVACY.md`: the privacy policy.
- `store/listing.md`: text for the Chrome Web Store listing and the review form.
- `CHANGELOG.md`: version history. Each release has a git tag such as `v1.2.0`.

The extension package for the store contains only `manifest.json`, `background.js` and `icons/`.

## Known limitations

- Sites publish credits in many different ways. The detection is a heuristic and may miss a credit, or take a trailing parenthetical that is not a credit. Check the copied text before publishing.
- The menu item appears only when the right click lands on an `<img>` element. Some sites place a transparent layer over the image or use a CSS background image, and there the menu will not appear.
- The extension cannot run on restricted pages such as `chrome://` pages and the Chrome Web Store.
- Many sites include the site name at the end of the page title, so the name may appear twice in the credit.
- The credit extraction was tested against mock page structures and manually on one live news site, not against a wide range of sites. Clipboard behavior may differ between sites.

## Debugging

Each time the menu item is used, a line starting with `[ImageCredit]` is written to the console of the page. It shows the image address, how many matching images were found, the detected credit and the language that was chosen.
