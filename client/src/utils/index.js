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

const findByQuery = (i, query) => {
  return Object.entries(query).every(([k, v]) => i[k].toString().includes(v));
};

export const findItem = (array, query) => {
  return array.find((i) => findByQuery(i, query));
};

export const findIndex = (array, query) => {
  const idx = array.findIndex((i) => findByQuery(i, query));
  const index = idx === -1 ? null : idx;
  const exists = index !== null;
  return { index, exists };
};
