

import { REGEXP, STRING_REGEXP, DATE_REGEXP, HEX_REGEXP, LEADING_ZERO_REGEXP } from './expressions'
import { _match, _lt, _gt, _max, _isNaN, _isTypeMatch, _parseIntFromHexValue, _parseDate } from './lib';

import { SortResult } from './types';


const _matchHex = _match(HEX_REGEXP);
const _matchDate = _match(DATE_REGEXP);
const _startsWithZero = _match(LEADING_ZERO_REGEXP);

export class NaturalSort {
    constructor(public insensitive: boolean = true) {}

    public sort(a: unknown, b: unknown): SortResult {
        // convert all to strings strip whitespace
        const { x, y } = this._stripWhitespace(a, b);
        // chunk/tokenize
        const { xN, yN } = this._tokenize(x, y);
        // numeric, hex or date detection
        const { xD, yD } = this._checkForAlternateTypes(x, y, xN, yN);

        let oFxNcL: number | string | null = null;
        let oFyNcL: number | string | null = null;

        // first try and sort Hex codes or Dates
        if (yD) {
            if (_lt(xD, yD)) return -1;
            if (_gt(xD, yD)) return 1;
        }

        // natural sorting through split numeric strings and default strings
        for (var cLoc = 0, numS = _max(xN.length, yN.length); _lt(cLoc, numS); cLoc++) {
            // find floats not starting with '0', string or 0 if not defined (Clint Priest)
            oFxNcL = !_startsWithZero(xN[cLoc] || '') && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
            oFyNcL = !_startsWithZero(yN[cLoc] || '') && parseFloat(yN[cLoc]) || yN[cLoc] || 0;

            // handle numeric vs string comparison - number < string - (Kyle Adams)
            if (_isNaN(oFxNcL) !== _isNaN(oFyNcL)) return _isNaN(oFxNcL) ? 1 : -1;

            // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
            else if (!_isTypeMatch(oFxNcL, oFyNcL)) {
                oFxNcL += '';
                oFyNcL += '';
            }

            if (_lt(oFxNcL!, oFyNcL!)) return -1;

            if (_gt(oFxNcL!, oFyNcL!)) return 1;
        }

        return 0;
    }

    private _castToString(value: unknown): string {
        return this.insensitive && ('' + value).toLowerCase() || '' + value;
    }


    private _stripWhitespace(a: unknown, b: unknown): Record<'x' | 'y', string> {
        const x = this._castToString(a).replace(STRING_REGEXP, '') || '';
        const y = this._castToString(b).replace(STRING_REGEXP, '') || '';

        return { x, y };
    }

    private _checkForAlternateTypes(x: string, y: string, xN: string[], yN: string[]): Record<'xD' | 'yD', number | false | null> {
        const xD = _parseIntFromHexValue(_matchHex(x)) || (xN.length !== 1 && _matchDate(x) && _parseDate(x));
        const yD = _parseIntFromHexValue(_matchHex(y)) || xD && _matchDate(y) && _parseDate(y) || null;

        return { xD, yD };
    }

    private _tokenize(a: string, b: string): Record<'xN' | 'yN', string[]> {
        const xN = a.replace(REGEXP, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');
        const yN = b.replace(REGEXP, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0');

        return { xN, yN };
    }
}
