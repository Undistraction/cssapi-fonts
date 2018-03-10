import { compose, when } from 'ramda'
import { isPlainObject } from 'ramda-adjunct'
import { defaultRenderers } from 'folktale-validations'
import { quote, joinWithSpace, joinWithComma, appendTo } from './utils'
import {
  ERROR_PREFIX,
  API_FONT_PREFIX,
  CONFIGURE_PREFIX,
  API_OFFSET_PREFIX,
} from './const'

const { argumentsFailureRenderer } = defaultRenderers

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const throwError = message => {
  throw new Error(joinWithSpace([ERROR_PREFIX, message]))
}

const throwErrorWithPrefixedMessage = prefix =>
  compose(throwError, joinWithSpace, appendTo([prefix]))

// -----------------------------------------------------------------------------
// Prefixed Errors
// -----------------------------------------------------------------------------

export const throwConfigureError = compose(
  throwErrorWithPrefixedMessage(CONFIGURE_PREFIX),
  argumentsFailureRenderer
)
export const throwAPIFontError = compose(
  throwErrorWithPrefixedMessage(API_FONT_PREFIX),
  when(isPlainObject, argumentsFailureRenderer)
)
export const throwAPIOffsetError = compose(
  throwErrorWithPrefixedMessage(API_OFFSET_PREFIX),
  when(isPlainObject, argumentsFailureRenderer)
)

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

export const invalidConfigMessage = validationErrors =>
  `The config object was invalid: ${joinWithComma(validationErrors)}`

export const invalidAPIMessage = joinWithComma

export const noFontFamilyMessage = name =>
  `There is no font family named ${quote(name)} configured`

export const noWeightForFontFamilyMessage = (name, weight) =>
  `There is no weight ${quote(weight)} for font family named ${quote(
    name
  )} configured`

export const noStyleForWeightForFontFamilyMessage = (name, weight, style) =>
  `There is no style ${quote(style)} for weight ${quote(
    weight
  )} for font family named ${quote(name)} configured`
