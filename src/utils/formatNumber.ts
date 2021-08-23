import BigNumber from 'bignumber.js';

interface Options {
  decimalPlaces?: number,
  trimZerosUnsafe?: boolean,
}

export default (number: number | string | bigint, optionsIn?: Options): string => {
  const options = optionsIn || {};
  const value = new BigNumber(number as string);
  const decimalPlaces =
    options.decimalPlaces == null
      ? value.decimalPlaces()
      : options.decimalPlaces;
  return options.trimZerosUnsafe
    ? value.decimalPlaces(decimalPlaces).toString()
    : value.toFormat(decimalPlaces);
};
