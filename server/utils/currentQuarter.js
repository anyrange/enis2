export default function () {
  const oneDay = 1000 * 60 * 60 * 24;
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 0);

  const day = Math.floor((now - start) / oneDay);

  const firstQuarterEndDate = new Date(new Date(now.setMonth(9)).setDate(6));
  const secondQuarterEndDate = new Date(new Date(now.setMonth(0)).setDate(9));
  const thirdQuarterEndDate = new Date(new Date(now.setMonth(1)).setDate(27));
  const fourthQuarterEndDate = new Date(new Date(now.setMonth(7)).setDate(15));

  const firstQuarterEndDiff = firstQuarterEndDate - start;
  const secondQuarterEndDiff = secondQuarterEndDate - start;
  const thirdQuarterEndDiff = thirdQuarterEndDate - start;
  const fourthQuarterEndDiff = fourthQuarterEndDate - start;

  const firstQuarterEnd = Math.floor(firstQuarterEndDiff / oneDay);
  const secondQuarterEnd = Math.floor(secondQuarterEndDiff / oneDay);
  const thirdQuarterEnd = Math.floor(thirdQuarterEndDiff / oneDay);
  const fourthQuarterEnd = Math.floor(fourthQuarterEndDiff / oneDay);

  if (day > fourthQuarterEnd && day < firstQuarterEnd) return 1;
  if (day > firstQuarterEnd && day < secondQuarterEnd) return 2;
  if (day > secondQuarterEnd && day < thirdQuarterEnd) return 3;
  if (day > thirdQuarterEnd && day < fourthQuarterEnd) return 4;
}
