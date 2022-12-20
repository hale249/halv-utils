/**
 * Parse to json
 * @param value
 * @param defaultValue
 * @return {{}}
 */
export const parseToJson = (value: string, defaultValue = {}) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return defaultValue;
    }
};