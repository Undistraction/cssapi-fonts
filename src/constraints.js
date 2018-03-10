import {
  validateIsString,
  validateIsArrayOf,
  validateIsValidNumber,
  andValidator,
  validateIsNotEmpty,
  validateIsArray,
  validateIsWhitelistedValue,
  orValidator,
  validateIsPlainObject,
} from 'folktale-validations'
import { VALID_WEIGHT_VALUES, VALID_STYLE_VALUES } from './const'

export const CONFIG = {
  fields: [
    {
      name: `fonts`,
      isRequired: true,
      validator: validateIsArrayOf(validateIsPlainObject),
      children: {
        fields: [
          {
            name: `family`,
            isRequired: true,
            validator: validateIsString,
          },
          {
            name: `fallbacks`,
            validator: validateIsArrayOf(validateIsString),
            defaultValue: [],
          },
          {
            name: `baselineOffset`,
            validator: validateIsValidNumber,
            defaultValue: 0,
          },
          {
            name: `weights`,
            validator: andValidator(validateIsArray, validateIsNotEmpty),
            isRequired: true,
            children: {
              fields: [
                {
                  name: `name`,
                  validator: validateIsString,
                },
                {
                  name: `weight`,
                  isRequired: true,
                  validator: validateIsWhitelistedValue(VALID_WEIGHT_VALUES),
                },
                {
                  name: `styles`,
                  isRequired: true,
                  validator: validateIsArrayOf(validateIsPlainObject),
                  children: {
                    fields: [
                      {
                        name: `name`,
                        validator: validateIsString,
                      },
                      {
                        name: `style`,
                        isRequired: true,
                        validator: validateIsWhitelistedValue(
                          VALID_STYLE_VALUES
                        ),
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
}

export const FONTS_ARGS = {
  fields: [
    {
      name: `config`,
      validator: validateIsPlainObject,
      isRequired: true,
      value: CONFIG,
    },
  ],
}

export const API_FONT_ARGS = {
  fields: [
    {
      name: `family`,
      validator: validateIsString,
    },
    {
      name: `weight`,
      validator: orValidator(validateIsString, validateIsValidNumber),
    },
    {
      name: `style`,
      validator: validateIsString,
    },
  ],
}

export const API_OFFSET_ARGS = {
  fields: [
    {
      name: `family`,
      validator: validateIsString,
    },
  ],
}
