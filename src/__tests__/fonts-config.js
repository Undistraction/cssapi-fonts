import { map } from 'ramda';
import { isObject } from 'ramda-adjunct';
import fonts from '../index';
import { notObjectOrUndefined } from './testHelpers/fixtures';
import { VALID_STRING_WEIGHTS, VALID_STYLES } from '../const';

describe(`configuration rhythm()`, () => {
  describe(`with no config`, () => {
    it(`throws`, () => {
      expect(() => fonts()).toThrowMultiline(`
        [cssapi-fonts] configure() Arguments missing required key(s): ['config']`);
    });
  });

  describe(`with invalid config`, () => {
    describe(`with a non-object`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fonts(invalidValue)).toThrowMultiline(`
          [cssapi-fonts] configure() Arguments included invalid value(s)
            – Key 'config': Wasn't Plain Object`);
        }, notObjectOrUndefined);
      });
    });

    describe(`with invalid config param names`, () => {
      it(`throws`, () => {
        const value = { a: 1, b: 2 };
        expect(() => fonts(value)).toThrowMultiline(`
          [cssapi-fonts] configure() Arguments included invalid value(s)
            – Key 'config': Object included key(s) not on whitelist: ['fonts']`);
      });
    });

    describe(`with invalid config param values`, () => {
      it(`throws`, () => {
        const value = {
          fonts: [{ family: [], fallbacks: `x`, weights: [] }],
        };
        expect(() => fonts(value)).toThrowMultiline(`
        [cssapi-fonts] configure() Arguments included invalid value(s)
          – Key 'config': Object included invalid value(s)
            – Key 'fonts': Array included invalid value(s)
              – [0] Object included invalid value(s)
                – Key 'family': Wasn't String
                – Key 'fallbacks': Wasn't Array
                – Key 'weights': Was Empty`);
      });
    });
  });

  describe(`with valid config`, () => {
    it(`returns a function`, () => {
      const value = {
        fonts: [
          {
            family: `a`,
            fallbacks: [`b`, `c`],
            baselineOffset: 0.01,
            weights: [
              {
                weight: VALID_STRING_WEIGHTS.normal,
                styles: [
                  { style: VALID_STYLES.normal },
                  { style: VALID_STYLES.italic },
                ],
              },
              {
                name: `e`, // Names are optional
                weight: VALID_STRING_WEIGHTS.bold,
                styles: [
                  {
                    name: `f`, // Names are optional
                    style: VALID_STYLES.normal,
                  },
                  {
                    name: `g`, // Names are optional
                    style: VALID_STYLES.italic,
                  },
                ],
              },
            ],
          },
        ],
      };
      const fnt = fonts(value);
      expect(isObject(fnt)).toBeTruthy();
    });
  });
});
