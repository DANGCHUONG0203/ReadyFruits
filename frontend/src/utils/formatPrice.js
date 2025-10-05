// Enhanced price formatting utilities with multiple currency support
export const formatPrice = (price, options = {}) => {
  const {
    currency = 'VND',
    locale = 'vi-VN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
    compact = false
  } = options;

  if (price == null || price === undefined) return '';
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '';

  const formatOptions = {
    style: showSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  };

  if (compact && numPrice >= 1000000) {
    formatOptions.notation = 'compact';
    formatOptions.compactDisplay = 'short';
  }

  try {
    return new Intl.NumberFormat(locale, formatOptions).format(numPrice);
  } catch (error) {
    console.error('Price formatting error:', error);
    return numPrice.toLocaleString();
  }
};

// Format price range
export const formatPriceRange = (minPrice, maxPrice, options = {}) => {
  if (!minPrice && !maxPrice) return '';
  if (!maxPrice) return `From ${formatPrice(minPrice, options)}`;
  if (!minPrice) return `Up to ${formatPrice(maxPrice, options)}`;
  if (minPrice === maxPrice) return formatPrice(minPrice, options);
  
  return `${formatPrice(minPrice, options)} - ${formatPrice(maxPrice, options)}`;
};

// Parse price from string
export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  
  // Remove currency symbols and non-numeric characters except decimal point
  const cleaned = priceString.toString().replace(/[^\d.,]/g, '');
  
  // Handle Vietnamese number format (comma as thousands separator, dot as decimal)
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) return 0;
  
  const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Calculate final price with discount
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (!originalPrice || !discountPercentage || discountPercentage <= 0) return originalPrice;
  
  const discount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discount;
};

// Format discount display
export const formatDiscount = (originalPrice, discountPrice, options = {}) => {
  const percentage = calculateDiscountPercentage(originalPrice, discountPrice);
  if (percentage === 0) return null;
  
  return {
    percentage,
    amount: originalPrice - discountPrice,
    formattedPercentage: `${percentage}%`,
    formattedAmount: formatPrice(originalPrice - discountPrice, options),
    formattedOriginal: formatPrice(originalPrice, options),
    formattedDiscounted: formatPrice(discountPrice, options)
  };
};

// Tax calculations
export const calculateTax = (price, taxRate) => {
  if (!price || !taxRate) return 0;
  return (price * taxRate) / 100;
};

export const calculatePriceWithTax = (price, taxRate) => {
  if (!price) return 0;
  return price + calculateTax(price, taxRate);
};

// Shipping calculations
export const calculateShipping = (weight, distance, baseRate = 10000) => {
  if (!weight) return baseRate;
  
  const weightCost = weight * 2000; // 2000 VND per kg
  const distanceCost = distance ? distance * 1000 : 0; // 1000 VND per km
  
  return baseRate + weightCost + distanceCost;
};

// Format price for different contexts
export const formatPriceForContext = (price, context = 'display') => {
  switch (context) {
    case 'input':
      return price ? price.toString() : '';
    case 'api':
      return parsePrice(price);
    case 'display':
    default:
      return formatPrice(price);
  }
};

// Price comparison utilities
export const comparePrices = (price1, price2) => {
  const p1 = parsePrice(price1);
  const p2 = parsePrice(price2);
  
  if (p1 > p2) return 1;
  if (p1 < p2) return -1;
  return 0;
};

export const findLowestPrice = (prices) => {
  if (!Array.isArray(prices) || prices.length === 0) return null;
  
  const numericPrices = prices.map(p => parsePrice(p)).filter(p => p > 0);
  if (numericPrices.length === 0) return null;
  
  return Math.min(...numericPrices);
};

export const findHighestPrice = (prices) => {
  if (!Array.isArray(prices) || prices.length === 0) return null;
  
  const numericPrices = prices.map(p => parsePrice(p)).filter(p => p > 0);
  if (numericPrices.length === 0) return null;
  
  return Math.max(...numericPrices);
};

// Default export for backward compatibility
export default formatPrice;
