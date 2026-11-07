const DEFAULT_SETTINGS = Object.freeze({
    storageKey: "bookmarksData",
    categories: ["Work", "Study", "Entertainment"],
    defaultCategory: "Work"
});

const bookmarkForm = document.querySelector("#bookmarkForm");
const bookmarksList = document.querySelector("#bookmarksList");
const filterButtons = document.querySelectorAll(".filter-btn");

let bookmarks = [];
let currentFilter = "All";

function saveBookmarks() {
    localStorage.setItem(
        DEFAULT_SETTINGS.storageKey,
        JSON.stringify(bookmarks)
    );
}

function loadBookmarks() {
    const storedBookmarks = localStorage.getItem(
        DEFAULT_SETTINGS.storageKey
    );

    bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
}

function addBookMark(e) {
    e.preventDefault();

    const titleInput = document.querySelector("#websiteTitle");
    const urlInput = document.querySelector("#websiteUrl");
    const categoryInput = document.querySelector("#category");

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const category = categoryInput.value;

    if (!title || !url) {
        alert("Please enter title and URL.");
        return;
    }

    const newBookmark = {
        id: Date.now(),
        title: title,
        url: url,
        category: category
    };

    bookmarks.push(newBookmark);

    saveBookmarks();

    renderBookmarks();

    bookmarkForm.reset();
}

function filterBookmarks(categoryFilter) {
    if (categoryFilter === "All") {
        return bookmarks;
    }

    return bookmarks.filter(
        bookmark => bookmark.category === categoryFilter
    );
}

function renderBookmarks() {
    bookmarksList.innerHTML = "";

    const filteredBookmarks = filterBookmarks(currentFilter);

    if (filteredBookmarks.length === 0) {
        bookmarksList.innerHTML = "<p>No bookmarks found.</p>";
        return;
    }

    filteredBookmarks.forEach(bookmark => {
        const bookmarkItem = document.createElement("div");
        bookmarkItem.classList.add("bookmark-item");

        const bookmarkInfo = document.createElement("div");
        bookmarkInfo.classList.add("bookmark-info");

        const heading = document.createElement("h3");
        heading.textContent = bookmark.title;

        const link = document.createElement("a");
        link.href = bookmark.url;
        link.textContent = bookmark.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const category = document.createElement("div");
        category.classList.add("bookmark-category");
        category.textContent = bookmark.category;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = bookmark.id;

        bookmarkInfo.appendChild(heading);
        bookmarkInfo.appendChild(link);
        bookmarkInfo.appendChild(category);

        bookmarkItem.appendChild(bookmarkInfo);
        bookmarkItem.appendChild(deleteButton);

        bookmarksList.appendChild(bookmarkItem);

        deleteButton.addEventListener("click", () => {
            deleteBookmark(bookmark.id);
        });
    });
}

function deleteBookmark(id) {
    bookmarks = bookmarks.filter(
        bookmark => bookmark.id !== id
    );

    saveBookmarks();

    renderBookmarks();
}

function init() {
    loadBookmarks();

    bookmarkForm.addEventListener(
        "submit",
        addBookMark
    );

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.dataset.category;

            renderBookmarks();
        });
    });

    renderBookmarks();
}

init();
