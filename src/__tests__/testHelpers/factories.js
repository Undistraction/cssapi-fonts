import { VALID_STYLES, VALID_STRING_WEIGHTS } from '../../const';

const validFont1 = {
  family: `validFamily1`,
  weights: [
    {
      weight: VALID_STRING_WEIGHTS.normal,
      styles: [
        {
          style: VALID_STYLES.italic,
        },
      ],
    },
  ],
};

const validFont2 = {
  family: `validFamily2`,
  fallbacks: [`fallback1`, `fallback2`],
  baselineOffset: 2,
  weights: [
    {
      weight: VALID_STRING_WEIGHTS.normal,
      styles: [
        {
          style: VALID_STYLES.normal,
        },
        {
          style: VALID_STYLES.italic,
        },
      ],
    },
    {
      weight: VALID_STRING_WEIGHTS.bold,
      styles: [
        {
          style: VALID_STYLES.normal,
        },
        {
          style: VALID_STYLES.italic,
        },
      ],
    },
  ],
};

// eslint-disable-next-line import/prefer-default-export
export const minimumValidConfig = () => ({
  fonts: [validFont1],
});

export const multiFontConfig = () => ({
  fonts: [validFont1, validFont2],
});
