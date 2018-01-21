export default config => {
  const f = name => 
    // Check that name is valid

    // Check if each arg is a validFontWeight()
    // If more than one is, error 'You have supplied more than one font weight';
    // If none are, try a lookup with 'regular' and 'normal';
    // If one is, try a lookup with it.

    // Check if each arg is a validFontStyle()
    // If more than one is, error 'You have supplied more than one font style';
    // If none are, try a lookup with 'regular' and 'normal';
    // If one is, try a lookup with it.

    // Build the font stack by combining name with fallbacks.

     ({
      // 'font-family': fontStack,
      // 'font-weight': fontWeight,
      // 'font-style': fontStyle,
    })
  ;

  const offsetForFace = name => {};

  return {
    f,
    offsetForFace,
  };
};
