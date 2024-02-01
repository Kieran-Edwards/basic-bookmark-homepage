const createBookmarks = (items) => {
    document.querySelector(".bookmarks-card").innerHTML = generateBookmarkItem(items[0].children);

    document.querySelectorAll('.js-item-folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const folderID = folder.dataset.folder;
            const subContainer = document.querySelector('.js-item-exploded[data-folder="' + folderID + '"]');
            const icon = subContainer.style.display === 'none' ? '-' : '+';

            folder.querySelector('.js-item-expand').innerHTML = icon;
            subContainer.style.display = (subContainer.style.display === 'none') ? 'block' : 'none';
        });
    });
};

const browserAPI = typeof browser === 'undefined' ? chrome : browser;
const subTree = typeof browser === 'undefined' ? '1' : 'toolbar_____';

browserAPI.storage.sync.get('options', () =>
    browserAPI.bookmarks.getSubTree(subTree, items =>
        createBookmarks(items)
    )
);

const generateBookmarkItem = (item) => {
    if (Array.isArray(item)) {
        return item.map(obj => generateBookmarkItem(obj)).join('');
    } else if (item.url !== undefined) {

        const faviconUrl = `https://www.google.com/s2/favicons?sz=16&domain_url=${encodeURIComponent(item.url)}`;

        return (
            `<a class='item' href='${item.url}'>
                <div class='item__icon'>
                    <img src='${faviconUrl}'/>
                </div>
                <div class='item__title'>
                    ${item.title}
                    <div class='item__url'>${item.url}</div>
                </div>
            </a>`
        );
    } else {
        return (
            `<div class='item item__folder js-item-folder' data-folder='${item.id}'>
                <div class='item__icon js-item-expand'>+</div>
                <div class='item__title'>${item.title}</div>
            </div>
            <div class='item__exploded js-item-exploded' data-folder='${item.id}' style='display:none;'>
                ${generateBookmarkItem(item.children)}
            </div>`
        );
    }
}

const updateClock = () => {
    const today = new Date();
    const clockElement = document.getElementById('js-clock');
    const dateElement = document.getElementById('js-date');

    clockElement.innerHTML = today.toLocaleTimeString('en-GB', { 
        hour: '2-digit',
        minute: '2-digit' 
    });

    dateElement.innerHTML = today.toLocaleString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    setInterval(updateClock, 5000);
};

updateClock();

