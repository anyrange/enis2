const getSum = (array, query) => {
  return array.reduce((t, c) => t + c[query], 0);
};

export const getSectionsScores = (sections) => {
  const filteredSections = sections.filter((s) => s.Score !== -1);
  return {
    score: getSum(filteredSections, "Score"),
    max: getSum(filteredSections, "MaxScore"),
  };
};

export const formatPercent = (percent) => {
  return Number(percent ? percent.toFixed(2) : 0).toString();
};

export const getPercent = (SAU, SAT) => {
  const { score: SAUscores, max: SAUmaxScores } = getSectionsScores(SAU);
  const { score: SATscores, max: SATmaxScores } = getSectionsScores(SAT);
  const SAUpart = SAUscores / (2 * SAUmaxScores);
  const SATpart = SATscores / (2 * SATmaxScores);
  return formatPercent((SAUpart + SATpart) * 100);
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

export const between = (x, min, max) => {
  return x >= min && x <= max;
};

export const assign = (target, ...sources) => {
  return Object.assign(
    target,
    ...sources.map((x) =>
      Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(x).filter(([key, value]) => value !== undefined)
      )
    )
  );
};
