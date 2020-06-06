const addPluralForm = (elem: string, qty: number) => qty > 1 ? `${elem}s` : `${elem}`

const decodeHTMLEntities = (str: string): string => str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))

export {
  addPluralForm,
  decodeHTMLEntities
}