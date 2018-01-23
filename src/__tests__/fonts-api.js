import { map } from 'ramda';
import fonts from '../fonts';
import { minimumValidConfig, multiFontConfig } from './testHelpers/factories';
import { notString, notStringOrNumber } from './testHelpers/fixtures';

describe(`api`, () => {
  // ---------------------------------------------------------------------------
  // font()
  // ---------------------------------------------------------------------------

  describe(`fonts().font()`, () => {
    // -------------------------------------------------------------------------
    // Arguments
    // -------------------------------------------------------------------------

    describe(`with missing or invalid args`, () => {
      describe(`with no args`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font()).toThrow(
            `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String', Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number, Argument 'style': Wasn't type: 'String'`
          );
        });
      });

      describe(`with missing 'weight' and 'style'`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font(`a`)).toThrow(
            `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number, Argument 'style': Wasn't type: 'String'`
          );
        });
      });

      describe(`with missing 'style'`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font(`a`, `bold`)).toThrow(
            `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'style': Wasn't type: 'String'`
          );
        });
      });

      describe(`with invalid 'family'`, () => {
        it(`throws`, () => {
          map(invalidValue => {
            const fts = fonts.configure(minimumValidConfig());
            expect(() => fts.font(invalidValue, `bold`, `normal`)).toThrow(
              `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`
            );
          })(notString);
        });
      });

      describe(`with invalid 'weight'`, () => {
        it(`throws`, () => {
          map(invalidValue => {
            const fts = fonts.configure(minimumValidConfig());
            expect(() => fts.font(`a`, invalidValue, `normal`)).toThrow(
              `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'weight': Wasn't type: 'String' and Wasn't a valid Number`
            );
          })(notStringOrNumber);
        });
      });

      describe(`with invalid 'style'`, () => {
        it(`throws`, () => {
          map(invalidValue => {
            const fts = fonts.configure(minimumValidConfig());
            expect(() => fts.font(`a`, `bold`, invalidValue)).toThrow(
              `[cssjs-fonts] font() You supplied invalid Arguments: Argument 'style': Wasn't type: 'String'`
            );
          })(notString);
        });
      });
    });

    // -------------------------------------------------------------------------
    // Font Lookup
    // -------------------------------------------------------------------------

    describe(`with valid args`, () => {
      describe(`which don't resolve to a font`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font(`invalidFamily`, `normal`, `italic`)).toThrow(
            `[cssjs-fonts] font() There is no font family named 'invalidFamily' configured`
          );
        });
      });

      describe(`which don't resolve to a font weight`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font(`validFamily1`, `invalid`, `italic`)).toThrow(
            `[cssjs-fonts] font() There is no weight 'invalid' for font family named 'validFamily1' configured`
          );
        });
      });

      describe(`which don't resolve to a font style`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.font(`validFamily1`, `normal`, `invalid`)).toThrow(
            `[cssjs-fonts] font() There is no style 'invalid' for weight 'normal' for font family named 'validFamily1' configured`
          );
        });
      });
    });

    describe(`which resolve`, () => {
      it(`returns the correct styles`, () => {
        const fts = fonts.configure(multiFontConfig());

        expect(fts.font(`validFamily1`, `normal`, `italic`)).toEqual({
          'font-family': `validFamily1`,
          'font-weight': `normal`,
          'font-style': `italic`,
        });

        expect(fts.font(`validFamily2`, `bold`, `normal`)).toEqual({
          'font-family': `validFamily2, fallback1, fallback2`,
          'font-weight': `bold`,
          'font-style': `normal`,
        });
      });
    });
  });

  // ---------------------------------------------------------------------------
  // offset()
  // ---------------------------------------------------------------------------

  describe(`fonts().offset()`, () => {
    describe(`with missing or invalid args`, () => {
      describe(`with no args`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.offset()).toThrow(
            `[cssjs-fonts] offset() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`
          );
        });
      });

      describe(`with invalid 'family'`, () => {
        it(`throws`, () => {
          map(invalidValue => {
            const fts = fonts.configure(minimumValidConfig());
            expect(() => fts.offset(invalidValue)).toThrow(
              `[cssjs-fonts] offset() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`
            );
          })(notString);
        });
      });
    });

    describe(`with valid args`, () => {
      describe(`which don't resolve to a font`, () => {
        it(`throws`, () => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.offset(`invalidFamily`)).toThrow(
            `[cssjs-fonts] offset() There is no font family named 'invalidFamily' configured`
          );
        });
      });
    });

    describe(`which resolve`, () => {
      it(`returns the correct offset`, () => {
        const fts = fonts.configure(multiFontConfig());
        expect(fts.offset(`validFamily1`)).toEqual(0);
        expect(fts.offset(`validFamily2`)).toEqual(2);
      });
    });
  });
});
