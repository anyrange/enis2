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
  // const percent = (scores / maxScores) * 100 || 0;
  return percent ? percent.toFixed(2) : 0;
};

export const getPercentDecimals = (percent) => {
  const [before, after] = `${percent}`.split(".");
  return { before, after };
};
