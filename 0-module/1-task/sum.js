function sum(a, b) {
  /* ваш код */
  if (isNaN(parseFloat(a)) || isNaN(parseFloat(b))) {
    throw new TypeError();
  }
  return a+b;
}

module.exports = sum;
