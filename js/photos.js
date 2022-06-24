import { generatePhotos } from './data.js';

const picturesElement = document.querySelector('.pictures');
const pictureTemplate = document
  .querySelector('#picture')
  .content.querySelector('.picture');
const picturesFragment = document.createDocumentFragment();

const pictures = generatePhotos();

pictures.forEach(({ url, likes, comments }) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__comments').textContent =
    comments.length;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  picturesFragment.appendChild(pictureElement);
});

picturesElement.appendChild(picturesFragment);
