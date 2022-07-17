const PHOTOS_URL = 'https://26.javascript.pages.academy/kekstagram/data';
const UPLOAD_URL = 'https://26.javascript.pages.academy/kekstagram';

const loadPhotos = (onSuccess, onError) => {
  fetch(PHOTOS_URL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        onError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    })
    .then((photos) => onSuccess(photos))
    .catch((error) => onError(error));
};

const uploadPhoto = (form, onSuccess, onError) => {
  fetch(UPLOAD_URL, {
    method: 'POST',
    body: new FormData(form),
  })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError({
          status: response.status,
          statusText: response.statusText,
        });
      }
    })
    .catch((error) => onError(error));
};

export { loadPhotos, uploadPhoto };
