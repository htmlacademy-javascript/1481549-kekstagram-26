const image = document.querySelector('.img-upload__preview img');
const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleInput = document.querySelector('.scale__control--value');

const SCALE_STEP = 0.25;
const MIN_SCALE = 0.25;
const MAX_SCALE = 1;

let currentScale = 1;

const scale = (value) => `scale(${value})`;

const decreaseScaleHandler = () => {
  const value = Math.max(currentScale - SCALE_STEP, MIN_SCALE);
  currentScale = value;
  image.style.transform = scale(value);
  scaleInput.value = `${currentScale * 100}%`;
};

const increaseScaleHandler = () => {
  console.log('increase');
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

const initImageEditor = () => {
  currentScale = 1;
  image.style.transform = scale(1);
};

const resetImageEditor = () => {
  image.style.transform = scale(1);
};

biggerButton.addEventListener('click', increaseScaleHandler);
smallerButton.addEventListener('click', decreaseScaleHandler);
scaleInput.addEventListener('input', setScaleHandler);

export { initImageEditor, resetImageEditor };
