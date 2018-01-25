import { compose, append, flip } from 'ramda';
import { quote, joinWithSpace, joinWithComma } from './utils';
import {
  ERROR_PREFIX,
  API_FONT_PREFIX,
  CONFIGURE_PREFIX,
  API_OFFSET_PREFIX,
} from './const';

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const throwError = message => {
  throw new Error(joinWithSpace([ERROR_PREFIX, message]));
};

const throwPrefixedError = prefix =>
  compose(throwError, joinWithSpace, flip(append)([prefix]));

// -----------------------------------------------------------------------------
// Prefixed Errors
// -----------------------------------------------------------------------------

export const throwConfigureError = throwPrefixedError(CONFIGURE_PREFIX);
export const throwAPIFontError = throwPrefixedError(API_FONT_PREFIX);
export const throwAPIOffsetError = throwPrefixedError(API_OFFSET_PREFIX);

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

export const invalidConfigMessage = validationErrors =>
  `The config object was invalid: ${joinWithComma(validationErrors)}`;

export const invalidAPIMessage = joinWithComma;

export const noFontFamilyMessage = name =>
  `There is no font family named ${quote(name)} configured`;

export const noWeightForFontFamilyMessage = (name, weight) =>
  `There is no weight ${quote(weight)} for font family named ${quote(
    name
  )} configured`;

export const noStyleForWeightForFontFamilyMessage = (name, weight, style) =>
  `There is no style ${quote(style)} for weight ${quote(
    weight
  )} for font family named ${quote(name)} configured`;
