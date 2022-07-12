import { isEscapeKey, trapFocus } from './utils.js';

const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const imageElement = bigPicture.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const captionElement = bigPicture.querySelector('.social__caption');
const allCommentsCountElement = bigPicture.querySelector('.comments-count');
const currentCommentsCountElement =
  bigPicture.querySelector('.comments-current');
const commentsLoader = bigPicture.querySelector('.comments-loader');
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

const createComments = (comments) => {
  commentsElement.innerHTML = '';
  const commentsFragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsFragment.append(commentElement);
  });
  commentsElement.append(commentsFragment);
};

const createGallery = ({ url, likes, comments, description }) => {
  imageElement.src = url;
  likesCountElement.textContent = likes;
  allCommentsCountElement.textContent = comments.length;
  captionElement.textContent = description;

  let currentCommentCount = Math.min(5, comments.length);
  let currentComments = comments.slice(0, currentCommentCount);
  currentCommentsCountElement.textContent = currentCommentCount;
  if (currentCommentCount === comments.length) {
    commentsLoader.classList.add('hidden');
  }

  const loadComments = () => {
    currentCommentCount += Math.min(5, comments.length - currentCommentCount);
    currentComments = comments.slice(0, currentCommentCount);
    currentCommentsCountElement.textContent = currentCommentCount;
    if (currentCommentCount === comments.length) {
      commentsLoader.classList.add('hidden');
    }
    createComments(currentComments);
  };

  commentsLoader.addEventListener('click', loadComments);

  createComments(currentComments);

  const focusHandler = trapFocus(bigPicture);

  const closeGallery = () => {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    bigPicture.removeEventListener('keydown', focusHandler);
    document.removeEventListener('keydown', escapeHandler);
    commentsLoader.removeEventListener('click', loadComments);
    commentsLoader.classList.remove('hidden');
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
    bigPicture.addEventListener('keydown', focusHandler);
    closeButton.focus();

    document.addEventListener('keydown', escapeHandler);
  };

  closeButton.addEventListener('click', () => {
    closeGallery();
  });

  showGallery();
};

export { createGallery };
