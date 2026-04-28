# Personal Website

This is a simple static personal website inspired by the `al-folio` layout.

Core files:

- `index.html`
- `styles.css`
- `script.js`
- `assets/img/Profile Picture.jpg`
- `sections/`

No Ruby, Jekyll, WSL, Docker, or npm build step is required.

## Run Locally

Opening `index.html` directly from the filesystem will not load section files, because browsers
block `fetch()` requests from `file://` pages. VS Code Live Server also works; open
`http://127.0.0.1:5500/index.html`.

## Deploy

Push to `main` or `master`. GitHub Actions will publish the static site using:

```text
.github/workflows/deploy.yml
```

In the GitHub repository settings, set `Settings -> Pages -> Source` to `GitHub Actions`.

For a custom domain, add your domain in `Settings -> Pages -> Custom domain`. GitHub will create
or expect a root-level `CNAME` file containing only the domain name, for example:

```text
example.com
```

If using the included GitHub Actions workflow, keep the `CNAME` file in the repo root so it is
published with the site.

The `al-folio` folder is kept only as the untouched reference copy.

## Structure

```text
.
|-- index.html
|-- styles.css
|-- script.js
|-- assets/
|   |-- img/
|   |   `-- Profile Picture.jpg
|-- sections/
|   |-- about.html
|   |-- news.html
|   |-- publications.html
|   `-- service.html
|-- .github/workflows/deploy.yml
`-- al-folio/
```
