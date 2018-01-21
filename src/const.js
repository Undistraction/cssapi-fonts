import { values, concat } from 'ramda';

export const VALID_STYLES = Object.freeze({
  normal: `normal`,
  italic: `italic`,
  oblique: `oblique`,
});

export const VALID_STRING_WEIGHTS = Object.freeze({
  normal: `normal`,
  bold: `bold`,
});

export const VALID_NUMERIC_WEIGHTS = Object.freeze([
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
]);

export const VALID_STYLE_VALUES = values(VALID_STYLES);
export const VALID_WEIGHT_VALUES = concat(
  values(VALID_STRING_WEIGHTS),
  VALID_NUMERIC_WEIGHTS
);

export const FIELDS = Object.freeze({
  FONTS: `fonts`,
  FAMILY: `family`,
  FALLBACKS: `fallbacks`,
  BASELINE_OFFSET: `baselineOffset`,
  WEIGHTS: `weights`,
  NAME: `name`,
  WEIGHT: `weight`,
  STYLES: `styles`,
});
