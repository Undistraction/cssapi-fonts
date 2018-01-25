import { lensProp, view, flip, find, compose, when, prop } from 'ramda';
import { lensEq, isUndefined } from 'ramda-adjunct';
import { joinWithComma } from './utils';
import {
  throwAPIFontError,
  throwAPIOffsetError,
  noFontFamilyMessage,
  noWeightForFontFamilyMessage,
  invalidAPIMessage,
  noStyleForWeightForFontFamilyMessage,
} from './errors';
import { FIELD_NAMES, STYLES } from './const';
import validateAPIArgs from './validators/validateAPIArgs';
import validateAPIOffsetArgs from './validators/validateAPIOffsetArgs';

const propFamily = prop(FIELD_NAMES.FAMILY);
const propWeight = prop(FIELD_NAMES.WEIGHT);
const propBaselineOffset = prop(FIELD_NAMES.BASELINE_OFFSET);
const propStyle = prop(FIELD_NAMES.STYLE);
const lFamily = lensProp(FIELD_NAMES.FAMILY);
const lWeights = lensProp(FIELD_NAMES.WEIGHTS);
const lWeight = lensProp(FIELD_NAMES.WEIGHT);
const lStyles = lensProp(FIELD_NAMES.STYLES);
const lStyle = lensProp(FIELD_NAMES.STYLE);
const lFallbacks = lensProp(FIELD_NAMES.FALLBACKS);
const lEqualsFamily = lensEq(lFamily);
const lEqualsWeight = lensEq(lWeight);
const lEqualsStyle = lensEq(lStyle);

export default config => {
  const { fonts } = config;
  const findFont = flip(find)(fonts);
  const findFontFamily = compose(findFont, lEqualsFamily);

  // ---------------------------------------------------------------------------
  // font()
  // ---------------------------------------------------------------------------

  const font = (family, weight, style) => {
    validateAPIArgs({ family, weight, style }).orElse(
      compose(throwAPIFontError, invalidAPIMessage)
    );

    // Family
    const fontFamily = findFontFamily(family); // Check that name is valid
    when(isUndefined, _ => throwAPIFontError(noFontFamilyMessage(family)))(
      fontFamily
    );

    // Weights
    const fontWeights = view(lWeights, fontFamily);
    const fontWeight = find(lEqualsWeight(weight), fontWeights);
    when(isUndefined, _ =>
      throwAPIFontError(noWeightForFontFamilyMessage(family, weight))
    )(fontWeight);

    // Styles
    const fontStyles = view(lStyles, fontWeight);
    const fontStyle = find(lEqualsStyle(style), fontStyles);
    when(isUndefined, _ =>
      throwAPIFontError(
        noStyleForWeightForFontFamilyMessage(family, weight, style)
      )
    )(fontStyle);

    return {
      [STYLES.FONT_FAMILY]: joinWithComma([
        propFamily(fontFamily),
        joinWithComma(view(lFallbacks, fontFamily)),
      ]),
      [STYLES.FONT_WEIGHT]: propWeight(fontWeight),
      [STYLES.FONT_STYLE]: propStyle(fontStyle),
    };
  };

  // ---------------------------------------------------------------------------
  // offset()
  // ---------------------------------------------------------------------------

  const offset = family => {
    validateAPIOffsetArgs({ family }).orElse(
      compose(throwAPIOffsetError, invalidAPIMessage)
    );

    const fontFamily = findFontFamily(family); // Check that name is valid

    when(isUndefined, _ => throwAPIOffsetError(noFontFamilyMessage(family)))(
      fontFamily
    );
    return propBaselineOffset(fontFamily);
  };

  return {
    font,
    offset,
  };
};
