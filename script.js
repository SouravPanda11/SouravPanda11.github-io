const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");
const year = document.querySelector("#year");
const content = document.querySelector("#content");
const siteUpdated = document.querySelector("#site-updated");
const siteHeader = document.querySelector(".site-header");
const siteFiles = ["index.html", "styles.css", "script.js"];
const sections = [
  "sections/about.html",
  "sections/news.html",
  "sections/publications.html",
  "sections/service.html",
];

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);

  if (themeToggle) {
    const label = nextTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }
}

setTheme(document.documentElement.dataset.theme);

if (year) {
  year.textContent = new Date().getFullYear();
}

function formatUpdatedDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getLastModified(path) {
  const response = await fetch(path, { method: "HEAD", cache: "no-store" });
  const modified = response.headers.get("Last-Modified");

  if (!modified) {
    return null;
  }

  const date = new Date(modified);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function updateModifiedDates() {
  const paths = [...siteFiles, ...sections];
  const modifiedDates = (await Promise.all(paths.map((path) => getLastModified(path).catch(() => null)))).filter(Boolean);

  if (siteUpdated && modifiedDates.length) {
    const latest = new Date(Math.max(...modifiedDates.map((date) => date.getTime())));
    siteUpdated.textContent = formatUpdatedDate(latest);
  }

  document.querySelectorAll("[data-updated-from]").forEach(async (element) => {
    const modified = await getLastModified(element.dataset.updatedFrom).catch(() => null);

    if (modified) {
      element.textContent = formatUpdatedDate(modified);
    }
  });
}

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

function updateBrandVisibility() {
  const aboutSection = document.querySelector("#about");

  if (!aboutSection || !siteHeader) {
    return;
  }

  const aboutBottom = aboutSection.getBoundingClientRect().bottom;
  const headerHeight = siteHeader.getBoundingClientRect().height;
  document.body.classList.toggle("show-brand", aboutBottom <= headerHeight);
}

async function loadSections() {
  if (!content) {
    return;
  }

  try {
    const html = await Promise.all(
      sections.map(async (sectionPath) => {
        const response = await fetch(sectionPath);

        if (!response.ok) {
          throw new Error(`Unable to load ${sectionPath}`);
        }

        return response.text();
      }),
    );

    content.innerHTML = html.join("\n");
    updateBrandVisibility();
    updateModifiedDates();

    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  } catch (error) {
    content.innerHTML =
      '<section class="section"><h1>Unable to load content</h1><p>Please run this site through a local server and refresh the page.</p></section>';
    console.error(error);
  }
}

loadSections();
updateModifiedDates();
window.addEventListener("scroll", updateBrandVisibility, { passive: true });
window.addEventListener("resize", updateBrandVisibility);
