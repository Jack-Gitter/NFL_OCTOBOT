export const generateDates = (startDate) => {
  const dates = []
  const current = new Date(startDate)
  const today = new Date()

  current.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  while (current <= today) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}
