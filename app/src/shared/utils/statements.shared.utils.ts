import { keccak256, stringToBytes } from 'viem'

export const getWeek = function (dateMs: number) {
  var date = new Date(dateMs)
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    )
  )
}

export const getStatementScope = (projectId: number, now: number) => {
  const period = getWeek(now)
  return keccak256(stringToBytes(`${projectId}-${period}`))
}
