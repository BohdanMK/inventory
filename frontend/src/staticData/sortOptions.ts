export const sortValueList = [
  { name: '↑ A-Z', code: 'alpha_asc' },
  { name: '↓ Z-A', code: 'alpha_desc' },
  { name: '↑ Quantity', code: 'qty_asc' },
  { name: '↓ Quantity', code: 'qty_desc' },
  { name: '↑ Price', code: 'price_asc' },
  { name: '↓ Price', code: 'price_desc' },
];

export const sortAlphabet = sortValueList.slice(0, 2);
export const sortQuantity = sortValueList.slice(2, 4);
export const sortPrice = sortValueList.slice(4, 6);
