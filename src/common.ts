/**
 * Check type numeric
 *
 * @param {*} val
 * @returns
 */
import {isEmpty} from "./is-empty";

export const isNumeric = (val: any) => {
    return /^-?\d+$/.test(val);
};

export const hasDuplicates = (arr: Array<any>) => {
    if (isEmpty(arr)) {
        return false;
    }

    return new Set(arr).size !== arr.length;
};
/**
 * Find duplicate to array
 * @param dataList
 */
export const findDuplicates = (dataList: Array<any>) => {
    if (isEmpty(dataList)) {
        return [];
    }

    return dataList.filter((item: any, index: number) => index !== dataList.indexOf(item));
};

/**
 *  Has number
 * @param str
 */
export const hasNumber = (str: string) => {
    if (!str) {
        return false;
    }

    return /\d/.test(str);
};

/**
 * Has upper case
 * @param str
 */
export const hasUpperCase = (str: string) => {
    return str !== str.toLowerCase();
};

/**
 * Check has white space
 * @param str
 */
export const hasWhiteSpace = (str: string) => {
    return /\s/g.test(str);
};