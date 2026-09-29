# Chrome Web Store listing

Text to paste into the Chrome Web Store Developer Dashboard. This file is not part of the extension package.

## Store listing

**Name:** Image Credit

**Summary** (limit 132 characters):

```
Right click an image to copy a credit line with the photographer, site name, site URL, page title and date.
```

**Category:** Productivity

**Language:** English

**Description:**

```
Image Credit copies a ready to paste credit line for any image on a web page.

HOW IT WORKS
Right click an image and choose "Copy image credit". The credit line is copied to your clipboard, and a short message on the page confirms it.

WHAT THE CREDIT LOOKS LIKE
Image credit: Photographer Name / Agency, Site Name (https://www.example.com), "Page title" (documented on 29 September 2026)

WHAT IT INCLUDES
• The photographer or creator, when the page publishes one. The extension reads dedicated credit elements, image captions, and the alt and title text of the image. It recognizes labels such as "Photo:" and "Credit:", text after a copyright sign, and a credit written in parentheses at the end of a caption.
• The site name and the main address of the site.
• The title of the page.
• The date the credit was created.

LANGUAGE
The credit follows the language of the page. Hebrew pages get a Hebrew credit line, and English pages, as well as pages in other languages, get an English one. Names, site names and page titles are copied as the page publishes them and are not translated.

PRIVACY
The extension runs only when you click its menu item, and only in the tab you clicked in. It does not collect, store or send any data, and it has no account, analytics or external requests.

LIMITATIONS
• Sites publish credits in many different ways. The detection is a best effort, so check the copied text before you publish it. If no photographer is found, the credit is still copied without a name.
• The menu item appears only when you right click directly on an image element. Images that are set as CSS backgrounds, or that are covered by a transparent layer, may not show it.
• The extension does not work on Chrome internal pages or on the Chrome Web Store.

PERMISSIONS
• contextMenus: adds the item to the right click menu.
• activeTab: lets the extension read the current page only after you click the item.
• scripting: runs the small script that builds the credit line and copies it.
```

**Screenshots to prepare:** at least one, showing the right click menu on an image and the credit line pasted into a text field. Check the accepted sizes in the dashboard when you upload.

## Privacy practices tab

**Single purpose:**

```
Copy a formatted credit line for an image the user right clicks, using information that the page publishes about that image.
```

**Permission justifications:**

`contextMenus`
```
Adds the "Copy image credit" item to the right click menu on images. This is the only way the user starts the extension.
```

`activeTab`
```
Gives temporary access to the current tab only after the user clicks the menu item, so the extension can read the page title, the site name and the caption or credit of the clicked image. The extension does not request access to all websites.
```

`scripting`
```
Runs a small function in the active tab that reads the information above, builds the credit line and copies it to the clipboard.
```

**Remote code:** No. All code is included in the package.

**Data usage:** The extension does not collect, store or transmit user data. It reads page information locally only when the user clicks the menu item. If the form asks which data types are collected, select none, and confirm the three certifications about data use. Check the wording of the form when you fill it in, because it can change.

**Privacy policy URL:** `https://github.com/amirojkes/ImageCreditExtension/blob/main/PRIVACY.md` (the link works after this file is pushed to the repository)

**Support URL:** `https://github.com/amirojkes/ImageCreditExtension/issues`

## Notes for the reviewer (if the dashboard has a field for it)

```
Open any news article that has a captioned photo, for example an article on a major news site. Right click the photo and choose "Copy image credit". A small message appears at the bottom right of the page. Paste the clipboard into any text field to see the credit line. No account or login is needed.
```
