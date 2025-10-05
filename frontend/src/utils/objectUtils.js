// Object manipulation and utility functions
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
};

export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

export const isNotEmpty = (obj) => {
  return !isEmpty(obj);
};

export const hasProperty = (obj, path) => {
  if (!obj || typeof obj !== 'object') return false;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
};

export const getProperty = (obj, path, defaultValue = undefined) => {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
};

export const setProperty = (obj, path, value) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object' || Array.isArray(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

export const deleteProperty = (obj, path) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      return obj;
    }
    current = current[key];
  }
  
  delete current[lastKey];
  return obj;
};

export const pick = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const omit = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

export const mapValues = (obj, mapper) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = mapper(value, key, obj);
  }
  return result;
};

export const mapKeys = (obj, mapper) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = mapper(key, value, obj);
    result[newKey] = value;
  }
  return result;
};

export const filterObject = (obj, predicate) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key, obj)) {
      result[key] = value;
    }
  }
  return result;
};

export const findKey = (obj, predicate) => {
  if (!obj || typeof obj !== 'object') return undefined;
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key, obj)) {
      return key;
    }
  }
  return undefined;
};

export const findValue = (obj, predicate) => {
  if (!obj || typeof obj !== 'object') return undefined;
  
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(value, key, obj)) {
      return value;
    }
  }
  return undefined;
};

export const invert = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[value] = key;
  }
  return result;
};

export const groupBy = (obj, grouper) => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const group = typeof grouper === 'function' ? grouper(value, key, obj) : value[grouper];
    if (!result[group]) {
      result[group] = {};
    }
    result[group][key] = value;
  }
  return result;
};

export const keys = (obj) => {
  return obj && typeof obj === 'object' ? Object.keys(obj) : [];
};

export const values = (obj) => {
  return obj && typeof obj === 'object' ? Object.values(obj) : [];
};

export const entries = (obj) => {
  return obj && typeof obj === 'object' ? Object.entries(obj) : [];
};

export const fromEntries = (entries) => {
  if (!Array.isArray(entries)) return {};
  
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

export const size = (obj) => {
  if (obj == null) return 0;
  if (Array.isArray(obj)) return obj.length;
  if (typeof obj === 'object') return Object.keys(obj).length;
  if (typeof obj === 'string') return obj.length;
  return 0;
};

export const isEqual = (obj1, obj2, deep = true) => {
  // Same reference
  if (obj1 === obj2) return true;
  
  // Different types or one is null/undefined
  if (typeof obj1 !== typeof obj2 || obj1 == null || obj2 == null) {
    return false;
  }
  
  // Arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    
    for (let i = 0; i < obj1.length; i++) {
      if (deep ? !isEqual(obj1[i], obj2[i], true) : obj1[i] !== obj2[i]) {
        return false;
      }
    }
    return true;
  }
  
  // Objects
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (!(key in obj2)) return false;
      
      if (deep ? !isEqual(obj1[key], obj2[key], true) : obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
  
  return obj1 === obj2;
};

export const defaults = (obj, ...sources) => {
  const result = { ...obj };
  
  for (const source of sources) {
    if (source && typeof source === 'object') {
      for (const [key, value] of Object.entries(source)) {
        if (!(key in result) || result[key] === undefined) {
          result[key] = value;
        }
      }
    }
  }
  
  return result;
};

export const flatten = (obj, separator = '.', prefix = '') => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, separator, newKey));
    } else {
      result[newKey] = value;
    }
  }
  
  return result;
};

export const unflatten = (obj, separator = '.') => {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    setProperty(result, key.replace(new RegExp('\\' + separator, 'g'), '.'), value);
  }
  
  return result;
};

export const transform = (obj, transformer, accumulator = {}) => {
  if (!obj || typeof obj !== 'object') return accumulator;
  
  for (const [key, value] of Object.entries(obj)) {
    transformer(accumulator, value, key, obj);
  }
  
  return accumulator;
};

export const clone = (obj, deep = false) => {
  if (deep) {
    return deepClone(obj);
  }
  
  if (Array.isArray(obj)) return [...obj];
  if (obj && typeof obj === 'object') return { ...obj };
  
  return obj;
};

export const merge = (...objects) => {
  return Object.assign({}, ...objects);
};

export const assign = (target, ...sources) => {
  return Object.assign(target, ...sources);
};

// Validation helpers
export const hasKeys = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return false;
  
  return keys.every(key => key in obj);
};

export const hasValues = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  
  return Object.values(obj).some(value => value !== undefined && value !== null);
};

export const isPlainObject = (obj) => {
  return obj && typeof obj === 'object' && obj.constructor === Object;
};

// Export all utilities
export default {
  deepClone,
  deepMerge,
  isObject,
  isEmpty,
  isNotEmpty,
  hasProperty,
  getProperty,
  setProperty,
  deleteProperty,
  pick,
  omit,
  mapValues,
  mapKeys,
  filterObject,
  findKey,
  findValue,
  invert,
  groupBy,
  keys,
  values,
  entries,
  fromEntries,
  size,
  isEqual,
  defaults,
  flatten,
  unflatten,
  transform,
  clone,
  merge,
  assign,
  hasKeys,
  hasValues,
  isPlainObject
};