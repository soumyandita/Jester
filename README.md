# Jester — Joke Generator

A responsive, modern joke generator built with **HTML, CSS, and vanilla JavaScript**. It fetches safe jokes from JokeAPI and lets users save favorites in their browser.

## Features

- Fetch jokes from multiple categories
- Responsive layout for desktop and mobile
- Dark and light themes
- Save and remove favorite jokes
- Favorites persist using `localStorage`
- Copy jokes to the clipboard
- Loading, error, and success feedback
- Accessible labels and keyboard focus styles
- No frontend framework or build step required

## Tech stack

- HTML5
- CSS3 (custom properties, Flexbox, responsive media queries)
- Vanilla JavaScript (Fetch API, async/await, DOM manipulation, localStorage)
- [JokeAPI](https://jokeapi.dev/)

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a browser, or use the **Live Server** extension in VS Code.
3. Make sure you have an internet connection so the app can request jokes from JokeAPI.

## Project structure

```text
joke-generator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## API

The app requests jokes from:

`https://v2.jokeapi.dev/joke/{category}?safe-mode`

JokeAPI is an external service, so fetching jokes requires an internet connection and may occasionally fail.

## Deploy

You can publish this static project with GitHub Pages:

1. Push the project files to a GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under the build/deployment section, choose **Deploy from a branch**.
4. Select your main branch and the root folder, then save.
5. Wait for GitHub Pages to publish the site and open the provided URL.

## Future improvements

- Add a search/filter option for saved jokes
- Add automated tests
- Add a share-joke feature
- Add a small CI workflow for linting

## License

This project is available for learning and portfolio use. Check the JokeAPI terms before using the API in a commercial product.
