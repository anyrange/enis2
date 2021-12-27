export const debounce = (fn, delay = 0, immediate = false) => {
  let timeout;
  return (...args) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const getFilteredSection = (section) => {
  return section.filter((s) => s.Score !== -1);
};

export const getScores = (section) => {
  return section.reduce((n, { Score }) => n + Score, 0);
};

export const getMaxScores = (section) => {
  return section.reduce((n, { MaxScore }) => n + MaxScore, 0);
};

export const getPercent = (percent) => {
  return percent ? percent.toFixed(2) : 0;
};

export const getPercentDecimals = (percent) => {
  const [before, after] = `${percent}`.split(".");
  return { before, after };
};

export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
