// Array manipulation and utility functions
export const unique = (array, key) => {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = typeof key === 'function' ? key(item) : item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Handle different types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue, 'vi-VN', { numeric: true });
      return direction === 'asc' ? comparison : -comparison;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = (array, filters) => {
  if (!Array.isArray(array)) return [];
  if (!filters || typeof filters !== 'object') return array;
  
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      // Skip null/undefined filters
      if (filterValue == null) return true;
      
      // Array contains check
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      // String contains check (case insensitive)
      if (typeof filterValue === 'string' && typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      
      // Function filter
      if (typeof filterValue === 'function') {
        return filterValue(itemValue, item);
      }
      
      // Exact match
      return itemValue === filterValue;
    });
  });
};

export const searchInArray = (array, searchTerm, searchKeys) => {
  if (!Array.isArray(array) || !searchTerm) return array;
  if (!searchKeys || !Array.isArray(searchKeys)) return array;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return array.filter(item => {
    return searchKeys.some(key => {
      const value = typeof key === 'function' ? key(item) : item[key];
      if (value == null) return false;
      
      return value.toString().toLowerCase().includes(normalizedSearch);
    });
  });
};

export const paginate = (array, page = 1, pageSize = 10) => {
  if (!Array.isArray(array)) return { items: [], pagination: null };
  
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const items = array.slice(startIndex, endIndex);
  
  return {
    items,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems)
    }
  };
};

export const chunk = (array, size) => {
  if (!Array.isArray(array) || size <= 0) return [];
  
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const shuffle = (array) => {
  if (!Array.isArray(array)) return [];
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const sample = (array, count = 1) => {
  if (!Array.isArray(array)) return [];
  if (count <= 0) return [];
  if (count >= array.length) return [...array];
  
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
};

export const flatten = (array, depth = Infinity) => {
  if (!Array.isArray(array)) return [];
  
  return array.flat(depth);
};

export const intersection = (...arrays) => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];
  
  return arrays.reduce((acc, arr) => {
    if (!Array.isArray(arr)) return acc;
    return acc.filter(item => arr.includes(item));
  });
};

export const difference = (array1, array2) => {
  if (!Array.isArray(array1)) return [];
  if (!Array.isArray(array2)) return array1;
  
  return array1.filter(item => !array2.includes(item));
};

export const union = (...arrays) => {
  const combined = arrays.filter(Array.isArray).flat();
  return unique(combined);
};

// Statistical functions
export const sum = (array, key) => {
  if (!Array.isArray(array)) return 0;
  
  return array.reduce((total, item) => {
    const value = key ? (typeof key === 'function' ? key(item) : item[key]) : item;
    return total + (Number(value) || 0);
  }, 0);
};

export const average = (array, key) => {
  if (!Array.isArray(array) || array.length === 0) return 0;
  
  return sum(array, key) / array.length;
};

export const min = (array, key) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  
  const values = key ? array.map(item => 
    typeof key === 'function' ? key(item) : item[key]
  ) : array;
  
  return Math.min(...values.filter(v => v != null && !isNaN(v)));
};

export const max = (array, key) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  
  const values = key ? array.map(item => 
    typeof key === 'function' ? key(item) : item[key]
  ) : array;
  
  return Math.max(...values.filter(v => v != null && !isNaN(v)));
};

export const median = (array, key) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  
  const values = key ? array.map(item => 
    typeof key === 'function' ? key(item) : item[key]
  ) : array;
  
  const sorted = values.filter(v => v != null && !isNaN(v)).sort((a, b) => a - b);
  
  if (sorted.length === 0) return null;
  
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

// Array transformations
export const pluck = (array, key) => {
  if (!Array.isArray(array)) return [];
  
  return array.map(item => 
    typeof key === 'function' ? key(item) : item[key]
  );
};

export const keyBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((acc, item) => {
    const keyValue = typeof key === 'function' ? key(item) : item[key];
    acc[keyValue] = item;
    return acc;
  }, {});
};

export const countBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((counts, item) => {
    const keyValue = typeof key === 'function' ? key(item) : item[key];
    counts[keyValue] = (counts[keyValue] || 0) + 1;
    return counts;
  }, {});
};

// Array validation
export const isEmpty = (array) => {
  return !Array.isArray(array) || array.length === 0;
};

export const isNotEmpty = (array) => {
  return Array.isArray(array) && array.length > 0;
};

export const hasItems = (array, minCount = 1) => {
  return Array.isArray(array) && array.length >= minCount;
};

// Array comparison
export const isEqual = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
  if (array1.length !== array2.length) return false;
  
  return array1.every((item, index) => {
    const otherItem = array2[index];
    
    if (Array.isArray(item) && Array.isArray(otherItem)) {
      return isEqual(item, otherItem);
    }
    
    if (typeof item === 'object' && typeof otherItem === 'object') {
      return JSON.stringify(item) === JSON.stringify(otherItem);
    }
    
    return item === otherItem;
  });
};

// Array utilities for objects
export const updateItem = (array, predicate, updates) => {
  if (!Array.isArray(array)) return array;
  
  return array.map(item => {
    const shouldUpdate = typeof predicate === 'function' 
      ? predicate(item) 
      : item.id === predicate;
      
    return shouldUpdate ? { ...item, ...updates } : item;
  });
};

export const removeItem = (array, predicate) => {
  if (!Array.isArray(array)) return array;
  
  return array.filter(item => {
    const shouldRemove = typeof predicate === 'function' 
      ? predicate(item) 
      : item.id === predicate;
      
    return !shouldRemove;
  });
};

export const findItem = (array, predicate) => {
  if (!Array.isArray(array)) return null;
  
  return array.find(item => {
    return typeof predicate === 'function' 
      ? predicate(item) 
      : item.id === predicate;
  }) || null;
};

export const findIndex = (array, predicate) => {
  if (!Array.isArray(array)) return -1;
  
  return array.findIndex(item => {
    return typeof predicate === 'function' 
      ? predicate(item) 
      : item.id === predicate;
  });
};

// Export all utilities
export default {
  unique,
  groupBy,
  sortBy,
  filterBy,
  searchInArray,
  paginate,
  chunk,
  shuffle,
  sample,
  flatten,
  intersection,
  difference,
  union,
  sum,
  average,
  min,
  max,
  median,
  pluck,
  keyBy,
  countBy,
  isEmpty,
  isNotEmpty,
  hasItems,
  isEqual,
  updateItem,
  removeItem,
  findItem,
  findIndex
};