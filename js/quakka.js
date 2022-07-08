const arr = [1, 2, 2, 3, 4];

const res = arr.filter((hashTag, index) => arr.indexOf(hashTag) !== index).some();

console.log(res);

