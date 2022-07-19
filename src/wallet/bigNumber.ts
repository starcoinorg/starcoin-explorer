// https://mikemcl.github.io/bignumber.js/#toFix
import BigNumber from 'bignumber.js';

import { isNil, isNumber, isString } from 'lodash';
// import '@formatjs/intl-numberformat/polyfill'; // ES6 Intl.NumberFormat
// import '@formatjs/intl-numberformat/locale-data/en'; // locale-data for en
// import '@formatjs/intl-pluralrules/polyfill';
// import '@formatjs/intl-pluralrules/locale-data/en';
// import '@formatjs/intl-locale/polyfill';
// import '@formatjs/intl-getcanonicallocales/polyfill';
// https://formatjs.io/docs/polyfills 如果polyfill缺失会导致部分安卓机异常，所以将来考虑用另外一个库来处理吧

// 四舍五入 同 Math.round     1.1->1, 1.9->2, -1.1->-1, -1.9->-2
export const { ROUND_HALF_UP } = BigNumber;
// 往负无穷端取整 同 Math.floor  1.1->1, 1.9->1, -1.1->-2, -1.9->-2
export const { ROUND_FLOOR } = BigNumber;
// 往正无穷端取整 同 Math.ceil   1.1->2, 1.9->2, -1.1->-1, -1.9->-1
export const { ROUND_CEIL } = BigNumber;
// 四舍五入 的入，从0中心往两端取整  1.1->2, 1.9->2, -1.1->-2, -1.9->-2
export const { ROUND_UP } = BigNumber;
// 四舍五入 的舍，两端往0中心取整       1.1->1, 1.9->1, -1.1->-1, -1.9->-1
export const { ROUND_DOWN } = BigNumber;

/**
 * 去除数字中的特殊符号，因为其他地方传来的数字可能包含逗号、空格等标识符
 * @param num
 * @return {*}
 */
export function cleanNum(num: string) {
  if (isString(num)) {
    return num.replace(/,|\s/gi, '');
  }
  return num;
}

/**
 * 加 .plus()
 * 减 .minus()
 * 乘 .times()
 * 除 .div()
 * @param number
 * @return {BigNumber}
 */
export function bigNum(number: string) {
  return new BigNumber(cleanNum(number));
}

// Intl.NumberFormat 不支持20位小数的格式化
// 如果超出了，将导致程序异常 RangeError: 21 is outside of range [0, 20]
// 目前 formatNumber 内部进行了判断，如果小数位超出20个，按20处理，后面的位数直接忽略，这样避免程序异常
export function safeFractionDigits(digits: number) {
  if (digits > 20) {
    return 20;
  }
  if (digits < 0) {
    return 0;
  }
  return digits;
}

export function isInvalidNumber(value: string) {
  return (
    value === '' ||
    value === '-' ||
    Number.isNaN(Number(value)) ||
    isNil(value) ||
    Number(value) === Infinity ||
    Number(value) === -Infinity ||
    value === 'Infinity' ||
    value === '-Infinity' ||
    value === 'NaN'
  );
}

export function isValidNumber(value: string) {
  return !isInvalidNumber(value);
}

export function isExactDivision(number: string, denominator: string) {
  return bigNum(number).modulo(denominator).toNumber() === 0;
}

// 2 -> 0.01
// 1 -> 0.1
export function scaleToDecimal(scale: string) {
  return bigNum('1').div(bigNum('10').pow(scale)).toFixed();
}

// 0.1 -> 1
// 0.01 -> 2
export function decimalToScale(num: string) {
  return bigNum(
    Math.log10(Number(bigNum('1').div(num).toNumber())).toString()
  ).toFixed();
}

export function convertToBigNumberRoundMode(round: string) {
  if (isString(round)) {
    switch (round) {
      case 'round':
        return ROUND_HALF_UP;

      case 'ceil':
        return ROUND_CEIL;

      case 'floor':
        return ROUND_FLOOR;

      default:
        throw new Error(`formatNumber round param is Error: ${round}`);
    }
  }
  return round;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
// console.log(Intl.NumberFormat('en-US', { notation: "compact" , compactDisplay: "short" }).format(987654321));
type FormatNumberMeta = (...args: any) => any;
export function formatNumberMeta(
  value: string,
  {
    precision = undefined, // 显示小数位精度，undefined则原始值返回，不进行小数位处理
    round = 'floor', // 'round','ceil','floor' 小数位处理进位方式
    trailingZero = true, // 小数位处理，如果小数位不足是否追加 0 (toFixed的默认行为)
    showSign = false, // 追加正负符号, 根据原始值value大于零判断，而非toFixed之后的数值
    percentStyle = false, // 百分比形式显示
    compact = false, // 显示 1.3k 1.5k 格式
    grouped = false, // 显示 逗号分隔组 1,234,223.183
    nilText = '', // 任何无效数字的返回值 (如果 nanText 和 infinityText 未赋值，也将使用该值)
    nanText = undefined, // NaN 返回值
    infinityText = undefined // Infinity 返回值
  } = {}
): FormatNumberMeta {
  let precisions: undefined | number;
  if (isString(precision)) {
    precisions = parseFloat(precision);
  }
  if (Number.isNaN(Number(precision))) {
    precisions = undefined;
  }
  if (Number(precision) < 0) {
    // BigNumber.toFixed 不支持负数的格式化（整数部分处理）
    // 如果需要整数部分的格式化，直接使用 toFixedNumber 方法
    precisions = 0;
  }
  const buildNilReturn = (text?: string) => {
    return {
      raw: value,
      fixed: text,
      text: text || (isString(nanText) ? nanText : nilText),
      isValid: false
    };
  };

  // if (isInvalidNumber(value)) {
  //   return buildNilReturn(nilText);
  // }

  const rounds = convertToBigNumberRoundMode(round);

  if (Number.isNaN(value)) {
    return buildNilReturn() as any;
  }

  const num = bigNum(value);
  const digits = num.decimalPlaces();

  let toFixedPrecision = precisions;
  if (isNumber(toFixedPrecision) && percentStyle) {
    toFixedPrecision += 2;
  }
  const valueFixed = num.toFixed(toFixedPrecision!, rounds);
  let numStr = valueFixed;

  if (numStr === 'NaN') {
    return buildNilReturn() as any;
  }

  if (numStr === 'Infinity' || numStr === '-Infinity') {
    return buildNilReturn(
      isString(infinityText) ? infinityText : nilText
    ) as any;
  }

  let fractionDigits = digits;
  if (percentStyle) {
    fractionDigits -= 2;
  }
  if (compact) {
    fractionDigits = undefined!;
  }
  if (isNumber(precision)) {
    fractionDigits = precision;
  }
  const formatOptions: Intl.NumberFormatOptions | undefined = {
    style: 'decimal', // decimal currency percent unit
    signDisplay: 'auto', // auto never always exceptZero + -
    notation: 'standard', // standard scientific engineering compact
    compactDisplay: 'short', // compact_notation display mode: short long
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
    useGrouping: false
  };

  if (grouped) {
    formatOptions.useGrouping = true;
  }

  if (compact) {
    formatOptions.notation = 'compact';
    formatOptions.compactDisplay = 'short';
    if (!isNumber(precision)) {
      formatOptions.minimumFractionDigits = undefined!;
      formatOptions.maximumFractionDigits = undefined!;
    }
  }

  if (trailingZero) {
    formatOptions.minimumFractionDigits = fractionDigits;
    formatOptions.maximumFractionDigits = fractionDigits;
  }

  if (showSign) {
    formatOptions.signDisplay = 'exceptZero';
  }

  if (percentStyle) {
    formatOptions.style = 'percent';
  }

  formatOptions.minimumFractionDigits = safeFractionDigits(
    formatOptions.minimumFractionDigits!
  );
  formatOptions.maximumFractionDigits = safeFractionDigits(
    formatOptions.maximumFractionDigits!
  );
  // console.log(formatOptions);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
  numStr = new Intl.NumberFormat('en-US', formatOptions).format(Number(numStr));
  const params: any = {
    raw: value, // 原始值
    fixed: valueFixed, // 原始值进行四舍五入后的值
    text: numStr, // 最后格式化后的数字字符串
    isValid: !isInvalidNumber(valueFixed)
  };
  return params;
}

// BigNumber.prototype.formatNumberMeta = function (options) {
//   return formatNumberMeta(this.toFixed(), options);
// };
// BigNumber.prototype.formatNumber = function (options) {
//   return formatNumber(this.toFixed(), options);
// };
