export function dataPrefixed(raw: string[]) {
  let returns: {
    all: string[];
    prefixed: string[];
    unprefixed: string[];
  } = {
    all: [...raw],
    prefixed: [],
    unprefixed: [...raw],
  };
  raw.forEach((item) => {
    returns.all.push('data-' + item);
    returns.prefixed.push('data-' + item);
  });
  return returns;
}
