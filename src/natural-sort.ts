

type PartialParameters<FN extends (...args: any[]) => any> = PartialTuple<Parameters<FN>>;

type RemainingParameters<
    PROVIDED extends any[],
    EXPECTED extends any[]
> =
    // if the expected array has any required items…
    EXPECTED extends [infer E1, ...infer EX] ?
    // if the provided array has at least one required item,
    // recurse with one item less in each array type
    PROVIDED extends [infer P1, ...infer PX] ?
    RemainingParameters<PX, EX> :
    // else the remaining args is unchanged
    EXPECTED :
    // else there are no more arguments
    [];

type PartialTuple<
    TUPLE extends any[],
    EXTRACTED extends any[] = []
> =
    // If the tuple provided has at least one required value
    TUPLE extends [infer NEXT_PARAM, ...infer REMAINING] ?
    // recurse back in to this type with one less item 
    // in the original tuple, and the latest extracted value
    // added to the extracted list as optional
    PartialTuple<REMAINING, [...EXTRACTED, NEXT_PARAM?]> :
    // else if there are no more values, 
    // return an empty tuple so that too is a valid option
    [...EXTRACTED, ...TUPLE];

type CurriedFunction<
    PROVIDED extends any[],
    FN extends (...args: any[]) => any
> =
    <NEW_ARGS extends PartialTuple<
        RemainingParameters<PROVIDED, Parameters<FN>>
    >>(...args: NEW_ARGS) =>
        CurriedFunctionOrReturnValue<[...PROVIDED, ...NEW_ARGS], FN>

type CurriedFunctionOrReturnValue<
    PROVIDED extends any[],
    FN extends (...args: any[]) => any
> = RemainingParameters<PROVIDED, Parameters<FN>> extends [any, ...any[]] ? CurriedFunction<PROVIDED, FN> : ReturnType<FN>



function curry<FN extends (...args: any[]) => any, STARTING_ARGS extends PartialParameters<FN>>(
    targetFn: FN, ...existingArgs: STARTING_ARGS
): CurriedFunction<STARTING_ARGS, FN> {
    return function (...args: any[]) {
        const totalArgs = [...existingArgs, ...args]
        if (totalArgs.length >= targetFn.length) {
            return targetFn(...totalArgs)
        }
        return curry(targetFn, ...totalArgs as PartialParameters<FN>)
    }
}

type SortResult = 0 | 1 | -1;

const REGEXP = new RegExp(/(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/, 'gi');
const STRING_REGEXP = new RegExp(/(^[ ]*|[ ]*$)/, 'g');
const DATE_REGEXP = new RegExp(/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/);
const HEX_REGEXP = new RegExp(/^0x[0-9a-f]+$/, 'i');
const LEADING_ZERO_REGEXP = new RegExp(/^0/);

function _isNaN(value: unknown): boolean {
    return isNaN(value as number);
}

function _parseIntFromHexValue(value: unknown): number {
    return parseInt(value as string, 16);
}

function _parseDate(value: unknown): number {
    return Date.parse(value as string);
}

const _match = curry((expression: RegExp, value: string): RegExpMatchArray | null => {
    return value.match(expression);
});

const _replace = curry((expression: RegExp, replaceValue: string, value: string): string => value.replace(expression, replaceValue));

function _typeOf(value: unknown): string {
    return typeof value;
}

function _equals(a: unknown, b: unknown): boolean {
    return a === b;
}

function _isTypeMatch(a: unknown, b: unknown): boolean {
    return _equals(_typeOf(a), _typeOf(b));
}

function _lt(a: unknown, b: unknown): boolean {
    return (a as string) < (b as string);
}

function _gt(a: unknown, b: unknown): boolean {
   return (a as string) > (b as string);
}

function _max(a: number, b: number): number {
    return Math.max(a, b);
}

const _matchHex = _match(HEX_REGEXP);
const _matchDate = _match(DATE_REGEXP);
const _startsWithZero = _match(LEADING_ZERO_REGEXP);

class NaturalSort {
    public insensitive: boolean = true;

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

export function naturalSort<T>(a: T, b: T) {
    return new NaturalSort().sort(a, b);
};
