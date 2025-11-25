export function normalizeSeries(values: number[], height: number) {
  if (!values.length) return []
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max === min ? 1 : max - min
  return values.map((v) => height - ((v - min) / range) * height)
}
