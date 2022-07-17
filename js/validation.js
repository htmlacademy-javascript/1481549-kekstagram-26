import { checkStringLength } from './utils.js';

const form = document.querySelector('#upload-select-image');
const photoEditOverlay = document.querySelector('.img-upload__overlay');
const hashTagInput = photoEditOverlay.querySelector('.text__hashtags');
const commentInput = photoEditOverlay.querySelector('.text__description');

const pristine = new Pristine(form);

pristine.addValidator(
  commentInput,
  (value) => value.length === 0 || checkStringLength(value, 140),
  'Длина комментария должна быть менее 140 символов',
  2,
  false
);

pristine.addValidator(
  hashTagInput,
  (value) => {
    if (value.length === 0) {
      return true;
    }
    const hashTags = value.trim().split(/\s+/);
    const re = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
    return hashTags.every((hashTag) => re.test(hashTag));
  },
  'Хэштег должен начинаться с #, не содержать пробелов и быть длиной максимум 20 символов',
  2,
  false
);

pristine.addValidator(
  hashTagInput,
  (value) => {
    if (value.length === 0) {
      return true;
    }
    const hashTags = value
      .trim()
      .split(/\s+/)
      .map((hashTag) => hashTag.toLowerCase());
    return (
      hashTags.filter((hashTag, index) => hashTags.indexOf(hashTag) !== index)
        .length === 0
    );
  },
  'Хэштеги не должны повторяться',
  2,
  false
);

pristine.addValidator(
  hashTagInput,
  (value) => {
    if (value.length === 0) {
      return true;
    }
    const hashTags = value.trim().split(/\s+/);
    return hashTags.length <= 5;
  },
  'Нельзя указать больше 5 хэштегов',
  2,
  false
);

const validate = () => {
  const isValid = pristine.validate();

  if (isValid) {
    return [true, ''];
  } else {
    const inputs = pristine.getErrors();
    const errorMessage = inputs
      .reduce((acc, input) => {
        const errorForInput = input.errors.join(', ');
        acc += `${errorForInput}, `;
        return acc;
      }, '')
      .slice(0, -2);
    return [false, errorMessage];
  }
};

const resetValidation = () => {
  pristine.reset();
};

export { validate, resetValidation };
