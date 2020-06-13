const addPluralForm = (elem: string, qty: number): string => qty > 1 ? `${elem}s` : `${elem}`

const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

const decodeHTMLEntities = (str: string): string => str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))

export {
  addPluralForm,
  capitalizeFirstLetter,
  decodeHTMLEntities
}