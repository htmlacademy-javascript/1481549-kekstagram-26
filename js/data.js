import { getRandomInteger } from './utils.js';

const PHOTOS_COUNT = 25;

const COMMENTS_COUNT = 10;

const DESCRIPTIONS = [
  'Фотография 1',
  'Фотография 2',
  'Фотография 3',
  'Фотография 4',
  'Фотография 5',
  'Фотография 6',
];

const COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const NAMES = [
  'Артём',
  'Алексей',
  'Женя',
  'Вова',
  'Паша',
  'Ирина',
  'Аня',
  'Наталья',
];

const createIdGenerator = (min, max) => {
  let usedIds = [];
  let ids = [];
  for (let i = min; i <= max; i++) {
    ids = [...ids, i];
  }
  return () => {
    const notUsedIds = ids.filter((id) => !usedIds.includes(id));
    const randomId = notUsedIds[getRandomInteger(0, notUsedIds.length - 1)];
    usedIds = [...usedIds, randomId];
    return randomId;
  };
};

const getRandomArrayElement = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];

const generatePhotos = () => {
  const generatePhotoId = createIdGenerator(1, PHOTOS_COUNT);
  const generateCommentId = createIdGenerator(1, COMMENTS_COUNT * PHOTOS_COUNT);

  const createComment = () => ({
    id: generateCommentId(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: getRandomArrayElement(COMMENTS),
    name: getRandomArrayElement(NAMES),
  });

  const createPhoto = () => ({
    id: generatePhotoId(),
    url: `photos/${getRandomInteger(1, 25)}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInteger(15, 200),
    comments: Array.from({ length: getRandomInteger(1, 10) }, createComment),
  });

  return Array.from({ length: PHOTOS_COUNT }, createPhoto);
};

export { generatePhotos };
