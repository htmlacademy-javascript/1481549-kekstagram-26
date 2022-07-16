const image = document.querySelector('.img-upload__preview img');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleInput = document.querySelector('.scale__control--value');
const filterButtons = [...document.querySelectorAll('input[name="effect"]')];
const sliderElement = document.querySelector('.effect-level__slider');
const effectLevelElement = document.querySelector('.effect-level__value');

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

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100,
  },
  start: 80,
  step: 1,
  connect: 'lower',
});

const updateSlider = (min, max, start, step, cb) => {
  sliderElement.classList.remove('visually-hidden');
  sliderElement.noUiSlider.updateOptions({
    range: {
      min: min,
      max: max,
    },
    start: start,
    step: step,
  });
  sliderElement.noUiSlider.off('update');
  sliderElement.noUiSlider.on('update', cb);
};

const disableSlider = () => {
  sliderElement.classList.add('visually-hidden');
  sliderElement.noUiSlider.off('update');
  image.style.filter = 'none';
  effectLevelElement.value = '';
};

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
        disableSlider();
        break;
      case EFFECTS.CHROME:
        // 0..1, 0.1
        updateSlider(0, 1, 1, 0.1, (value) => {
          image.style.filter = grayscale(value);
          effectLevelElement.value = value;
        });
        break;
      case EFFECTS.SEPIA:
        // 0..1, 0.1
        updateSlider(0, 1, 1, 0.1, (value) => {
          image.style.filter = sepia(value);
          effectLevelElement.value = value;
        });
        break;
      case EFFECTS.MARVIN:
        // 0..100%, 1%
        updateSlider(0, 100, 100, 1, (value) => {
          image.style.filter = invert(value);
          effectLevelElement.value = value;
        });
        break;
      case EFFECTS.PHOBOS:
        // 0..3px, 0.1px
        updateSlider(0, 3, 3, 0.1, (value) => {
          image.style.filter = blur(value);
          effectLevelElement.value = value;
        });
        break;
      case EFFECTS.HEAT:
        // 1..3, 0.1
        updateSlider(1, 3, 3, 0.1, (value) => {
          image.style.filter = brightness(value);
          effectLevelElement.value = value;
        });
        break;
      default:
        break;
    }
  });
});

const initImageEditor = () => {
  currentScale = 1;
  image.style.transform = scale(1);
  image.style.filter = 'none';
  disableSlider();
};

const resetImageEditor = () => {
  currentScale = 1;
  image.style.transform = scale(1);
  image.style.filter = 'none';
  disableSlider();
};

biggerButton.addEventListener('click', increaseScaleHandler);
smallerButton.addEventListener('click', decreaseScaleHandler);
scaleInput.addEventListener('input', setScaleHandler);

export { initImageEditor, resetImageEditor };
