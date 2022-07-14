import { isEscapeKey, trapFocus } from './utils.js';
import { validate } from './validation.js';
import { initImageEditor, resetImageEditor } from './filters.js';

const body = document.body;
const form = document.querySelector('#upload-select-image');
const fileInput = document.querySelector('#upload-file');
const photoEditOverlay = document.querySelector('.img-upload__overlay');
const closeButton = photoEditOverlay.querySelector('.img-upload__cancel');
const hashTagInput = photoEditOverlay.querySelector('.text__hashtags');
const commentInput = photoEditOverlay.querySelector('.text__description');
const errorElement = document
  .querySelector('#error')
  .content.querySelector('.error')
  .cloneNode(true);
const successElement = document
  .querySelector('#success')
  .content.querySelector('.success')
  .cloneNode(true);
const errorContinueButton = errorElement.querySelector('.error__button');
const successContinueButton = successElement.querySelector('.success__button');
const errorTitleElement = errorElement.querySelector('.error__title');

const focusHandler = trapFocus(photoEditOverlay);
const errorFocusHandler = trapFocus(errorElement);
const succsessFocusHandler = trapFocus(successElement);

errorElement.classList.add('visually-hidden');
successElement.classList.add('visually-hidden');
form.appendChild(errorElement);
form.appendChild(successElement);

const showErrorModal = () => {
  errorContinueButton.focus();
  errorElement.classList.remove('visually-hidden');
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  errorElement.addEventListener('keydown', errorFocusHandler);
  document.removeEventListener('keydown', escapeHandler);
};

const showSuccessModal = () => {
  successContinueButton.focus();
  document.removeEventListener('keydown', escapeHandler);
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  successElement.classList.remove('visually-hidden');
  successElement.addEventListener('keydown', succsessFocusHandler);
};

const closePhotoEditOverlay = () => {
  errorTitleElement.innerHtml = '';
  hashTagInput.value = '';
  commentInput.value = '';
  fileInput.value = null;
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  errorElement.removeEventListener('keydown', errorFocusHandler);
  successElement.removeEventListener('keydown', successElement);
  document.removeEventListener('keydown', escapeHandler);
  photoEditOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  resetImageEditor();
};

function escapeHandler(event) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closePhotoEditOverlay();
  }
}

const showImageEditor = () => {
  photoEditOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  photoEditOverlay.addEventListener('keydown', focusHandler);
  closeButton.focus();
  initImageEditor();
  document.addEventListener('keydown', escapeHandler);
};

fileInput.addEventListener('change', () => {
  //fileInput.value = null;
  showImageEditor();
});

closeButton.addEventListener('click', () => {
  closePhotoEditOverlay();
});

commentInput.addEventListener('focus', () => {
  document.removeEventListener('keydown', escapeHandler);
});

commentInput.addEventListener('blur', () => {
  document.addEventListener('keydown', escapeHandler);
});

hashTagInput.addEventListener('focus', () => {
  document.removeEventListener('keydown', escapeHandler);
});

hashTagInput.addEventListener('blur', () => {
  document.addEventListener('keydown', escapeHandler);
});

errorContinueButton.addEventListener('click', () => {
  errorElement.classList.add('visually-hidden');
  closeButton.focus(); // почему то фокус теряется при закрытии модалки
  photoEditOverlay.addEventListener('keydown', focusHandler);
  errorElement.removeEventListener('keydown', errorFocusHandler);
  document.addEventListener('keydown', escapeHandler);
});

successContinueButton.addEventListener('click', () => {
  successElement.classList.add('visually-hidden');
  closeButton.focus();
  photoEditOverlay.addEventListener('keydown', focusHandler);
  successElement.removeEventListener('keydown', succsessFocusHandler);
  document.addEventListener('keydown', escapeHandler);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const [isValid] = validate();
  if (!isValid) {
    showErrorModal();
  } else {
    showSuccessModal();
  }
});
