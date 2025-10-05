// String manipulation and validation utilities
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

export const camelCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

export const kebabCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const snakeCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

// URL slug generation
export const generateSlug = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .trim()
    // Remove Vietnamese diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace Vietnamese characters
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    // Remove special characters
    .replace(/[^\w\s-]/g, '')
    // Replace spaces and multiple hyphens with single hyphen
    .replace(/[\s_-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
};

// Text truncation
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  
  return str.slice(0, length).trim() + suffix;
};

export const truncateWords = (str, wordCount = 10, suffix = '...') => {
  if (!str || typeof str !== 'string') return '';
  
  const words = str.split(' ');
  if (words.length <= wordCount) return str;
  
  return words.slice(0, wordCount).join(' ') + suffix;
};

// String validation
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

export const isEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Vietnamese phone number patterns
  const phoneRegex = /^(\+84|84|0)?[0-9]{9,10}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  return phoneRegex.test(cleanPhone);
};

export const isURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Password validation
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  
  // Complexity patterns
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) score += 1;
  if (/(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)/.test(password)) score += 1;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very strong';
};

// Vietnamese text utilities
export const removeVietnameseDiacritics = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  const diacriticsMap = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };
  
  return str.replace(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/g, match => diacriticsMap[match] || match);
};

// Search utilities
export const normalizeSearchTerm = (term) => {
  if (!term || typeof term !== 'string') return '';
  
  return removeVietnameseDiacritics(term)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

export const searchInText = (text, searchTerm, options = {}) => {
  if (!text || !searchTerm) return false;
  
  const {
    caseSensitive = false,
    wholeWord = false,
    diacriticSensitive = false
  } = options;
  
  let normalizedText = text;
  let normalizedSearch = searchTerm;
  
  if (!diacriticSensitive) {
    normalizedText = removeVietnameseDiacritics(text);
    normalizedSearch = removeVietnameseDiacritics(searchTerm);
  }
  
  if (!caseSensitive) {
    normalizedText = normalizedText.toLowerCase();
    normalizedSearch = normalizedSearch.toLowerCase();
  }
  
  if (wholeWord) {
    const regex = new RegExp(`\\b${normalizedSearch}\\b`);
    return regex.test(normalizedText);
  }
  
  return normalizedText.includes(normalizedSearch);
};

// HTML/XML utilities
export const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div to parse HTML
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

export const escapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  
  return str.replace(/[&<>"']/g, match => htmlEscapes[match]);
};

export const unescapeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, match => htmlUnescapes[match]);
};

// Text analysis
export const countWords = (str) => {
  if (!str || typeof str !== 'string') return 0;
  
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countCharacters = (str, includeSpaces = true) => {
  if (!str || typeof str !== 'string') return 0;
  
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
};

export const getReadingTime = (text, wordsPerMinute = 200) => {
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return {
    words: wordCount,
    minutes,
    text: `${minutes} min read`
  };
};

// Random string generation
export const generateRandomString = (length = 10, charset = 'alphanumeric') => {
  const charsets = {
    numeric: '0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    hex: '0123456789ABCDEF',
    base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  };
  
  const chars = charsets[charset] || charsets.alphanumeric;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Export all utilities
export default {
  capitalize,
  capitalizeWords,
  camelCase,
  kebabCase,
  snakeCase,
  generateSlug,
  truncate,
  truncateWords,
  isEmpty,
  isEmail,
  isPhone,
  isURL,
  validatePassword,
  removeVietnameseDiacritics,
  normalizeSearchTerm,
  searchInText,
  stripHtmlTags,
  escapeHtml,
  unescapeHtml,
  countWords,
  countCharacters,
  getReadingTime,
  generateRandomString,
  generateUUID
};