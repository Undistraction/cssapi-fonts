import { values, concat } from 'ramda';

const FW_PFX = `cssjs-fonts__fw_`;
const FS_PFX = `cssjs-fonts__fs_`;

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

export const FONT_STYLES = Object.freeze({
  normal: `${FS_PFX}normal`,
  regular: `${FS_PFX}regular`,
  italic: `${FS_PFX}italic`,
  oblique: `${FS_PFX}oblique`,
});

export const FONT_WEIGHTS = Object.freeze({
  thin: `${FW_PFX}thin`,
  ultraLight: `${FW_PFX}ultraLight`,
  light: `${FW_PFX}light`,
  book: `${FW_PFX}book`,
  semilight: `${FW_PFX}semilight`,
  normal: `${FW_PFX}normal`,
  regular: `${FW_PFX}regular`,
  plain: `${FW_PFX}plain`,
  medium: `${FW_PFX}medium`,
  semiBold: `${FW_PFX}semiBold`,
  demiBold: `${FW_PFX}demiBold`,
  bold: `${FW_PFX}bold`,
  extraBold: `${FW_PFX}extraBold`,
  heavy: `${FW_PFX}heavy`,
  black: `${FW_PFX}black`,
  extraBlack: `${FW_PFX}extraBlack`,
  utlraBlack: `${FW_PFX}ultraBlack`,
  ultra: `${FW_PFX}ultra`,
});

export const VALID_STYLE_VALUES = values(VALID_STYLES);
export const VALID_WEIGHT_VALUES = concat(
  values(VALID_STRING_WEIGHTS),
  VALID_NUMERIC_WEIGHTS
);

export const VALID_WEIGHT_VALUES_PUBLIC = values(FONT_WEIGHTS);
export const VALID_STYLE_VALUES_PUBLIC = values(FONT_STYLES);
