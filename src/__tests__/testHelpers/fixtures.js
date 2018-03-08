export const allValues = [
  [],
  {},
  function() {},
  /x/,
  `x`,
  1,
  null,
  undefined,
  NaN,
  true,
  false,
];

export const notObjectOrUndefined = [
  [],
  function() {},
  /x/,
  `x`,
  1,
  null,
  NaN,
  true,
  false,
];

export const notString = [
  [],
  {},
  function() {},
  /x/,
  1,
  null,
  undefined,
  NaN,
  true,
  false,
];

export const notStringOrNumber = [
  [],
  {},
  function() {},
  /x/,
  null,
  undefined,
  NaN,
  true,
  false,
];
