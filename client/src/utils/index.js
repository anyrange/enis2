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

export const isEmpty = (str) => {
  return !str || str.length === 0;
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

export const getScore = (SAU, SAT) => {
  return getPercent(
    (getScores(getFilteredSection(SAU)) /
      getMaxScores(getFilteredSection(SAU)) /
      2 +
      getScores(getFilteredSection(SAT)) /
        getMaxScores(getFilteredSection(SAT)) /
        2) *
      100
  );
};

export const getPercentDecimals = (percent) => {
  const [before, after] = `${percent}`.split(".");
  return { before, after };
};

export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const existsAtIndex = (data, query) => {
  const index = data.findIndex((rec) =>
    Object.entries(query).every(([k, v]) => rec[k].toString().includes(v))
  );
  return index === -1 ? null : index;
};
