import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export function largeProfilePic(image: string | null | undefined) {
  if (!image) return '';
  if (image && image.includes('google')) {
    if (image.includes('s96-c')) {
      return image.replace('s96-c', 's300-c');
    } else if (image.includes('?sz=')) {
      return image.substring(0, image.indexOf('?')) + '?sz=300';
    }
  }
  return image;
}

export function shorten(str: string | undefined | null, length: number = 52) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function stripHtml(str: string | undefined | null) {
  if (!str) return '';
  return str.replace(/<[^>]*>?/g, '');
}

export function toTitleCase(str: string | undefined | null) {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatMoney(
  value: number | undefined | null,
  showZeros: boolean = true
) {
  if (!value) return 'M0.00';
  const formattedNumber = Number(value).toLocaleString('en-US', {
    minimumFractionDigits: showZeros ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `M${formattedNumber}`;
}

export function formatDate(date: Date | undefined | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | undefined | null) {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Sanitizes the values of an object to ensure that null values are converted to undefined,
 * @param values - The object to sanitize
 * @returns The sanitized object
 */
export function sanitize<T extends Record<string, unknown>>(
  values: T | undefined
) {
  if (!values) return undefined;

  return Object.entries(values).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: value === null ? undefined : value,
    };
  }, {} as T);
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
  const countryPatterns = {
    lesotho: {
      code: '266',
      patterns: [/^(?:\+266)?([5-8]\d{7})$/, /^0([5-8]\d{7})$/],
    },
    southAfrica: {
      code: '27',
      patterns: [/^(?:\+27)?([1-8]\d{8})$/, /^0([1-8]\d{8})$/],
    },
    botswana: {
      code: '267',
      patterns: [/^(?:\+267)?([2-8]\d{7})$/, /^0([2-8]\d{7})$/],
    },
    eswatini: {
      code: '268',
      patterns: [/^(?:\+268)?([2-8]\d{7})$/, /^0([2-8]\d{7})$/],
    },
  };

  for (const pattern of countryPatterns.lesotho.patterns) {
    const match = cleanNumber.match(pattern);
    if (match) {
      return `+${countryPatterns.lesotho.code}${match[1]}`;
    }
  }

  for (const [country, data] of Object.entries(countryPatterns)) {
    if (country === 'lesotho') continue;

    for (const pattern of data.patterns) {
      const match = cleanNumber.match(pattern);
      if (match) {
        return `+${data.code}${match[1]}`;
      }
    }
  }
  return phoneNumber;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getCountryFromIP(ipAddress: string): Promise<{
  country: string;
  countryCode: string;
  city: string;
} | null> {
  try {
    if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
      return {
        country: 'Unknown',
        countryCode: 'XX',
        city: 'Unknown',
      };
    }

    const response = await fetch(
      `http://ip-api.com/json/${ipAddress}?fields=country,countryCode,city,status`
    );
    const data = await response.json();

    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'XX',
        city: data.city || 'Unknown',
      };
    }

    return {
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
    };
  } catch (error) {
    console.error('Error getting country from IP:', error);
    return {
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
    };
  }
}

export function getImageUrl(key: string): string {
  return `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${key}`;
}
