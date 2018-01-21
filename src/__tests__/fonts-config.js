import { map } from 'ramda';
import { isObject } from 'ramda-adjunct';
import fonts from '../index';
import { notObject } from './testHelpers/fixtures';
import { VALID_STRING_WEIGHTS, VALID_STYLES } from '../const';

describe(`configuration rhythm()`, () => {
  describe(`with no config`, () => {
    it(`throws`, () => {
      expect(() => fonts.configure()).toThrow(
        `The config object was invalid: Wasn't type: 'Object'`
      );
    });
  });

  describe(`with invalid config`, () => {
    describe(`with an non-object`, () => {
      it(`throws`, () => {
        map(invalidValue => {
          expect(() => fonts.configure(invalidValue)).toThrow(
            `The config object was invalid: Wasn't type: 'Object'`
          );
        }, notObject);
      });
    });

    describe(`with invalid config param names`, () => {
      it(`throws`, () => {
        const value = { a: 1, b: 2 };
        expect(() => fonts.configure(value)).toThrow(
          `The config object was invalid: Object Invalid: Object included invalid key(s): '[a, b]`
        );
      });
    });

    describe(`with invalid config param values`, () => {
      it(`throws`, () => {
        const value = {
          fonts: [{ family: [], fallbacks: `x`, weights: [] }],
        };
        expect(() => fonts.configure(value)).toThrow(
          `The config object was invalid: Object Invalid: for field 'fonts': Object included invalid values(s): Key 'family': Wasn't type: 'String', Key 'fallbacks': Wasn't type: 'Array', Key 'weights': Was Empty`
        );
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
      const fnt = fonts.configure(value);
      expect(isObject(fnt)).toBeTruthy();
    });
  });
});
