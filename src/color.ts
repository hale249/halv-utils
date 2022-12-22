// remove rgb prefix and parenthesis. ex: rgb(255, 255, 255) => 255, 255 ,255
export const getRawRgb = (rgbString: string): string => rgbString.replace(/(rgb\(|\))/g, '');
