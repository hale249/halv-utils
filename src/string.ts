/**
 * Cache string function
 * @param fn
 */
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null);
  return ((str: string) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  }) as any;
};

/**
 * @private
 */
const camelizeRE = /-(\w)/g;

export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
});

/**
 * Capitalize first letter of provided text
 * @param {String} text
 */
export const capitalize = cacheStringFunction((str: string) => str.charAt(0).toUpperCase() + str.slice(1));

/**
 * Pluralize word
 * @param word
 * @param count
 * @param suffix
 */
export const pluralize = (word: string, count = 1, suffix = 's'): string => {
  return count <= 1 ? word : `${word}${suffix}`;
};

/**
 * Truncate text if text length longer than a value
 * @param str
 * @param limit
 * @param text
 */
export const truncate = (str: string, limit: number, text = '...'): string => {
  if (str.length > limit) {
    return `${str.substring(0, limit)} ${text}`;
  }

  return str;
};

/**
 * Trim space and remove all double space or more inside
 * @param text
 */
export const trimSpace = (text: string): string => {
  return text.replace(/\s{2,}/g, ' ').trim();
};

/**
 * Is valid email
 * @param email
 * @return {boolean}
 */
const re = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);
export const isValidEmail = (email: string) => {
  if (!email.includes('@')) {
    return false;
  }

  const splitEmail = email.split('@');
  if (splitEmail[0].length > 64 || splitEmail[1].length > 255) {
    return false;
  }

  return re.test(email.toLowerCase());
};

// Replace string with `key: value` entries of the search object.
export const findAndReplace = (string: string, search: object) => {
  const regexp = new RegExp(
    Object.keys(search)
      .map(item => item.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'))
      .join('|'),
    'g',
  );
  // @ts-ignore
  return string.replace(regexp, (match: any) => search[match]);
};

const phoneNumberRegex = /((09|03|07|08|05)+([0-9]{8})\b)/;
export const isValidPhoneNumber = (phoneNumber: string) => {
  return phoneNumberRegex.test(phoneNumber);
};

export const existSpecialChar = (string: string) => {
  const specialChars = '<>@!#$%^&*()_+[]{}?:;|\'"\\,./~`-=';
  for (let i = 0; i < specialChars.length; i++) {
    if (string.indexOf(specialChars[i]) > -1) {
      return true;
    }
  }
  return false;
};

export const existNumber = (string: string) => {
  return /[0-9]/.test(string);
};

export const removeNullByte = (str: string) => str.replace(/\0.*$/g, '');

export const getMemberName = (memberName: string): string => {
  if (memberName && memberName.length > 19) {
    const arrayText = memberName.split(' ');
    return arrayText
      .map((itemName, index) => {
        if (index !== arrayText.length - 1) {
          return itemName.charAt(0);
        }

        return itemName;
      })
      .join('.');
  }

  return memberName || '';
};

// String functions
export function stringToSlug(str: string, separator: string) {
  str = str.trim();
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáãảạäăặâậấầẩẫắằèéẽëẹẻêệềếểễìíĩịïîỉĩýỳỵỷỹòóọöôộỗốồổơợớờỡụùúũủưửứừựữüûñçđ·/_,:;';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeeiiiiiiiiyyyyyooooooooooooooouuuuuuuuuuuuuncd------';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  return str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, '') // trim - from end of text
    .replace(/-/g, separator);
}
