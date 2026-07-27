// Central place for money formatting. Every component that shows a price
// should call formatPrice() instead of writing '$' or 'R' directly — that
// way the whole app changes together if the currency ever changes again.

export function formatPrice(amount) {
  const value = Number(amount) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}