# PoketFlag
PoketFlag - a link saving application

A simple, static web app to save, tag, search, and organize links you want to
revisit later. Everything is stored locally in your browser via
`localStorage` — no backend required.

## Features
- Save a link with an optional title and comma-separated tags
- Auto-derives a title from the URL's hostname if none is given
- Search links by title, URL, or tag
- Filter by tag using the dropdown
- Delete saved links

## Usage
Just open `index.html` in your browser — no build step or server needed.

```
PoketFlag/
├── index.html   # App markup
├── style.css    # Styling
├── script.js    # App logic (localStorage persistence)
└── README.md
```

## Tech
Vanilla HTML, CSS, and JavaScript. No frameworks or dependencies.

