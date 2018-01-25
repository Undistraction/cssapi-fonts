import { validateObjectWithConstraints } from 'folktale-validations';
import { validation as Validation } from 'folktale';
import { compose, replace, head, of } from 'ramda';
import { API_OFFSET } from '../constraints';
import { replaceValidationPrefix } from '../utils';

const { Failure } = Validation;

const replaceMessagePrefix = replaceValidationPrefix(
  `You supplied invalid Arguments`
);

const replaceKey = replace(/Key /g, `Argument `);

export default o =>
  validateObjectWithConstraints(API_OFFSET)(o).orElse(
    compose(Failure, of, replaceMessagePrefix, replaceKey, head)
  );
