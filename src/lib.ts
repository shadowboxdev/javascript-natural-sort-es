import { PartialParameters, CurriedFunction } from "./types";

export function curry<FN extends (...args: any[]) => any, STARTING_ARGS extends PartialParameters<FN>>(
    targetFn: FN, ...existingArgs: STARTING_ARGS
): CurriedFunction<STARTING_ARGS, FN> {
    return (...args: any[]) => {
        const totalArgs = [...existingArgs, ...args]
        if (totalArgs.length >= targetFn.length) {
            return targetFn(...totalArgs)
        }
        return curry(targetFn, ...totalArgs as PartialParameters<FN>)
    }
}


export function _isNaN(value: unknown): boolean {
    return isNaN(value as number);
}

export function _parseIntFromHexValue(value: unknown): number {
    return parseInt(value as string, 16);
}

export function _parseDate(value: unknown): number {
    return Date.parse(value as string);
}

export const _match = curry((expression: RegExp, value: string): RegExpMatchArray | null => {
    return value.match(expression);
});

export const _replace = curry((expression: RegExp, replaceValue: string, value: string): string => value.replace(expression, replaceValue));

export function _typeOf(value: unknown): string {
    return typeof value;
}

export function _equals(a: unknown, b: unknown): boolean {
    return a === b;
}

export function _isTypeMatch(a: unknown, b: unknown): boolean {
    return _equals(_typeOf(a), _typeOf(b));
}

export function _lt(a: unknown, b: unknown): boolean {
    return (a as string) < (b as string);
}

export function _gt(a: unknown, b: unknown): boolean {
   return (a as string) > (b as string);
}

export function _max(a: number, b: number): number {
    return Math.max(a, b);
}