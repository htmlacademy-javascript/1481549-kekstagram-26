/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
const getRandomInteger = (from, to) => {
  // предусмотрим если from > to и передаются не целые значения;
  const min = Math.ceil(from > to ? to : from);
  const max = Math.floor(from > to ? from : to);

  // интервал должен быть положительным включая 0
  if (min < 0 || max < 0) {
    throw new Error('interval must be equal or greater than zero');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Функция для проверки максимальной длины строки
 */
const checkStringLength = (str, maxLength) => {
  // проверка что передаётся строка
  if (typeof str !== 'string') {
    throw new Error('str must be a string');
  }
  // проверка что передаётся число
  if (typeof maxLength !== 'number' || Number.isNaN(maxLength)) {
    throw new Error('max length must be a number');
  }

  return str.length <= maxLength;
};

export { getRandomInteger, checkStringLength };
