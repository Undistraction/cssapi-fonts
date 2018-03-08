import { compose, objOf, prop } from 'ramda';
import { matchWithSuccessOrFailure } from 'folktale-validations';
import { throwConfigureError } from './errors';
import validateConfig from './validators/validateConfig';
import api from './api';
import { propValue, pickIsNotUndefined } from './utils';
import { CONFIGURATION_ARG_NAMES } from './const';

const { CONFIG } = CONFIGURATION_ARG_NAMES;

export default config =>
  compose(
    matchWithSuccessOrFailure(
      compose(api, prop(CONFIG), propValue),
      compose(throwConfigureError, propValue)
    ),
    validateConfig,
    pickIsNotUndefined,
    objOf(CONFIG)
  )(config);
