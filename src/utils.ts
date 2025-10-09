export const generateDates = (startDate: Date, endDate: Date) => {
  const dates: Date[] = []
  const current = new Date(startDate)

  current.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}
