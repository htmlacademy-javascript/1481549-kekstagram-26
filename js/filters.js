const image = document.querySelector('.img-upload__preview img');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleInput = document.querySelector('.scale__control--value');
const filterButtons = [...document.querySelectorAll('input[name="effect"]')];

const EFFECTS = {
  NONE: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const SCALE_STEP = 0.25;
const MIN_SCALE = 0.25;
const MAX_SCALE = 1;

let currentScale = 1;

const scale = (value) => `scale(${value})`;
const grayscale = (value) => `grayscale(${value})`;
const sepia = (value) => `sepia(${value})`;
const invert = (value) => `invert(${value}%)`;
const blur = (value) => `blur(${value}px)`;
const brightness = (value) => `brightness(${value})`;

const decreaseScaleHandler = () => {
  const value = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
  currentScale = value;
  image.style.transform = scale(value);
  scaleInput.value = `${currentScale * 100}%`;
};

const increaseScaleHandler = () => {
  const value = Math.min(currentScale + SCALE_STEP, MAX_SCALE);
  currentScale = value;
  image.style.transform = scale(value);
  scaleInput.value = `${currentScale * 100}%`;
};

const setScaleHandler = () => {
  function intOrNaN(x) {
    return /^\d+$/.test(x) ? +x : NaN;
  }

  const strWithoutPersent = scaleInput.value.replace(/%/, '');
  const persentValue = intOrNaN(strWithoutPersent);

  if (isNaN(persentValue)) {
    return;
  }

  let restrictedPercent = persentValue;
  restrictedPercent = restrictedPercent > 100 ? 100 : restrictedPercent;
  restrictedPercent = restrictedPercent < 0 ? 0 : restrictedPercent;

  let value = restrictedPercent / 100;
  value = value > MAX_SCALE ? MAX_SCALE : value;
  value = value < MIN_SCALE ? MIN_SCALE : value;

  image.style.transform = scale(value);
  currentScale = value;
};

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener('click', (event) => {
    switch (event.target.value) {
      case EFFECTS.NONE:
        image.style.filter = 'none';
        break;
      case EFFECTS.CHROME:
        image.style.filter = grayscale(1);
        break;
      case EFFECTS.SEPIA:
        image.style.filter = sepia(1);
        break;
      case EFFECTS.MARVIN:
        image.style.filter = invert(100);
        break;
      case EFFECTS.PHOBOS:
        image.style.filter = blur(2.5);
        break;
      case EFFECTS.HEAT:
        image.style.filter = brightness(3);
        break;
      default:
        break;
    }
  });
});

const initImageEditor = () => {
  currentScale = 1;
  image.style.transform = scale(1);
};

const resetImageEditor = () => {
  image.style.transform = scale(1);
  image.style.filter = 'none';
};

biggerButton.addEventListener('click', increaseScaleHandler);
smallerButton.addEventListener('click', decreaseScaleHandler);
scaleInput.addEventListener('input', setScaleHandler);

export { initImageEditor, resetImageEditor };
