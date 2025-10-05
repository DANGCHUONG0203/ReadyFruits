// Date and time formatting utilities
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const {
    format = 'default',
    locale = 'vi-VN',
    includeTime = false,
    relative = false
  } = options;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  // Return relative time if requested
  if (relative) {
    return getRelativeTime(dateObj);
  }

  // Format options based on format type
  let formatOptions = {};
  
  switch (format) {
    case 'short':
      formatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      break;
    case 'long':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      break;
    case 'medium':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      break;
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    case 'datetime':
      formatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      };
      break;
    default:
      formatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
  }

  if (includeTime && format !== 'datetime') {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
};

// Format time only
export const formatTime = (date, options = {}) => {
  if (!date) return '';
  
  const {
    locale = 'vi-VN',
    format = '24hour',
    includeSeconds = false
  } = options;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';

  const formatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12hour'
  };

  if (includeSeconds) {
    formatOptions.second = '2-digit';
  }

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch (error) {
    console.error('Time formatting error:', error);
    return dateObj.toLocaleTimeString();
  }
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  if (Math.abs(diffInSeconds) < 60) {
    return 'just now';
  }

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    
    if (count >= 1) {
      const rtf = new Intl.RelativeTimeFormat('vi-VN', { numeric: 'auto' });
      return rtf.format(diffInSeconds < 0 ? count : -count, interval.label);
    }
  }
  
  return formatDate(date, { format: 'short' });
};

// Format date range
export const formatDateRange = (startDate, endDate, options = {}) => {
  if (!startDate && !endDate) return '';
  if (!endDate) return `From ${formatDate(startDate, options)}`;
  if (!startDate) return `Until ${formatDate(endDate, options)}`;
  
  const start = formatDate(startDate, options);
  const end = formatDate(endDate, options);
  
  if (start === end) return start;
  
  return `${start} - ${end}`;
};

// Parse date from various formats
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  // Try different date formats
  const formats = [
    // ISO format
    /^\d{4}-\d{2}-\d{2}$/,
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    // MM/DD/YYYY or MM-DD-YYYY
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
  ];
  
  let dateObj;
  
  // Try ISO format first
  if (formats[0].test(dateString)) {
    dateObj = new Date(dateString);
  }
  // Try DD/MM/YYYY format
  else if (formats[1].test(dateString)) {
    const match = dateString.match(formats[1]);
    dateObj = new Date(match[3], match[2] - 1, match[1]);
  }
  // Try native Date parsing
  else {
    dateObj = new Date(dateString);
  }
  
  return isNaN(dateObj.getTime()) ? null : dateObj;
};

// Date validation
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
};

// Date calculations
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

export const getDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round((firstDate - secondDate) / oneDay);
};

// Date range utilities
export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (start && checkDate < start) return false;
  if (end && checkDate > end) return false;
  
  return true;
};

export const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      };
    case 'yesterday':
      const yesterday = subtractDays(today, 1);
      return {
        start: yesterday,
        end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1)
      };
    case 'this_week':
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return {
        start: startOfWeek,
        end: addDays(startOfWeek, 6)
      };
    case 'last_week':
      const lastWeekStart = subtractDays(today, today.getDay() + 7);
      return {
        start: lastWeekStart,
        end: addDays(lastWeekStart, 6)
      };
    case 'this_month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      };
    case 'last_month':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0)
      };
    case 'this_year':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31)
      };
    case 'last_30_days':
      return {
        start: subtractDays(today, 30),
        end: today
      };
    case 'last_90_days':
      return {
        start: subtractDays(today, 90),
        end: today
      };
    default:
      return {
        start: today,
        end: today
      };
  }
};

// Business date utilities
export const isBusinessDay = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday (0) or Saturday (6)
};

export const getNextBusinessDay = (date) => {
  let nextDay = addDays(date, 1);
  while (!isBusinessDay(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
};

export const getPreviousBusinessDay = (date) => {
  let prevDay = subtractDays(date, 1);
  while (!isBusinessDay(prevDay)) {
    prevDay = subtractDays(prevDay, 1);
  }
  return prevDay;
};

// Age calculation
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Format age
export const formatAge = (birthDate) => {
  const age = calculateAge(birthDate);
  return `${age} year${age !== 1 ? 's' : ''} old`;
};

// Time zone utilities
export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateInTimeZone = (date, timeZone, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    }).format(dateObj);
  } catch (error) {
    console.error('Time zone formatting error:', error);
    return formatDate(date, options);
  }
};

// Export all utilities
export default {
  formatDate,
  formatTime,
  getRelativeTime,
  formatDateRange,
  parseDate,
  isValidDate,
  addDays,
  addHours,
  subtractDays,
  getDaysDifference,
  isDateInRange,
  getDateRange,
  isBusinessDay,
  getNextBusinessDay,
  getPreviousBusinessDay,
  calculateAge,
  formatAge,
  getTimeZone,
  formatDateInTimeZone
};