// Common Validation Functions
// Reusable validators for forms and data validation

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number (flexible format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Valid if 10-15 digits
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validate Mexican phone number
 */
export function isValidMexicanPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;

  const digits = phone.replace(/\D/g, '');

  // Mexican phones are 10 digits
  return digits.length === 10;
}

/**
 * Validate date string
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate time string (HH:MM format)
 */
export function isValidTime(time: string): boolean {
  if (!time || typeof time !== 'string') return false;

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time.trim());
}

/**
 * Validate required field (not empty)
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

/**
 * Validate minimum length
 */
export function minLength(value: string, minLen: number): boolean {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLen;
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, maxLen: number): boolean {
  if (!value || typeof value !== 'string') return true; // null/undefined pass
  return value.trim().length <= maxLen;
}

/**
 * Validate numeric string
 */
export function isNumeric(value: any): boolean {
  if (!value) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate integer
 */
export function isInteger(value: any): boolean {
  return Number.isInteger(Number(value));
}

/**
 * Validate positive number
 */
export function isPositive(value: any): boolean {
  return isNumeric(value) && parseFloat(value) > 0;
}

/**
 * Validate number range
 */
export function isInRange(value: any, min: number, max: number): boolean {
  if (!isNumeric(value)) return false;
  const num = parseFloat(value);
  return num >= min && num <= max;
}

/**
 * Validate file size
 */
export function isValidFileSize(file: { size?: number }, maxSizeMB: number): boolean {
  if (!file || !file.size) return false;
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(file: { type?: string }, allowedTypes: string[]): boolean {
  if (!file || !file.type) return false;
  return allowedTypes.includes(file.type);
}

/**
 * Validate image file
 */
export function isImageFile(file: { type?: string }): boolean {
  return isValidFileType(file, [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]);
}

/**
 * Validate hex color code
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color.trim());
}

export interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  requirements: {
    minLength?: boolean;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    specialChars?: boolean;
  };
}

/**
 * Validate password strength
 */
export function validatePassword(
  password: string,
  options: PasswordValidationOptions = {}
): PasswordValidationResult {
  const {
    minLength: minLen = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;

  const result: PasswordValidationResult = {
    valid: true,
    score: 0,
    requirements: {}
  };

  if (!password || typeof password !== 'string') {
    result.valid = false;
    return result;
  }

  // Check minimum length
  result.requirements.minLength = password.length >= minLen;
  if (result.requirements.minLength) result.score += 25;

  // Check uppercase
  if (requireUppercase) {
    result.requirements.uppercase = /[A-Z]/.test(password);
    if (result.requirements.uppercase) result.score += 25;
  }

  // Check lowercase
  if (requireLowercase) {
    result.requirements.lowercase = /[a-z]/.test(password);
    if (result.requirements.lowercase) result.score += 25;
  }

  // Check numbers
  if (requireNumbers) {
    result.requirements.numbers = /[0-9]/.test(password);
    if (result.requirements.numbers) result.score += 25;
  }

  // Check special characters
  if (requireSpecialChars) {
    result.requirements.specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (result.requirements.specialChars) result.score += 25;
  }

  // Determine if valid
  result.valid = Object.values(result.requirements).every(req => req === true);

  return result;
}

/**
 * Sanitize input string (remove potential XSS)
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate slug format (URL-friendly string)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug.trim());
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== 'string') return false;

  const digits = cardNumber.replace(/\D/g, '');

  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Default export with all validators
export default {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidMexicanPhone,
  isValidDate,
  isValidTime,
  isRequired,
  minLength,
  maxLength,
  isNumeric,
  isInteger,
  isPositive,
  isInRange,
  isValidFileSize,
  isValidFileType,
  isImageFile,
  isValidHexColor,
  validatePassword,
  sanitizeInput,
  isValidSlug,
  generateSlug,
  isValidCreditCard
};
