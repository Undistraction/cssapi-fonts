import { map } from 'ramda';
import fonts from '../../fonts';
import { minimumValidConfig, multiFontConfig } from '../testHelpers/factories';
import { notString, notStringOrNumber } from '../testHelpers/fixtures';

describe(`fonts().font()`, () => {
  describe(`with missing args`, () => {
    const fts = fonts.configure(minimumValidConfig());
    describe(`with no args`, () => {
      it(`throws`, () => {
        expect(() => fts.font()).toThrow(
          `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String', Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number, Argument 'style': Wasn't type: 'String'`
        );
      });
    });

    describe(`with missing 'weight' and 'style'`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`a`)).toThrow(
          `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number, Argument 'style': Wasn't type: 'String'`
        );
      });
    });

    describe(`with missing 'style'`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`a`, `bold`)).toThrow(
          `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'style': Wasn't type: 'String'`
        );
      });
    });
  });

  describe(`with invalid args`, () => {
    const fts = fonts.configure(minimumValidConfig());
    describe(`'family'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(invalidValue, `bold`, `normal`)).toThrow(
            `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`
          );
        })(notString);
      });
    });

    describe(`'weight'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(`a`, invalidValue, `normal`)).toThrow(
            `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number`
          );
        })(notStringOrNumber);
      });
    });

    describe(`'style'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(`a`, `bold`, invalidValue)).toThrow(
            `[cssapi-fonts] font() You supplied invalid Arguments: Argument 'style': Wasn't type: 'String'`
          );
        })(notString);
      });
    });
  });

  describe(`with valid args`, () => {
    const fts = fonts.configure(minimumValidConfig());
    describe(`which don't resolve to a font`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`invalidFamily`, `normal`, `italic`)).toThrow(
          `[cssapi-fonts] font() There is no font family named 'invalidFamily' configured`
        );
      });
    });

    describe(`which don't resolve to a font weight`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`validFamily1`, `invalid`, `italic`)).toThrow(
          `[cssapi-fonts] font() There is no weight 'invalid' for font family named 'validFamily1' configured`
        );
      });
    });

    describe(`which don't resolve to a font style`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`validFamily1`, `normal`, `invalid`)).toThrow(
          `[cssapi-fonts] font() There is no style 'invalid' for weight 'normal' for font family named 'validFamily1' configured`
        );
      });
    });
  });

  describe(`which resolve`, () => {
    it(`returns the correct styles`, () => {
      const fts = fonts.configure(multiFontConfig());

      expect(fts.font(`validFamily1`, `normal`, `italic`)).toEqual({
        fontFamily: `validFamily1`,
        fontWeight: `normal`,
        fontStyle: `italic`,
      });

      expect(fts.font(`validFamily2`, `bold`, `normal`)).toEqual({
        fontFamily: `validFamily2, fallback1, fallback2`,
        fontWeight: `bold`,
        fontStyle: `normal`,
      });
    });
  });
});
