import { map } from 'ramda';
import fonts from '../../fonts';
import { minimumValidConfig, multiFontConfig } from '../testHelpers/factories';
import { notString, notStringOrNumber } from '../testHelpers/fixtures';

describe(`fonts().font()`, () => {
  describe(`with missing args`, () => {
    const fts = fonts(minimumValidConfig());
    describe(`with no args`, () => {
      it(`throws`, () => {
        expect(() => fts.font()).toThrowMultiline(`
          [cssapi-fonts] font() Arguments included invalid value(s)
            – Key 'family': Wasn't String
            – Key 'weight': Wasn't String or Wasn't Valid Number
            – Key 'style': Wasn't String`);
      });
    });

    describe(`with missing 'weight' and 'style'`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`a`)).toThrowMultiline(`
          [cssapi-fonts] font() Arguments included invalid value(s)
            – Key 'weight': Wasn't String or Wasn't Valid Number
            – Key 'style': Wasn't String`);
      });
    });

    describe(`with missing 'style'`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`a`, `bold`)).toThrowMultiline(`
        [cssapi-fonts] font() Arguments included invalid value(s)
          – Key 'style': Wasn't String`);
      });
    });
  });

  describe(`with invalid args`, () => {
    const fts = fonts(minimumValidConfig());
    describe(`'family'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(invalidValue, `bold`, `normal`))
            .toThrowMultiline(`
            [cssapi-fonts] font() Arguments included invalid value(s)
              – Key 'family': Wasn't String`);
        })(notString);
      });
    });

    describe(`'weight'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(`a`, invalidValue, `normal`)).toThrowMultiline(`
            [cssapi-fonts] font() Arguments included invalid value(s)
              – Key 'weight': Wasn't String or Wasn't Valid Number`);
        })(notStringOrNumber);
      });
    });

    describe(`'style'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fts.font(`a`, `bold`, invalidValue)).toThrowMultiline(`
          [cssapi-fonts] font() Arguments included invalid value(s)
            – Key 'style': Wasn't String`);
        })(notString);
      });
    });
  });

  describe(`with valid args`, () => {
    const fts = fonts(minimumValidConfig());
    describe(`which don't resolve to a font`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`invalidFamily`, `normal`, `italic`))
          .toThrowMultiline(`
            [cssapi-fonts] font() There is no font family named 'invalidFamily' configured`);
      });
    });

    describe(`which don't resolve to a font weight`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`validFamily1`, `invalid`, `italic`))
          .toThrowMultiline(`
            [cssapi-fonts] font() There is no weight 'invalid' for font family named 'validFamily1' configured`);
      });
    });

    describe(`which don't resolve to a font style`, () => {
      it(`throws`, () => {
        expect(() => fts.font(`validFamily1`, `normal`, `invalid`))
          .toThrowMultiline(`
            [cssapi-fonts] font() There is no style 'invalid' for weight 'normal' for font family named 'validFamily1' configured`);
      });
    });
  });

  describe(`which resolve`, () => {
    it(`returns the correct styles`, () => {
      const fts = fonts(multiFontConfig());

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
