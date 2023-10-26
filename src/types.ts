

export type PartialParameters<FN extends (...args: any[]) => any> = PartialTuple<Parameters<FN>>;

export type RemainingParameters<
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

export type PartialTuple<
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

export type CurriedFunction<
    PROVIDED extends any[],
    FN extends (...args: any[]) => any
> =
    <NEW_ARGS extends PartialTuple<
        RemainingParameters<PROVIDED, Parameters<FN>>
    >>(...args: NEW_ARGS) =>
        CurriedFunctionOrReturnValue<[...PROVIDED, ...NEW_ARGS], FN>

export type CurriedFunctionOrReturnValue<
    PROVIDED extends any[],
    FN extends (...args: any[]) => any
> = RemainingParameters<PROVIDED, Parameters<FN>> extends [any, ...any[]] ? CurriedFunction<PROVIDED, FN> : ReturnType<FN>;

export type SortResult = 0 | 1 | -1;