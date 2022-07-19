import { loadPhotos } from './fetch.js';
import { createGallery } from './gallery.js';
import { getRandomInteger, debounce } from './utils.js';
import './fetch.js';

const ERROR_TIMEOUT = 2000;
const PHOTOS_RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const picturesElement = document.querySelector('.pictures');
const filtersElement = document.querySelector('.img-filters');
const filtersButtons = [
  ...filtersElement.querySelectorAll('.img-filters__button'),
];
const defaultFilterElement = filtersElement.querySelector('#filter-default');
const randomFilterElement = filtersElement.querySelector('#filter-random');
const popularFilterElement = filtersElement.querySelector('#filter-discussed');
const pictureTemplate = document
  .querySelector('#picture')
  .content.querySelector('.picture');
const picturesFragment = document.createDocumentFragment();
const errorElement = document
  .querySelector('#photos-error')
  .content.querySelector('.error')
  .cloneNode(true);

errorElement.classList.add('visually-hidden');
document.body.appendChild(errorElement);

// замыканиями не получится хэндлер сделать, поэтому так вот.
let picturesBackup;
const picturesHandler = (event) => {
  const [pictureElement] = event
    .composedPath()
    .filter((node) => node.classList && node.classList.contains('picture'));

  if (!pictureElement) {
    return;
  }

  const pictureId = Number(pictureElement.dataset.id);
  const [picture] = picturesBackup.filter(({ id }) => pictureId === id);

  createGallery(picture);
};

const renderPictures = (pictures) => {
  picturesBackup = pictures;
  // сначала удаляем всё что было в контейнере.
  const pictureElements = [...picturesElement.querySelectorAll('.picture')];
  pictureElements.forEach((element) => {
    element.parentNode.removeChild(element);
  });

  pictures.forEach((picture) => {
    const { id, url, likes, comments } = picture;
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__comments').textContent =
      comments.length;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.dataset.id = id;
    // pictureElement.addEventListener('click', () => {
    //   createGallery(picture);
    // });
    picturesFragment.appendChild(pictureElement);
  });

  picturesElement.appendChild(picturesFragment);
  picturesElement.addEventListener('click', picturesHandler);
};

const toggleFilterButton = (buttonElement) => {
  filtersButtons.forEach((button) =>
    button.classList.remove('img-filters__button--active')
  );
  buttonElement.classList.add('img-filters__button--active');
};

const createRandomElementGenerator = (arr) => {
  let usedIds = [];
  let ids = [];
  for (let i = 0; i < arr.length; i++) {
    ids = [...ids, i];
  }
  return () => {
    const notUsedIds = ids.filter((id) => !usedIds.includes(id));
    const randomId = notUsedIds[getRandomInteger(0, notUsedIds.length - 1)];
    usedIds = [...usedIds, randomId];
    return arr[randomId];
  };
};

const setupFilters = (photos) => {
  filtersElement.classList.remove('img-filters--inactive');

  const defaultPhotosHandler = debounce(() => {
    renderPictures(photos);
  }, DEBOUNCE_DELAY);

  const randomPhotosHandler = debounce(() => {
    const generator = createRandomElementGenerator(photos);
    const randomPhotos = Array.from({ length: PHOTOS_RANDOM_COUNT }, generator);
    renderPictures(randomPhotos);
  }, DEBOUNCE_DELAY);

  const sortedPhotosHandler = debounce(() => {
    const sortedPhotos = [...photos];
    sortedPhotos.sort((a, b) => b.comments.length - a.comments.length);
    renderPictures(sortedPhotos);
  }, DEBOUNCE_DELAY);

  defaultFilterElement.addEventListener('click', () => {
    toggleFilterButton(defaultFilterElement);
    defaultPhotosHandler();
  });
  randomFilterElement.addEventListener('click', () => {
    toggleFilterButton(randomFilterElement);
    randomPhotosHandler();
  });
  popularFilterElement.addEventListener('click', () => {
    toggleFilterButton(popularFilterElement);
    sortedPhotosHandler();
  });
};

loadPhotos(
  (photos) => {
    renderPictures(photos);
    setupFilters(photos);
  },
  () => {
    errorElement.classList.remove('visually-hidden');
    setTimeout(() => {
      errorElement.classList.add('visually-hidden');
    }, ERROR_TIMEOUT);
  }
);
