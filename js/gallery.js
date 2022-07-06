import { isEscapeKey, isTabKey } from './utils.js';

const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const imageElement = bigPicture.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const captionElement = bigPicture.querySelector('.social__caption');
// const currentCommentsCountElement = bigPicture.querySelector(
//   '.social__comment-count'
// );
const allCommentsCountElement = bigPicture.querySelector('.comments-count');
//const commentsLoader = bigPicture.querySelector('.comments-loader');
const commentsElement = bigPicture.querySelector('.social__comments');
const closeButton = bigPicture.querySelector('#picture-cancel');

const createCommentElement = ({ avatar, name, message }) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImg = document.createElement('img');
  avatarImg.classList.add('social__picture');
  avatarImg.src = avatar;
  avatarImg.alt = name;
  avatarImg.width = 35;
  avatarImg.height = 35;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = message;

  commentElement.append(avatarImg);
  commentElement.append(textElement);

  return commentElement;
};

const createGallery = ({ url, likes, comments, description }) => {
  imageElement.src = url;
  likesCountElement.textContent = likes;
  allCommentsCountElement.textContent = comments.length;
  captionElement.textContent = description;

  commentsElement.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsFragment.append(commentElement);
  });
  commentsElement.append(commentsFragment);
};

const focusableElements = bigPicture.querySelectorAll(
  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
);
const firstFocusableElement = focusableElements[0];
const lastFocusableElement = focusableElements[focusableElements.length - 1];

const focusHandler = (event) => {
  if (!isTabKey(event)) {
    return;
  }

  if (event.shiftKey) {
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }
};

const closeGallery = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  bigPicture.removeEventListener('keydown', (event) => focusHandler(event));
  document.removeEventListener('keydown', (event) => escapeHandler(event));
};

function escapeHandler(event) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closeGallery();
  }
}

const showGallery = () => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
  bigPicture.addEventListener('keydown', (event) => focusHandler(event));
  closeButton.focus();

  document.addEventListener('keydown', (event) => escapeHandler(event));
};

closeButton.addEventListener('click', () => {
  closeGallery();
});

export { createGallery, showGallery };
