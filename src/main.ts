import { NaturalSort } from "./natural-sort";

export function caseInsensitiveSort<T>(a: T, b: T) {
    return new NaturalSort(true).sort(a, b);
}

export function caseSensitiveSort<T>(a: T, b: T) {
    return new NaturalSort(false).sort(a, b);
}

export function sort<T>(array: T[], insensitive: boolean = true): T[] {
    const naturalSort = new NaturalSort(insensitive);

    return array.sort(naturalSort.sort.bind(naturalSort));
}