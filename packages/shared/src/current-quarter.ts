export const getCurrentQuarter = () => {
  const oneDay = 1000 * 60 * 60 * 24
  const now = new Date()

  const start = new Date(now.getFullYear(), 0, 0).getTime()

  const day = Math.floor((now.getTime() - start) / oneDay)

  const firstQuarterEndDate = new Date(new Date(now.setMonth(10)).setDate(6))
  const secondQuarterEndDate = new Date(new Date(now.setMonth(0)).setDate(9))
  const thirdQuarterEndDate = new Date(new Date(now.setMonth(2)).setDate(27))
  const fourthQuarterEndDate = new Date(new Date(now.setMonth(8)).setDate(15))

  const firstQuarterEndDiff = firstQuarterEndDate.getTime() - start
  const secondQuarterEndDiff = secondQuarterEndDate.getTime() - start
  const thirdQuarterEndDiff = thirdQuarterEndDate.getTime() - start
  const fourthQuarterEndDiff = fourthQuarterEndDate.getTime() - start

  const firstQuarterEnd = Math.floor(firstQuarterEndDiff / oneDay)
  const secondQuarterEnd = Math.floor(secondQuarterEndDiff / oneDay)
  const thirdQuarterEnd = Math.floor(thirdQuarterEndDiff / oneDay)
  const fourthQuarterEnd = Math.floor(fourthQuarterEndDiff / oneDay)

  if (day > fourthQuarterEnd && day <= firstQuarterEnd) return 1
  if (day > firstQuarterEnd || day <= secondQuarterEnd) return 2
  if (day > secondQuarterEnd && day <= thirdQuarterEnd) return 3
  if (day > thirdQuarterEnd && day <= fourthQuarterEnd) return 4

  return 1
}
