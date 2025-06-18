const sortMapping = {
  alpha_asc: { name: 1 },
  alpha_desc: { name: -1 },
  qty_asc: { count: 1 },
  qty_desc: { count: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

const getSortOptions = (sortBy) => {
  if (!sortBy) return { createdAt: -1 }; 
  return sortMapping[sortBy] || { createdAt: -1 };
};

module.exports = { getSortOptions };