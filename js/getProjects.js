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
    appendImageContainer(postContainer, element.imgs, index);
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

function appendImageContainer(postContainer, imgs, index) {    
    if (imgs.length === 0) {
        return;
    }
    const firstImage = imgs[0];    
    const imageContainerHtml = /*html*/`
    <div class="image-container">
        ${ appendImage(index, firstImage) }
        ${ imgs.length > 1 ? 
            /*html*/`<div id="button-next-${index}" class="image-arrow image-arrow-right"></div> 
            <div id="button-back-${index}" class="image-arrow image-arrow-left"></div>` 
        : "" }    
    </div>
    <div id="label-image-index-${index}" class="label-small">1/${imgs.length}</div>
    `;

    postContainer.insertAdjacentHTML("beforeend", imageContainerHtml);

    if (imgs.length > 1) {
        const backButton = document.getElementById(`button-back-${index}`);
        backButton.onclick = () => changeImage(imgs, index, -1);
    
        const nextButton = document.getElementById(`button-next-${index}`);
        nextButton.onclick = () => changeImage(imgs, index, 1);
    }
}

function changeImage(imgs, postIndex, moveTo) {
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    const postImage = document.getElementById(`post-image-${postIndex}`);
    const currentImageIndex = Number(postImage.getAttribute("imgIndex"));
    const nextImageIndex = clamp(currentImageIndex + moveTo, 0, imgs.length - 1);
    if (currentImageIndex === nextImageIndex) {
        return;
    }

    const nextImage = imgs[nextImageIndex];
    if (nextImage === undefined) {
        console.error("nextImage is undefined");
        return;
    }
    postImage.setAttribute("imgIndex", nextImageIndex);
    postImage.src = nextImage.img;

    const indexLabel = document.getElementById(`label-image-index-${postIndex}`);
    indexLabel.innerHTML = `${nextImageIndex + 1}/${imgs.length}`;

    const postImageHint = document.getElementById(`post-image-hint-${postIndex}`);
    if (postImageHint) {
        postImageHint.innerHTML = nextImage.hint; 
    }
}

function appendImage(postIndex, img) {
    if (img === undefined) {
        return "";
    }
    return /*html*/`<img id="post-image-${postIndex}" imgIndex="0" src=${img.img} alt=${img.img}></img>` 
    + (img.hint ? /*html*/`<div id="post-image-hint-${postIndex}" class="label-extra-small">${img.hint}</div>` : "");
}