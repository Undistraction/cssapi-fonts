import { join } from 'ramda';

export const throwError = message => {
  throw new Error(message);
};

export const invalidConfigMessage = validationErrors =>
  `The config object was invalid: ${join(`, `, validationErrors)}`;
