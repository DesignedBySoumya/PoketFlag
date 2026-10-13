const STORAGE_KEY = "poketflag.links";

const form = document.getElementById("link-form");
const urlInput = document.getElementById("url-input");
const titleInput = document.getElementById("title-input");
const tagInput = document.getElementById("tag-input");
const searchInput = document.getElementById("search-input");
const tagFilter = document.getElementById("tag-filter");
const linkList = document.getElementById("link-list");
const emptyState = document.getElementById("empty-state");

function getLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
}

function deriveTitle(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url;
  }
}

function parseTags(raw) {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function addLink(url, title, tags) {
  const links = getLinks();
  links.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    url,
    title: title || deriveTitle(url),
    tags,
    createdAt: new Date().toISOString(),
  });
  saveLinks(links);
}

function deleteLink(id) {
  const links = getLinks().filter((link) => link.id !== id);
  saveLinks(links);
  render();
}

function populateTagFilter(links) {
  const allTags = new Set();
  links.forEach((link) => link.tags.forEach((tag) => allTags.add(tag)));
  const currentValue = tagFilter.value;
  tagFilter.innerHTML = '<option value="">All tags</option>';
  [...allTags].sort().forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
  tagFilter.value = [...allTags].includes(currentValue) ? currentValue : "";
}

function render() {
  const links = getLinks();
  populateTagFilter(links);

  const query = searchInput.value.trim().toLowerCase();
  const activeTag = tagFilter.value;

  const filtered = links.filter((link) => {
    const matchesQuery =
      !query ||
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesTag = !activeTag || link.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  linkList.innerHTML = "";
  emptyState.style.display = filtered.length ? "none" : "block";
  emptyState.textContent = links.length
    ? "No links match your search."
    : "No links saved yet. Add one above!";

  filtered.forEach((link) => {
    const li = document.createElement("li");
    li.className = "link-item";

    const info = document.createElement("div");
    info.className = "link-info";

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.title;
    info.appendChild(anchor);

    const meta = document.createElement("div");
    meta.className = "link-meta";
    meta.textContent = new Date(link.createdAt).toLocaleString();
    link.tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "tag-pill";
      pill.textContent = tag;
      meta.appendChild(pill);
    });
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "link-actions";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteLink(link.id));
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    linkList.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const url = normalizeUrl(urlInput.value.trim());
  const title = titleInput.value.trim();
  const tags = parseTags(tagInput.value);

  if (!url) return;

  addLink(url, title, tags);
  form.reset();
  render();
});

searchInput.addEventListener("input", render);
tagFilter.addEventListener("change", render);

render();
