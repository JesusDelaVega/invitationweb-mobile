// Date and Time Utility Functions
// Centralized date/time formatting and manipulation

type Locale = 'es' | 'en';

interface LocaleStrings {
  justNow: string;
  secondsAgo: (n: number) => string;
  minutesAgo: (n: number) => string;
  hoursAgo: (n: number) => string;
  daysAgo: (n: number) => string;
  monthsAgo: (n: number) => string;
  yearsAgo: (n: number) => string;
}

/**
 * Get relative time string from timestamp
 */
export function getRelativeTime(timestamp: number | Date | string, locale: Locale = 'es'): string | null {
  if (!timestamp) return null;

  const now = Date.now();
  const then = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const strings: Record<Locale, LocaleStrings> = {
    es: {
      justNow: 'justo ahora',
      secondsAgo: (n) => `hace ${n}s`,
      minutesAgo: (n) => `hace ${n}m`,
      hoursAgo: (n) => `hace ${n}h`,
      daysAgo: (n) => `hace ${n}d`,
      monthsAgo: (n) => `hace ${n} ${n === 1 ? 'mes' : 'meses'}`,
      yearsAgo: (n) => `hace ${n} ${n === 1 ? 'año' : 'años'}`
    },
    en: {
      justNow: 'just now',
      secondsAgo: (n) => `${n}s ago`,
      minutesAgo: (n) => `${n}m ago`,
      hoursAgo: (n) => `${n}h ago`,
      daysAgo: (n) => `${n}d ago`,
      monthsAgo: (n) => `${n} month${n === 1 ? '' : 's'} ago`,
      yearsAgo: (n) => `${n} year${n === 1 ? '' : 's'} ago`
    }
  };

  const t = strings[locale] || strings.es;

  if (seconds < 30) return t.justNow;
  if (seconds < 60) return t.secondsAgo(seconds);
  if (minutes < 60) return t.minutesAgo(minutes);
  if (hours < 24) return t.hoursAgo(hours);
  if (days < 30) return t.daysAgo(days);
  if (days < 365) return t.monthsAgo(Math.floor(days / 30));
  return t.yearsAgo(Math.floor(days / 365));
}

/**
 * Get relative time for saved content
 */
export function getSavedTimeMessage(timestamp: number | Date | string, locale: Locale = 'es'): string | null {
  if (!timestamp) return null;

  const relTime = getRelativeTime(timestamp, locale);
  if (!relTime) return null;

  return locale === 'en'
    ? `Saved ${relTime}`
    : `Guardado ${relTime}`;
}

type DateFormat = 'short' | 'medium' | 'long' | 'time' | 'datetime';

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string | number, format: DateFormat = 'medium', locale: string = 'es-MX'): string {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const formats: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  };

  try {
    return new Intl.DateTimeFormat(locale, formats[format] || formats.medium).format(d);
  } catch (error) {
    return d.toLocaleDateString(locale);
  }
}

/**
 * Format time to readable string
 */
export function formatTime(date: Date | string | number, includeSeconds: boolean = false, locale: string = 'es-MX'): string {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch (error) {
    return d.toLocaleTimeString(locale);
  }
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  if (!date) return false;

  const d = new Date(date);
  const today = new Date();

  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  if (!date) return false;
  return new Date(date).getTime() > Date.now();
}

/**
 * Get days between two dates
 */
export function daysBetween(date1: Date | string | number, date2: Date | string | number = new Date()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get hours between two dates
 */
export function hoursBetween(date1: Date | string | number, date2: Date | string | number = new Date()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60));
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add hours to a date
 */
export function addHours(date: Date | string | number, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number, locale: Locale = 'es'): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (locale === 'en') {
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Parse date string in various formats
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Default export with all functions
export default {
  getRelativeTime,
  getSavedTimeMessage,
  formatDate,
  formatTime,
  isToday,
  isPast,
  isFuture,
  daysBetween,
  hoursBetween,
  addDays,
  addHours,
  formatDuration,
  parseDate,
  startOfDay,
  endOfDay
};
