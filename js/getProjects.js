import postsJson from "../assets/json/posts.json" with { type: "json" }

document.addEventListener("DOMContentLoaded", loadPosts);

function loadPosts() {
    console.log("load projects...");   
    const root = document.getElementById("root-posts-container");
    if (!root) {
        console.error("Can't get root");
        return;
    }
    postsJson.map((element, index) => appendNewPostContainer(root, element, index));
}

function appendNewPostContainer(root, element, index) {
    root.insertAdjacentHTML("beforeend", /*html*/`<div id="post-container-${index}" class="post-container">
        <div class="label-big">${element.name}</div>
        <div class="label-small">${element.desc}</div>                
    </div>`);

    const postContainer = document.getElementById(`post-container-${index}`);
    appendImageContainer(postContainer, element.name, element.imgs);
    appendLink(postContainer, element);
}

function appendLink(postContainer, element) {
    if (element.linkLabelIsHidden) {
        return;
    }

    postContainer.insertAdjacentHTML("beforeend", 
        (element.link !== "" ? /*html*/`<a class="label-small" href="${element.link}">${element.link}</a>` 
        : /*html*/`<div class="label-small">Ссылка на проект недоступна, так как проект является приватным.</div>`));
}

function appendImageContainer(postContainer, name, imgs) {    
    // Don't do anything if imgs array is empty
    if (imgs.length === 0) {
        return;
    }

    // Create bunch of images 
    let imagesHtml = '';
    imgs.forEach((img, idx) => {
        imagesHtml += appendImage(name, idx, img);
    });

    const imageContainerHtml = /*html*/`
    <div class="image-container" id="image-container-${name}">
        ${imagesHtml}
        ${imgs.length > 1 ? 
            /*html*/`<div id="button-next-${name}" class="image-arrow image-arrow-right"></div> 
            <div id="button-back-${name}" class="image-arrow image-arrow-left"></div>` 
        : ""}    
    </div>
    <div id="label-image-index-${name}" class="label-small">1/${imgs.length}</div>
    `;
    
    postContainer.insertAdjacentHTML("beforeend", imageContainerHtml);

    // Show first image
    showImageByIndex(imgs, name, 0);

    // Add Next-Back buttons
    if (imgs.length > 1) {
        const backButton = document.getElementById(`button-back-${name}`);
        if (backButton) {
            backButton.onclick = () => changeImage(imgs, name, -1);
        }
    
        const nextButton = document.getElementById(`button-next-${name}`);
        if (nextButton) {
            nextButton.onclick = () => changeImage(imgs, name, 1);
        }
    }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function changeImage(imgs, name, moveTo) {
    // Get current index from label
    const indexLabel = document.getElementById(`label-image-index-${name}`);
    if (!indexLabel) {
        return;
    }

    const currentText = indexLabel.innerHTML;
    const currentImageIndex = parseInt(currentText.split('/')[0]) - 1;
    const nextImageIndex = clamp(currentImageIndex + moveTo, 0, imgs.length - 1);

    if (currentImageIndex === nextImageIndex) {
        return;
    }

    showImageByIndex(imgs, name, nextImageIndex);
}

function showImageByIndex(imgs, name, index) {
    const container = document.getElementById(`image-container-${name}`);
    if (!container) {
        return;
    } 
            
    // Get all image wrappers
    const wrappers = container.querySelectorAll('.image-wrapper');    
    wrappers.forEach(wrapper => {
        wrapper.style.display = 'none';
    });
    
    // Show selected wrapper
    if (wrappers[index]) {
        wrappers[index].style.display = 'block';
    }
    
    // Update index label
    const indexLabel = document.getElementById(`label-image-index-${name}`);
    if (indexLabel) {
        indexLabel.innerHTML = `${index + 1}/${imgs.length}`;
    }
}

function appendImage(name, imageIndex, img) {
    if (img === undefined || !img.img) {
        return "";
    }
    
    return /*html*/`<div class="image-wrapper" style="display: none;">
        <img id="post-image-${name}-${imageIndex}" class="post-image" imgIndex="${imageIndex}" src="${img.img}" alt="${img.alt || img.img}">
        ${img.hint ? /*html*/`<div id="post-image-hint-${name}-${imageIndex}" class="label-extra-small">${img.hint}</div>` : ""}
    </div>`;
}