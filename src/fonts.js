import { compose } from 'ramda';
import { validateIsObject } from 'folktale-validations';
import { throwError, invalidConfigMessage } from './errors';
import validateConfig from './validators/validateConfig';
import api from './api';
import { propValue } from './utils';

const throwOrBuildApi = config =>
  validateConfig(config).matchWith({
    Success: compose(api, propValue),
    Failure: compose(throwError, invalidConfigMessage, propValue),
  });

const configure = config =>
  validateIsObject(config).matchWith({
    Success: compose(throwOrBuildApi, propValue),
    Failure: compose(throwError, invalidConfigMessage, propValue),
  });

export default {
  configure,
};
