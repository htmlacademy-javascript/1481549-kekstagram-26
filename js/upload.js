import { isEscapeKey, trapFocus } from './utils.js';
import { validate, resetValidation } from './validation.js';
import { initImageEditor, resetImageEditor } from './filters.js';
import { uploadPhoto } from './fetch.js';

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const body = document.body;
const form = document.querySelector('#upload-select-image');
const fileInput = document.querySelector('#upload-file');
const previewElement = document.querySelector('.img-upload__preview img');
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
const submitButton = form.querySelector('.img-upload__submit');

const focusHandler = trapFocus(photoEditOverlay);
const errorFocusHandler = trapFocus(errorElement);
const succsessFocusHandler = trapFocus(successElement);

errorElement.classList.add('visually-hidden');
successElement.classList.add('visually-hidden');
form.appendChild(errorElement);
form.appendChild(successElement);

const closePhotoEditOverlay = () => {
  errorTitleElement.innerHtml = '';
  hashTagInput.value = '';
  commentInput.value = '';
  fileInput.value = null;
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  errorElement.removeEventListener('keydown', errorFocusHandler);
  successElement.removeEventListener('keydown', successElement);
  document.removeEventListener('keydown', photoEditEscapeHandler);
  photoEditOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  resetImageEditor();
  resetValidation();
};

function closeSuccessModal() {
  successElement.classList.add('visually-hidden');
  document.removeEventListener('click', modalHandler);
  document.addEventListener('keydown', photoEditEscapeHandler);
  document.removeEventListener('keydown', modalSuccessEscapeHandler);
}

function closeErrorModal() {
  errorElement.classList.add('visually-hidden');
  document.removeEventListener('click', modalHandler);
  document.addEventListener('keydown', photoEditEscapeHandler);
  document.removeEventListener('keydown', modalErrorEscapeHandler);
}

function modalHandler(event) {
  if (event.target.classList.contains('success')) {
    closeSuccessModal();
    closePhotoEditOverlay();
  } else if (event.target.classList.contains('error')) {
    closeErrorModal();
  }
}

function photoEditEscapeHandler(event) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closePhotoEditOverlay();
  }
}

function modalSuccessEscapeHandler(event) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closeSuccessModal();
    closePhotoEditOverlay();
  }
}

function modalErrorEscapeHandler(event) {
  if (isEscapeKey(event)) {
    event.preventDefault();
    closeErrorModal();
  }
}

const showErrorModal = () => {
  errorContinueButton.focus();
  errorElement.classList.remove('visually-hidden');
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  errorElement.addEventListener('keydown', errorFocusHandler);
  document.addEventListener('click', modalHandler);
  document.removeEventListener('keydown', photoEditEscapeHandler);
  document.addEventListener('keydown', modalErrorEscapeHandler);
};

const showSuccessModal = () => {
  successContinueButton.focus();
  photoEditOverlay.removeEventListener('keydown', focusHandler);
  successElement.classList.remove('visually-hidden');
  successElement.addEventListener('keydown', succsessFocusHandler);
  document.addEventListener('click', modalHandler);
  document.removeEventListener('keydown', photoEditEscapeHandler);
  document.addEventListener('keydown', modalSuccessEscapeHandler);
};

const showImageEditor = (file) => {
  photoEditOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  photoEditOverlay.addEventListener('keydown', focusHandler);
  closeButton.focus();
  initImageEditor();
  document.addEventListener('keydown', photoEditEscapeHandler);

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));
  if (matches) {
    previewElement.src = URL.createObjectURL(file);
  }
};

fileInput.addEventListener('change', () => {
  const [file] = fileInput.files;
  showImageEditor(file);
});

closeButton.addEventListener('click', () => {
  closePhotoEditOverlay();
});

commentInput.addEventListener('focus', () => {
  document.removeEventListener('keydown', photoEditEscapeHandler);
});

commentInput.addEventListener('blur', () => {
  document.addEventListener('keydown', photoEditEscapeHandler);
});

hashTagInput.addEventListener('focus', () => {
  document.removeEventListener('keydown', photoEditEscapeHandler);
});

hashTagInput.addEventListener('blur', () => {
  document.addEventListener('keydown', photoEditEscapeHandler);
});

errorContinueButton.addEventListener('click', () => {
  errorElement.classList.add('visually-hidden');
  closeButton.focus(); // почему то фокус теряется при закрытии модалки
  photoEditOverlay.addEventListener('keydown', focusHandler);
  errorElement.removeEventListener('keydown', errorFocusHandler);
  document.addEventListener('keydown', photoEditEscapeHandler);
});

successContinueButton.addEventListener('click', () => {
  closeSuccessModal();
  closePhotoEditOverlay();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const [isValid] = validate();
  if (!isValid) {
    showErrorModal();
  } else {
    submitButton.disabled = true;
    uploadPhoto(
      form,
      () => {
        showSuccessModal();
        submitButton.disabled = false;
      },
      () => {
        showErrorModal();
        submitButton.disabled = false;
      }
    );
  }
});
