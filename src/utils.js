import {
  curry,
  join,
  compose,
  flip,
  append,
  tap,
  equals,
  complement,
  contains,
  prop,
} from 'ramda';

import { VALID_WEIGHT_VALUES, VALID_STYLE_VALUES } from './const';

const log = curry((loggingFunction, prefix) =>
  tap(
    compose(loggingFunction, join(`: `), flip(append)([prefix]), JSON.stringify)
  )
);

const isZero = equals(0);
export const isNotZero = complement(isZero);

// eslint-disable-next-line no-console
export const logToConsole = log(console.log);

export const isValidFontWeight = flip(contains)(VALID_WEIGHT_VALUES);
export const isValidFontStyle = flip(contains)(VALID_STYLE_VALUES);

export const propValue = prop(`value`);
