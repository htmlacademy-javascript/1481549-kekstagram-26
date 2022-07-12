import { generatePhotos } from './data.js';
import { createGallery } from './gallery.js';

const picturesElement = document.querySelector('.pictures');
const pictureTemplate = document
  .querySelector('#picture')
  .content.querySelector('.picture');
const picturesFragment = document.createDocumentFragment();

const pictures = generatePhotos();

pictures.forEach((picture) => {
  const { url, likes, comments } = picture;
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__comments').textContent =
    comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.addEventListener('click', () => {
    createGallery(picture);
  });
  picturesFragment.appendChild(pictureElement);
});

picturesElement.appendChild(picturesFragment);
