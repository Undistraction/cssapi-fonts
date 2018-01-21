import {
  curry,
  join,
  compose,
  flip,
  append,
  tap,
  equals,
  complement,
  values,
  contains,
  prop,
} from 'ramda';

import { FONT_WEIGHTS, FONT_STYLES } from './const';

const log = curry((loggingFunction, prefix) =>
  tap(
    compose(loggingFunction, join(`: `), flip(append)([prefix]), JSON.stringify)
  )
);

const isZero = equals(0);
export const isNotZero = complement(isZero);

// eslint-disable-next-line no-console
export const logToConsole = log(console.log);

export const fontWeights = values(FONT_WEIGHTS);
export const fontStyles = values(FONT_STYLES);

export const isValidFontWeight = flip(contains)(fontWeights);
export const isValidFontStyle = flip(contains)(fontStyles);

export const propValue = prop(`value`);
