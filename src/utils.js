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
  view,
  reject,
  isEmpty,
  both,
  anyPass,
  replace,
} from 'ramda';
import { isNotUndefined, isUndefined, isArray, isString } from 'ramda-adjunct';
import { VALID_WEIGHT_VALUES, VALID_STYLE_VALUES } from './const';

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

const log = curry((loggingFunction, prefix) =>
  tap(
    compose(loggingFunction, join(`: `), flip(append)([prefix]), JSON.stringify)
  )
);

// eslint-disable-next-line no-console
export const logToConsole = log(console.log);

// -----------------------------------------------------------------------------
// Predicates
// -----------------------------------------------------------------------------

const isZero = equals(0);
export const isNotZero = complement(isZero);

export const isValidFontWeight = flip(contains)(VALID_WEIGHT_VALUES);
export const isValidFontStyle = flip(contains)(VALID_STYLE_VALUES);

export const isEmptyArray = both(isArray, isEmpty);
export const isEmptyString = both(isString, isEmpty);

// -----------------------------------------------------------------------------
// Lenses
// -----------------------------------------------------------------------------

export const propValue = prop(`value`);
export const hasView = lens => compose(isNotUndefined, view(lens));

// -----------------------------------------------------------------------------
// Lists
// -----------------------------------------------------------------------------

export const contained = flip(contains);
export const appendTo = flip(append);

// -----------------------------------------------------------------------------
// Strings
// -----------------------------------------------------------------------------

export const quote = value => `'${value}'`;

export const joinDefined = string => a => {
  const remaining = reject(anyPass([isEmptyString, isEmptyArray, isUndefined]))(
    a
  );
  const result = join(string, remaining);
  return result;
};

export const joinWithComma = joinDefined(`, `);
export const joinWithColon = joinDefined(`: `);
export const joinWithSpace = joinDefined(` `);

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

export const replaceValidationPrefix = replace(
  `Object Invalid: Object included invalid values(s)`
);
