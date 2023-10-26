export const REGEXP = new RegExp(/(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/, 'gi');
export const STRING_REGEXP = new RegExp(/(^[ ]*|[ ]*$)/, 'g');
export const DATE_REGEXP = new RegExp(/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/);
export const HEX_REGEXP = new RegExp(/^0x[0-9a-f]+$/, 'i');
export const LEADING_ZERO_REGEXP = new RegExp(/^0/);