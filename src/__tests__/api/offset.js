import { map } from 'ramda';
import fonts from '../../fonts';
import { minimumValidConfig, multiFontConfig } from '../testHelpers/factories';
import { notString } from '../testHelpers/fixtures';

describe(`fonts().offset()`, () => {
  describe(`with missing args`, () => {
    describe(`with no args`, () => {
      it(`throws`, () => {
        const fts = fonts.configure(minimumValidConfig());
        expect(() => fts.offset()).toThrowMultiline(`
          [cssapi-fonts] offset() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`);
      });
    });
  });

  describe(`with invalid args`, () => {
    describe(`'family'`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          const fts = fonts.configure(minimumValidConfig());
          expect(() => fts.offset(invalidValue)).toThrowMultiline(`
            [cssapi-fonts] offset() You supplied invalid Arguments: Argument 'family': Wasn't type: 'String'`);
        })(notString);
      });
    });
  });

  describe(`with valid args`, () => {
    describe(`which don't resolve to a font`, () => {
      it(`throws`, () => {
        const fts = fonts.configure(minimumValidConfig());
        expect(() => fts.offset(`invalidFamily`)).toThrowMultiline(`
          [cssapi-fonts] offset() There is no font family named 'invalidFamily' configured`);
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
