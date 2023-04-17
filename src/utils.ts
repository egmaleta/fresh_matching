// deno-lint-ignore no-explicit-any
type ObjectType = Record<string | number | symbol, any>;

function mapObject<
  T extends ObjectType,
  K extends keyof T,
  RK extends string | number | symbol,
  RV = unknown
>(o: T, mapFn: (key: K, value: T[K]) => [RK, RV]) {
  const entries = Object.entries(o).map((entry) => {
    const [key, value] = entry;
    return mapFn(key as K, value);
  });

  return Object.fromEntries(entries) as Record<RK, RV>;
}

export function mapObjectValues<
  T extends ObjectType,
  V extends T[keyof T],
  RV = unknown
>(o: T, mapFn: (value: V) => RV) {
  return mapObject(o, (k, v) => [k, mapFn(v)]);
}
