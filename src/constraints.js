import {
  validateIsString,
  validateIsArrayOf,
  validateIsValidNumber,
  andValidator,
  validateIsNotEmpty,
  validateIsArray,
  validateIsWhitelistedString,
  validateIsObject,
} from 'folktale-validations';
import { VALID_WEIGHT_VALUES, VALID_WEIGHT_VALUES_PUBLIC } from './const';

export default {
  fields: [
    {
      name: `fonts`,
      isRequired: true,
      validator: validateIsArrayOf(validateIsObject),
      children: {
        fields: [
          {
            name: `fontFamily`,
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
                  isRequired: true,
                  validator: validateIsWhitelistedString(
                    VALID_WEIGHT_VALUES_PUBLIC
                  ),
                },
                {
                  name: `weight`,
                  isRequired: true,
                  validator: validateIsWhitelistedString(VALID_WEIGHT_VALUES),
                },
                {
                  name: `styles`,
                  isRequired: true,
                  validator: validateIsArrayOf(validateIsString),
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
