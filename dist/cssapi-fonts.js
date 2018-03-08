(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ramda')) :
	typeof define === 'function' && define.amd ? define(['ramda'], factory) :
	(global['cssapi-fonts'] = factory(global.R));
}(this, (function (_ramda) { 'use strict';

var _ramda__default = 'default' in _ramda ? _ramda['default'] : _ramda;

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var BLAME_FUNCTION_INDEX = 3; // [current, parent, *error*, caller to blame, …]

function warnDeprecation(reason) {
  // eslint-disable-line max-statements
  if (process.env.FOLKTALE_ASSERTIONS !== 'none') {
    var stack = new Error('').stack;
    var offender = void 0;
    if (stack) {
      var lines = stack.split('\n');
      offender = lines[BLAME_FUNCTION_INDEX];
    }

    if (offender) {
      console.warn(reason + '\n    Blame: ' + offender.trim());
    } else {
      console.warn(reason);
    }
  }
}

var warnDeprecation_1 = warnDeprecation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var keys$1 = Object.keys;
var symbols = Object.getOwnPropertySymbols;
var defineProperty = Object.defineProperty;
var property = Object.getOwnPropertyDescriptor;

/*
 * Extends an objects with own enumerable key/value pairs from other sources.
 *
 * This is used to define objects for the ADTs througout this file, and there
 * are some important differences from Object.assign:
 *
 *   - This code is only concerned with own enumerable property *names*.
 *   - Additionally this code copies all own symbols (important for tags).
 *
 * When copying, this function copies **whole property descriptors**, which
 * means getters/setters are not executed during the copying. The only
 * exception is when the property name is `prototype`, which is not
 * configurable in functions by default.
 *
 * This code only special cases `prototype` because any other non-configurable
 * property is considered an error, and should crash the program so it can be
 * fixed.
 */
function extend(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    keys$1(source).forEach(function (key) {
      if (key === 'prototype') {
        target[key] = source[key];
      } else {
        defineProperty(target, key, property(source, key));
      }
    });
    symbols(source).forEach(function (symbol) {
      defineProperty(target, symbol, property(source, symbol));
    });
  });
  return target;
}

var extend_1 = extend;

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------



// --[ Constants and Aliases ]------------------------------------------
var TYPE = Symbol.for('@@folktale:adt:type');
var TAG = Symbol.for('@@folktale:adt:tag');
var META = Symbol.for('@@meta:magical');

var keys = Object.keys;

// --[ Helpers ]--------------------------------------------------------

//
// Returns an array of own enumerable values in an object.
//
function values$1(object) {
  return keys(object).map(function (key) {
    return object[key];
  });
}

//
// Transforms own enumerable key/value pairs.
//
function mapObject(object, transform) {
  return keys(object).reduce(function (result, key) {
    result[key] = transform(key, object[key]);
    return result;
  }, {});
}

// --[ Variant implementation ]-----------------------------------------

//
// Defines the variants given a set of patterns and an ADT namespace.
//
function defineVariants(typeId, patterns, adt) {
  return mapObject(patterns, function (name, constructor) {
    var _constructor, _ref, _extend, _mutatorMap, _tag, _type, _constructor2, _extend2, _mutatorMap2;

    // ---[ Variant Internals ]-----------------------------------------
    function InternalConstructor() {}
    InternalConstructor.prototype = Object.create(adt);

    extend_1(InternalConstructor.prototype, (_extend = {}, _defineProperty(_extend, TAG, name), _constructor = 'constructor', _mutatorMap = {}, _mutatorMap[_constructor] = _mutatorMap[_constructor] || {}, _mutatorMap[_constructor].get = function () {
      return constructor;
    }, _ref = 'is' + name, _mutatorMap[_ref] = _mutatorMap[_ref] || {}, _mutatorMap[_ref].get = function () {
      warnDeprecation_1('.is' + name + ' is deprecated. Use ' + name + '.hasInstance(value)\ninstead to check if a value belongs to the ADT variant.');
      return true;
    }, _defineProperty(_extend, 'matchWith', function matchWith(pattern) {
      return pattern[name](this);
    }), _defineEnumerableProperties(_extend, _mutatorMap), _extend));

    function makeInstance() {
      var result = new InternalConstructor(); // eslint-disable-line prefer-const
      extend_1(result, constructor.apply(undefined, arguments) || {});
      return result;
    }

    extend_1(makeInstance, (_extend2 = {}, _defineProperty(_extend2, META, constructor[META]), _tag = 'tag', _mutatorMap2 = {}, _mutatorMap2[_tag] = _mutatorMap2[_tag] || {}, _mutatorMap2[_tag].get = function () {
      return name;
    }, _type = 'type', _mutatorMap2[_type] = _mutatorMap2[_type] || {}, _mutatorMap2[_type].get = function () {
      return typeId;
    }, _constructor2 = 'constructor', _mutatorMap2[_constructor2] = _mutatorMap2[_constructor2] || {}, _mutatorMap2[_constructor2].get = function () {
      return constructor;
    }, _defineProperty(_extend2, 'prototype', InternalConstructor.prototype), _defineProperty(_extend2, 'hasInstance', function hasInstance(value) {
      return Boolean(value) && adt.hasInstance(value) && value[TAG] === name;
    }), _defineEnumerableProperties(_extend2, _mutatorMap2), _extend2));

    return makeInstance;
  });
}

// --[ ADT Implementation ]--------------------------------------------

/*~
 * authors:
 *   - Quildreen Motta
 * 
 * stability: experimental
 * type: |
 *   (String, Object (Array String)) => Union
 */
var union$2 = function union(typeId, patterns) {
  var _extend3;

  var UnionNamespace = Object.create(Union);
  var variants = defineVariants(typeId, patterns, UnionNamespace);

  extend_1(UnionNamespace, variants, (_extend3 = {}, _defineProperty(_extend3, TYPE, typeId), _defineProperty(_extend3, 'variants', values$1(variants)), _defineProperty(_extend3, 'hasInstance', function hasInstance(value) {
    return Boolean(value) && value[TYPE] === this[TYPE];
  }), _extend3));

  return UnionNamespace;
};

/*~ ~belongsTo : union */
var Union = {
  /*~
   * type: |
   *   Union . (...(Variant, Union) => Any) => Union
   */
  derive: function derive() {
    var _this = this;

    for (var _len = arguments.length, derivations = Array(_len), _key = 0; _key < _len; _key++) {
      derivations[_key] = arguments[_key];
    }

    derivations.forEach(function (derivation) {
      _this.variants.forEach(function (variant) {
        return derivation(variant, _this);
      });
    });
    return this;
  }
};

// --[ Exports ]--------------------------------------------------------
union$2.Union = Union;
union$2.typeSymbol = TYPE;
union$2.tagSymbol = TAG;

var union_1 = union$2;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a, ('a) => 'b) => Object 'b
 */
var mapValues = function mapValues(object, transformation) {
  var keys = Object.keys(object);
  var result = {};

  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
};

// --[ Convenience ]---------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 * 
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a) . (('a) => 'b) => Object 'b
 */
mapValues.infix = function (transformation) {
  return mapValues(this, transformation);
};

// --[ Exports ]-------------------------------------------------------
var mapValues_1 = mapValues;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a) => Array 'a
 */
var values$2 = function values$$1(object) {
  return Object.keys(object).map(function (k) {
    return object[k];
  });
};

// --[ Exports ]-------------------------------------------------------
var values_1 = values$2;

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
var tagSymbol = union_1.tagSymbol;
var typeSymbol = union_1.typeSymbol;





// --[ Constants ]------------------------------------------------------
var typeJsonKey = '@@type';
var tagJsonKey = '@@tag';
var valueJsonKey = '@@value';

// --[ Helpers ]--------------------------------------------------------

/*~
 * type: ((Object 'a) => 'b) => ([Object 'a]) => Object 'b  
 */
var arrayToObject = function arrayToObject(extractKey) {
  return function (array) {
    return array.reduce(function (object, element) {
      object[extractKey(element)] = element;
      return object;
    }, {});
  };
};

/*~
 * type: (String) => (Object 'a) => 'a | None 
 */
var property$1 = function property(propertyName) {
  return function (object) {
    return object[propertyName];
  };
};

/*~
 * type: ([Object 'a]) => Object 'a 
 */
var indexByType = arrayToObject(property$1(typeSymbol));

/*~
 * type: (String, String) => Bool
 */
var assertType = function assertType(given, expected) {
  if (expected !== given) {
    throw new TypeError('\n       The JSON structure was generated from ' + expected + '.\n       You are trying to parse it as ' + given + '. \n    ');
  }
};

/*~
 * type: |
 *   type JSONSerialisation = {
 *     "@@type":  String,
 *     "@@tag":   String,
 *     "@@value": Object Any
 *   }
 *   type JSONParser = {
 *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
 *   }
 * 
 *   (Object JSONParser) => (JSONSerialisation) => Any
 */
var parseValue = function parseValue(parsers) {
  return function (value) {
    if (value !== null && typeof value[typeJsonKey] === 'string') {
      var type = value[typeJsonKey];
      if (parsers[type]) {
        return parsers[type].fromJSON(value, parsers, true);
      } else {
        return value;
      }
    } else {
      return value;
    }
  };
};

/*~
 * type: ('a) => JSON
 */
var serializeValue = function serializeValue(value) {
  return value === undefined ? null : value !== null && typeof value.toJSON === 'function' ? value.toJSON() : /* otherwise */value;
};

// --[ Implementation ]-------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void 
 */
var serialization = function serialization(variant, adt) {
  var typeName = adt[typeSymbol];
  var tagName = variant.prototype[tagSymbol];

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   * 
   *   Variant . () => JSONSerialisation
   */
  variant.prototype.toJSON = function () {
    var _ref;

    return _ref = {}, _defineProperty$1(_ref, typeJsonKey, typeName), _defineProperty$1(_ref, tagJsonKey, tagName), _defineProperty$1(_ref, valueJsonKey, mapValues_1(this, serializeValue)), _ref;
  };

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   *   type JSONParser = {
   *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
   *   }
   * 
   *   (JSONSerialisation, Array JSONParser) => Variant
   */
  adt.fromJSON = function (value) {
    var parsers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _defineProperty$1({}, typeName, adt);
    var keysIndicateType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var valueTypeName = value[typeJsonKey];
    var valueTagName = value[tagJsonKey];
    var valueContents = value[valueJsonKey];
    assertType(typeName, valueTypeName);
    var parsersByType = keysIndicateType ? parsers : /*otherwise*/indexByType(values_1(parsers));

    var parsedValue = mapValues_1(valueContents, parseValue(parsersByType));
    return extend_1(Object.create(adt[valueTagName].prototype), parsedValue);
  };
};

// --[ Exports ]--------------------------------------------------------
var serialization_1 = serialization;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var typeSymbol$2 = union_1.typeSymbol;

var assertType$1 = function (type) {
  return function (method, value) {
    var typeName = type[typeSymbol$2];
    if (process.env.FOLKTALE_ASSERTIONS !== 'none' && !type.isPrototypeOf(value)) {
      console.warn(typeName + '.' + method + ' expects a value of the same type, but was given ' + value + '.');

      if (process.env.FOLKTALE_ASSERTIONS !== 'minimal') {
        console.warn('\nThis could mean that you\'ve provided the wrong value to the method, in\nwhich case this is a bug in your program, and you should try to track\ndown why the wrong value is getting here.\n\nBut this could also mean that you have more than one ' + typeName + ' library\ninstantiated in your program. This is not **necessarily** a bug, it\ncould happen for several reasons:\n\n 1) You\'re loading the library in Node, and Node\'s cache didn\'t give\n    you back the same instance you had previously requested.\n\n 2) You have more than one Code Realm in your program, and objects\n    created from the same library, in different realms, are interacting.\n\n 3) You have a version conflict of folktale libraries, and objects\n    created from different versions of the library are interacting.\n\nIf your situation fits the cases (1) or (2), you are okay, as long as\nthe objects originate from the same version of the library. Folktale\ndoes not rely on reference checking, only structural checking. However\nyou\'ll want to watch out if you\'re modifying the ' + typeName + '\'s prototype,\nbecause you\'ll have more than one of them, and you\'ll want to make\nsure you do the same change in all of them \u2014 ideally you shouldn\'t\nbe modifying the object, though.\n\nIf your situation fits the case (3), you are *probably* okay if the\nversion difference isn\'t a major one. However, at this point the\nbehaviour of your program using ' + typeName + ' is undefined, and you should\ntry looking into why the version conflict is happening.\n\nParametric modules can help ensuring your program only has a single\ninstance of the folktale library. Check out the Folktale Architecture\ndocumentation for more information.\n      ');
      }
    }
  };
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var fantasyLand = {
  equals: 'fantasy-land/equals',
  concat: 'fantasy-land/concat',
  empty: 'fantasy-land/empty',
  map: 'fantasy-land/map',
  ap: 'fantasy-land/ap',
  of: 'fantasy-land/of',
  reduce: 'fantasy-land/reduce',
  traverse: 'fantasy-land/traverse',
  chain: 'fantasy-land/chain',
  chainRec: 'fantasy-land/chainRec',
  extend: 'fantasy-land/extend',
  extract: 'fantasy-land/extract',
  bimap: 'fantasy-land/bimap',
  promap: 'fantasy-land/promap'
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Number, (Any...) => 'a) => Any... => 'a or ((Any...) => 'a)
 */
var curry$1 = function curry$$1(arity, fn) {
  var curried = function curried(oldArgs) {
    return function () {
      for (var _len = arguments.length, newArgs = Array(_len), _key = 0; _key < _len; _key++) {
        newArgs[_key] = arguments[_key];
      }

      var allArgs = oldArgs.concat(newArgs);
      var argCount = allArgs.length;

      return argCount < arity ? curried(allArgs) : /* otherwise */fn.apply(undefined, _toConsumableArray(allArgs));
    };
  };

  return curried([]);
};

// --[ Exports ]-------------------------------------------------------
var curry_1 = curry$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



var warnDeprecatedMethod = function (methodName) {
  return function (result) {
    warnDeprecation_1('Type.' + methodName + '() is being deprecated in favour of Type[\'fantasy-land/' + methodName + '\'](). \n    Your data structure is using the old-style fantasy-land methods,\n    and these won\'t be supported in Folktale 3');
    return result;
  };
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var unsupportedMethod = function (methodName) {
  return function (object) {
    throw new TypeError(object + " does not have a method '" + methodName + "'.");
  };
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flEquals = fantasyLand.equals;


var warn = warnDeprecatedMethod('equals');
var unsupported = unsupportedMethod('equals');

var isNew = function isNew(a) {
  return typeof a[flEquals] === 'function';
};
var isOld = function isOld(a) {
  return typeof a.equals === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => Boolean
 *   where S is Setoid
 */
var equals$1 = function equals$$1(setoidLeft, setoidRight) {
  return isNew(setoidLeft) ? setoidLeft[flEquals](setoidRight) : isOld(setoidLeft) ? warn(setoidLeft.equals(setoidRight)) : /*otherwise*/unsupported(setoidLeft);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a) => (S a) => Boolean
 *   where S is Setoid
 */
equals$1.curried = curry_1(2, function (setoidRight, setoidLeft) {
  return (// eslint-disable-line no-magic-numbers
    equals$1(setoidLeft, setoidRight)
  );
});

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a).(S a) => Boolean
 *   where S is Setoid
 */
equals$1.infix = function (aSetoid) {
  return equals$1(this, aSetoid);
};

var equals_1 = equals$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


var aliases = {
  equals: {
    /*~
     * module: null
     * type: |
     *   ('S 'a).('S 'a) => Boolean
     *   where 'S is Setoid
     */
    'fantasy-land/equals': function fantasyLandEquals(that) {
      return this.equals(that);
    }
  },

  concat: {
    /*~
     * module: null
     * type: |
     *   ('S 'a).('S 'a) => 'S 'a
     *   where 'S is Semigroup
     */
    'fantasy-land/concat': function fantasyLandConcat(that) {
      return this.concat(that);
    }
  },

  empty: {
    /*~
     * module: null
     * type: |
     *   ('M).() => 'M a
     *   where 'M is Monoid
     */
    'fantasy-land/empty': function fantasyLandEmpty() {
      return this.empty();
    }
  },

  map: {
    /*~
     * module: null
     * type: |
     *   ('F 'a).(('a) => 'b) => 'F 'b
     *   where 'F is Functor
     */
    'fantasy-land/map': function fantasyLandMap(transformation) {
      return this.map(transformation);
    }
  },

  apply: {
    /*~
     * module: null
     * type: |
     *   ('F ('a) => b).('F 'a) => 'F 'b
     *   where 'F is Apply
     */
    ap: function ap$$1(that) {
      return this.apply(that);
    },


    /*~
     * module: null
     * type: |
     *   ('F 'a).('F ('a) => 'b) => 'F 'b
     *   where 'F is Apply
     */
    'fantasy-land/ap': function fantasyLandAp(that) {
      return that.apply(this);
    }
  },

  of: {
    /*~
     * module: null
     * type: |
     *   forall F, a:
     *     (F).(a) => F a
     *   where F is Applicative 
     */
    'fantasy-land/of': function fantasyLandOf(value) {
      return this.of(value);
    }
  },

  reduce: {
    /*~
     * module: null
     * type: |
     *   forall F, a, b:
     *     (F a).((b, a) => b, b) => b
     *   where F is Foldable  
     */
    'fantasy-land/reduce': function fantasyLandReduce(combinator, initial) {
      return this.reduce(combinator, initial);
    }
  },

  traverse: {
    /*~
     * module: null
     * type: |
     *   forall F, T, a, b:
     *     (T a).((a) => F b, (c) => F c) => F (T b)
     *   where F is Apply, T is Traversable
     */
    'fantasy-land/traverse': function fantasyLandTraverse(transformation, lift) {
      return this.traverse(transformation, lift);
    }
  },

  chain: {
    /*~
     * module: null
     * type: |
     *   forall M, a, b:
     *     (M a).((a) => M b) => M b
     *   where M is Chain
     */
    'fantasy-land/chain': function fantasyLandChain(transformation) {
      return this.chain(transformation);
    }
  },

  chainRecursively: {
    /*~
     * module: null
     * type: |
     *   forall M, a, b, c:
     *     (M).(
     *       Step:    ((a) => c, (b) => c, a) => M c,
     *       Initial: a
     *     ) => M b
     *   where M is ChainRec 
     */
    chainRec: function chainRec(step, initial) {
      return this.chainRecursively(step, initial);
    },


    /*~
     * module: null
     * type: |
     *   forall M, a, b, c:
     *     (M).(
     *       Step:    ((a) => c, (b) => c, a) => M c,
     *       Initial: a
     *     ) => M b
     *   where M is ChainRec 
     */
    'fantasy-land/chainRec': function fantasyLandChainRec(step, initial) {
      return this.chainRecursively(step, initial);
    }
  },

  extend: {
    /*~
     * module: null
     * type: |
     *   forall W, a, b:
     *     (W a).((W a) => b) => W b
     *   where W is Extend
     */
    'fantasy-land/extend': function fantasyLandExtend(transformation) {
      return this.extend(transformation);
    }
  },

  extract: {
    /*~
     * module: null
     * type: |
     *   forall W, a, b:
     *     (W a).() => a
     *   where W is Comonad
     */
    'fantasy-land/extract': function fantasyLandExtract() {
      return this.extract();
    }
  },

  bimap: {
    /*~
     * module: null
     * type: |
     *   forall F, a, b, c, d:
     *     (F a b).((a) => c, (b) => d) => F c d
     *   where F is Bifunctor
     */
    'fantasy-land/bimap': function fantasyLandBimap(f, g) {
      return this.bimap(f, g);
    }
  },

  promap: {
    /*~
     * module: null
     * type: |
     *   forall P, a, b, c, d:
     *     (P a b).((c) => a, (b) => d) => P c d
     */
    'fantasy-land/promap': function fantasyLandPromap(f, g) {
      return this.promap(f, g);
    }
  }
};

var provideAliases = function provideAliases(structure) {
  Object.keys(aliases).forEach(function (method) {
    if (typeof structure[method] === 'function') {
      Object.keys(aliases[method]).forEach(function (alias) {
        structure[alias] = aliases[method][alias];
      });
    }
  });
};

var provideFantasyLandAliases = provideAliases;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var mm = Symbol.for('@@meta:magical');

var copyDocumentation = function copyDocumentation(source, target) {
  var extensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (process.env.FOLKTALE_DOCS !== 'false') {
    target[mm] = Object.assign({}, source[mm] || {}, extensions);
  }
};

var copyDocumentation_1 = copyDocumentation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------






var tagSymbol$1 = union_1.tagSymbol;
var typeSymbol$1 = union_1.typeSymbol;

var toString$1 = Object.prototype.toString;
var prototypeOf = Object.getPrototypeOf;

// --[ Helpers ]--------------------------------------------------------

/*~
 * type: (Any) => Boolean
 */
var isSetoid = function isSetoid(value) {
  return value != null && (typeof value[fantasyLand.equals] === 'function' || typeof value.equals === 'function');
};

/*~
 * type: (Variant, Variant) => Boolean
 */
var sameType = function sameType(a, b) {
  return a[typeSymbol$1] === b[typeSymbol$1] && a[tagSymbol$1] === b[tagSymbol$1];
};

var isPlainObject = function isPlainObject(object) {
  if (Object(object) !== object) return false;

  return !prototypeOf(object) || !object.toString || toString$1.call(object) === object.toString();
};

var deepEquals = function deepEquals(a, b) {
  if (a === b) return true;

  var leftSetoid = isSetoid(a);
  var rightSetoid = isSetoid(b);
  if (leftSetoid) {
    if (rightSetoid) return equals_1(a, b);else return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every(function (x, i) {
      return deepEquals(x, b[i]);
    });
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    var setB = new Set(keysB);
    return keysA.length === keysB.length && prototypeOf(a) === prototypeOf(b) && keysA.every(function (k) {
      return setB.has(k) && a[k] === b[k];
    });
  }

  return false;
};

// --[ Implementation ]------------------------------------------------
/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (('a, 'a) => Boolean) => (Variant, Union) => Void
 */
var createDerivation = function createDerivation(valuesEqual) {
  /*~
   * type: ('a, 'a) => Boolean
   */
  var equals$$1 = function equals$$1(a, b) {
    // identical objects must be equal
    if (a === b) return true;

    // we require both values to be setoids if one of them is
    var leftSetoid = isSetoid(a);
    var rightSetoid = isSetoid(b);
    if (leftSetoid) {
      if (rightSetoid) return equals_1(a, b);else return false;
    }

    // fall back to the provided equality
    return valuesEqual(a, b);
  };

  /*~
   * type: (Object Any, Object Any, Array String) => Boolean
   */
  var compositesEqual = function compositesEqual(a, b, keys) {
    for (var i = 0; i < keys.length; ++i) {
      var keyA = a[keys[i]];
      var keyB = b[keys[i]];
      if (!equals$$1(keyA, keyB)) {
        return false;
      }
    }
    return true;
  };

  var derivation = function derivation(variant, adt) {
    /*~
     * stability: experimental
     * module: null
     * authors:
     *   - "@boris-marinov"
     *   - Quildreen Motta
     * 
     * type: |
     *   forall S, a:
     *     (S a).(S a) => Boolean
     *   where S is Setoid
     */
    variant.prototype.equals = function (value) {
      assertType$1(adt)(this[tagSymbol$1] + '#equals', value);
      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));
    };
    provideFantasyLandAliases(variant.prototype);
    return variant;
  };
  copyDocumentation_1(createDerivation, derivation, {
    type: '(Variant, Union) => Void'
  });

  return derivation;
};

// --[ Exports ]-------------------------------------------------------

/*~~inheritsMeta: createDerivation */
var equality = createDerivation(deepEquals);

var withCustomComparison = createDerivation;

equality.withCustomComparison = withCustomComparison;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
var tagSymbol$2 = union_1.tagSymbol;
var typeSymbol$3 = union_1.typeSymbol;

// --[ Helpers ]--------------------------------------------------------
/*~
 * type: (Object Any) => String
 */


var objectToKeyValuePairs = function objectToKeyValuePairs(object) {
  return Object.keys(object).map(function (key) {
    return key + ': ' + showValue(object[key]);
  }).join(', ');
};

/*~
 * type: (Object Any).() => String
 */
var plainObjectToString = function plainObjectToString() {
  return '{ ' + objectToKeyValuePairs(this) + ' }';
};

/*~
 * type: (Array Any).() => String
 */
var arrayToString = function arrayToString() {
  return '[' + this.map(showValue).join(', ') + ']';
};

/*~
 * type: (Function) => String
 */
var functionNameToString = function functionNameToString(fn) {
  return fn.name !== '' ? ': ' + fn.name : '';
};

/*~
 * type: (Function) => String
 */
var functionToString = function functionToString(fn) {
  return '[Function' + functionNameToString(fn) + ']';
};

/*~
 * type: () => String
 */
var nullToString = function nullToString() {
  return 'null';
};

/*~
 * type: (Null | Object Any) => String
 */
var objectToString = function objectToString(object) {
  return object === null ? nullToString : Array.isArray(object) ? arrayToString : object.toString() === {}.toString() ? plainObjectToString : /* otherwise */object.toString;
};

/*~
 * type: (Any) => String
 */
var showValue = function showValue(value) {
  return typeof value === 'undefined' ? 'undefined' : typeof value === 'function' ? functionToString(value) : (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol' ? value.toString() : (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? objectToString(value).call(value) : /* otherwise */JSON.stringify(value);
};

// --[ Implementation ]------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, Union) => Void
 */
var debugRepresentation = function debugRepresentation(variant, adt) {
  // eslint-disable-line max-statements
  var typeName = adt[typeSymbol$3];
  var variantName = adt[typeSymbol$3] + '.' + variant.prototype[tagSymbol$2];

  // (for Object.prototype.toString)
  adt[Symbol.toStringTag] = typeName;
  variant.prototype[Symbol.toStringTag] = variantName;

  // (regular JavaScript representations)
  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  adt.toString = function () {
    return typeName;
  };

  /*~
   * stability: experimental
   * mmodule: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  variant.toString = function () {
    return variantName;
  };

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   (Union).() => String
   */
  variant.prototype.toString = function () {
    return variantName + '(' + plainObjectToString.call(this) + ')';
  };

  // (Node REPL representations)
  adt.inspect = adt.toString;
  variant.inspect = variant.toString;
  variant.prototype.inspect = variant.prototype.toString;

  return variant;
};

// --[ Exports ]-------------------------------------------------------
var debugRepresentation_1 = debugRepresentation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * name: module folktale/adt/union/derivations
 */
var derivations = {
  serialization: serialization_1,
  equality: equality,
  debugRepresentation: debugRepresentation_1
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * name: module folktale/adt/union
 */
var union = {
  union: union_1,
  derivations: derivations
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * name: module folktale/adt
 */
var adt = {
  union: union
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var defineProperty$1 = Object.defineProperty;

function define(object, name, value) {
  defineProperty$1(object, name, {
    value: value,
    writable: true,
    enumerable: false,
    configurable: true
  });
}

var define_1 = define;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

function thunk(fn) {
  var value = void 0;
  var computed = false;

  return function () {
    if (computed) {
      return value;
    } else {
      computed = true;
      value = fn();
      return value;
    }
  };
}

var thunk_1 = thunk;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
var union$3 = union.union;
var derivations$2 = union.derivations;

var equality$2 = derivations$2.equality;
var debugRepresentation$1 = derivations$2.debugRepresentation;

// --[ Implementation ]------------------------------------------------

/*~ stability: experimental */

var ExecutionState = union$3('folktale:ExecutionState', {
  /*~
   */
  Pending: function Pending() {
    return {};
  },


  /*~
   */
  Cancelled: function Cancelled() {
    return {};
  },


  /*~
   */
  Resolved: function Resolved(value) {
    return { value: value };
  },


  /*~
   */
  Rejected: function Rejected(reason) {
    return { reason: reason };
  }
}).derive(equality$2, debugRepresentation$1);

// --[ Exports ]-------------------------------------------------------
var _executionState = ExecutionState;

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------



var Future$1 = thunk_1(function (_) {
  return _future;
});

var Pending$1 = _executionState.Pending;
var Cancelled = _executionState.Cancelled;
var Rejected$1 = _executionState.Rejected;
var Resolved$1 = _executionState.Resolved;

// --[ Helpers ]-------------------------------------------------------

/*~
 * type: |
 *   ('a: Deferred 'f 's, ExecutionState 'f 's) => Void :: mutates 'a
 */


var moveToState = function moveToState(deferred, newState) {
  if (!Pending$1.hasInstance(deferred._state)) {
    var description = newState.matchWith({
      Resolved: function Resolved(_) {
        return 'resolved';
      },
      Rejected: function Rejected(_) {
        return 'rejected';
      },
      Cancelled: function Cancelled(_) {
        return 'cancelled';
      }
    });
    throw new Error('Only pending deferreds can be ' + description + ', this deferred is already ' + description + '.');
  }

  deferred._state = newState;

  var listeners = deferred._listeners;

  var _loop = function _loop(i) {
    newState.matchWith({
      Resolved: function Resolved(_ref) {
        var value = _ref.value;
        return listeners[i].onResolved(value);
      },
      Rejected: function Rejected(_ref2) {
        var reason = _ref2.reason;
        return listeners[i].onRejected(reason);
      },
      Cancelled: function Cancelled(_) {
        return listeners[i].onCancelled();
      }
    });
  };

  for (var i = 0; i < listeners.length; ++i) {
    _loop(i);
  }
  deferred._listeners = [];
};

// --[ Implementation ]------------------------------------------------
/*~
 * stability: experimental
 */
function Deferred() {
  define_1(this, '_state', Pending$1());
  define_1(this, '_listeners', []);
}

Deferred.prototype = _defineProperty$2({
  // ---[ State and configuration ]------------------------------------
  /*~
   * isRequired: true
   * type: |
   *   get (Deferred 'f 's) => ExecutionState 'f 's
   */
  get _state() {
    throw new TypeError('Deferred.prototype is abstract and does not implement ._state.');
  },

  /*~
   * isRequired: true
   * type: |
   *   get (Deferred 'f 's) => Array (DeferredListener 'f 's)
   */
  get _listeners() {
    throw new TypeError('Deferred.prototype is abstract and does not implement ._listeners');
  },

  // ---[ Resolving a deferred ]---------------------------------------
  /*~
   * type: |
   *   ('a: Deferred 'f 's).('s) => 'a :: mutates 'a
   */
  resolve: function resolve(value) {
    moveToState(this, Resolved$1(value));
    return this;
  },


  /*~
   * type: |
   *   ('a: Deferred 'f 's).('f) => 'a :: mutates 'a
   */
  reject: function reject$$1(reason) {
    moveToState(this, Rejected$1(reason));
    return this;
  },


  /*~
   * type: |
   *   ('a: Deferred 'f 's).() => 'a :: mutates 'a
   */
  cancel: function cancel() {
    moveToState(this, Cancelled());
    return this;
  },


  /*~
   * type: |
   *   ('a: Deferred 'f 's).() => 'a :: mutates 'a
   */
  maybeCancel: function maybeCancel() {
    if (Pending$1.hasInstance(this._state)) {
      this.cancel();
    }
    return this;
  },


  // ---[ Reacting to events in a deferred ]---------------------------
  /*~
   * type: |
   *   ('a: Deferred 'f 's).(DeferredListener 'f 's) => Void
   */
  listen: function listen(pattern) {
    var _this = this;

    this._state.matchWith({
      Pending: function Pending(_) {
        return _this._listeners.push(pattern);
      },
      Cancelled: function Cancelled(_) {
        return pattern.onCancelled();
      },
      Resolved: function Resolved(_ref3) {
        var value = _ref3.value;
        return pattern.onResolved(value);
      },
      Rejected: function Rejected(_ref4) {
        var reason = _ref4.reason;
        return pattern.onRejected(reason);
      }
    });
    return this;
  },


  // ---[ Working with deferred values ]-------------------------------
  /*~
   * type: |
   *   (Deferred 'f 's).() => Promise 'f 's
   */
  promise: function promise() {
    var _this2 = this;

    return new Promise(function (resolve, reject$$1) {
      _this2.listen({
        onCancelled: function onCancelled(_) {
          return reject$$1(Cancelled());
        },
        onResolved: resolve,
        onRejected: reject$$1
      });
    });
  },


  /*~
   * type: |
   *   (Deferred 'f 's).() => Future 'f 's
   */
  future: function future() {
    var future = new (Future$1())(); // eslint-disable-line prefer-const
    this.listen({
      onCancelled: function onCancelled(_) {
        return moveToState(future, Cancelled());
      },
      onRejected: function onRejected(reason) {
        return moveToState(future, Rejected$1(reason));
      },
      onResolved: function onResolved(value) {
        return moveToState(future, Resolved$1(value));
      }
    });

    return future;
  },


  // ---[ Debugging ]--------------------------------------------------
  /*~
   * type: |
   *   (Deferred 'f 's).() => String
   */
  toString: function toString$$1() {
    var listeners = this._listeners.length;
    var state = this._state;

    return 'folktale:Deferred(' + state + ', ' + listeners + ' listeners)';
  },


  /*~
   * type: |
   *   (Deferred 'f 's).() => String
   */
  inspect: function inspect() {
    return this.toString();
  }
}, Symbol.toStringTag, 'folktale:Deferred');

// --[ Exports ]-------------------------------------------------------
var _deferred = Deferred;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Cancelled$1 = _executionState.Cancelled;

/*~
 * stability: experimental
 * type: |
 *   forall e, v:
 *     (Future e v) => Promise v e
 */


var futureToPromise = function futureToPromise(aFuture) {
  return new Promise(function (resolve, reject$$1) {
    aFuture.listen({
      onResolved: function onResolved(value) {
        return resolve(value);
      },
      onRejected: function onRejected(error) {
        return reject$$1(error);
      },
      onCancelled: function onCancelled() {
        return reject$$1(Cancelled$1());
      }
    });
  });
};

var futureToPromise_1 = futureToPromise;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Cancelled$2 = _executionState.Cancelled;



/*~
 * stability: experimental
 * type: |
 *   forall e, v:
 *     (Promise v e) => Future e v
 */
var promiseToFuture = function promiseToFuture(aPromise) {
  var deferred = new _deferred();
  aPromise.then(function (value) {
    return deferred.resolve(value);
  }, function (error) {
    if (Cancelled$2.hasInstance(error)) {
      deferred.cancel();
    } else {
      deferred.reject(error);
    }
  });
  return deferred.future();
};

var promiseToFuture_1 = promiseToFuture;

var _createClass = function () { function defineProperties(target, props$$1) { for (var i = 0; i < props$$1.length; i++) { var descriptor = props$$1[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------




var Pending = _executionState.Pending;
var Resolved = _executionState.Resolved;
var Rejected = _executionState.Rejected;



// --[ Implementation ]------------------------------------------------

/*~
 * stability: experimental
 */

var Future = function () {
  function Future() {
    _classCallCheck(this, Future);

    define_1(this, '_state', Pending());
    define_1(this, '_listeners', []);
  }

  // ---[ State and configuration ]------------------------------------
  /*~
   * isRequired: true
   * type: |
   *   get (Future 'f 's) => ExecutionState 'f 's
   */


  _createClass(Future, [{
    key: 'listen',


    // ---[ Reacting to Future events ]----------------------------------
    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(DeferredListener 'f 's) => Future 'f 's
     */
    value: function listen(pattern) {
      var _this = this;

      this._state.matchWith({
        Pending: function Pending() {
          return _this._listeners.push(pattern);
        },
        Cancelled: function Cancelled() {
          return pattern.onCancelled();
        },
        Resolved: function Resolved(_ref) {
          var value = _ref.value;
          return pattern.onResolved(value);
        },
        Rejected: function Rejected(_ref2) {
          var reason = _ref2.reason;
          return pattern.onRejected(reason);
        }
      });
      return this;
    }

    // --[ Transforming Futures ]----------------------------------------
    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(('s) => Future 's2) => Future 'f 's2
     */

  }, {
    key: 'chain',
    value: function chain(transformation) {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      this.listen({
        onCancelled: function onCancelled() {
          return deferred.cancel();
        },
        onRejected: function onRejected(reason) {
          return deferred.reject(reason);
        },
        onResolved: function onResolved(value) {
          transformation(value).listen({
            onCancelled: function onCancelled() {
              return deferred.cancel();
            },
            onRejected: function onRejected(reason) {
              return deferred.reject(reason);
            },
            onResolved: function onResolved(value2) {
              return deferred.resolve(value2);
            }
          });
        }
      });

      return deferred.future();
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(('s) => 's2) => Future 'f 's2
     */

  }, {
    key: 'map',
    value: function map$$1(transformation) {
      return this.chain(function (value) {
        return Future.of(transformation(value));
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(Future 'f (('s) => 's2)) => Future 'f 's2
     */

  }, {
    key: 'apply',
    value: function apply(future) {
      return this.chain(function (fn) {
        return future.map(fn);
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(('f) => 'f2, ('s) => 's2) => Future 'f2 's2
     */

  }, {
    key: 'bimap',
    value: function bimap(rejectionTransformation, successTransformation) {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      this.listen({
        onCancelled: function onCancelled() {
          return deferred.cancel();
        },
        onRejected: function onRejected(reason) {
          return deferred.reject(rejectionTransformation(reason));
        },
        onResolved: function onResolved(value) {
          return deferred.resolve(successTransformation(value));
        }
      });

      return deferred.future();
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(('f) => 'f2) => Future 'f2 's
     */

  }, {
    key: 'mapRejected',
    value: function mapRejected(transformation) {
      return this.bimap(transformation, function (x) {
        return x;
      });
    }

    // ---[ Recovering from errors ]-------------------------------------
    /*~
     * deprecated:
     *   since: 2.1.0
     *   replacedBy: .orElse(handler)
     * 
     * type: |
     *   (Future 'f 's).(('f) => Future 'f2 's2) => Future 'f2 's
     */

  }, {
    key: 'recover',
    value: function recover(handler) {
      warnDeprecation_1('`.recover` was renamed to `.orElse` for consistency, and thus `.recover(handler)` is deprecated. Use `.orElse(handler)` instead.');
      return this.orElse(handler);
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).(('f) => Future 'f2 's2) => Future 'f2 's
     */

  }, {
    key: 'orElse',
    value: function orElse(handler) {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      this.listen({
        onCancelled: function onCancelled() {
          return deferred.cancel();
        },
        onResolved: function onResolved(value) {
          return deferred.resolve(value);
        },
        onRejected: function onRejected(reason) {
          handler(reason).listen({
            onCancelled: function onCancelled() {
              return deferred.cancel();
            },
            onResolved: function onResolved(value) {
              return deferred.resolve(value);
            },
            onRejected: function onRejected(newReason) {
              return deferred.reject(newReason);
            }
          });
        }
      });

      return deferred.future();
    }

    /*~
     * stability: experimental
     * type: |
     *   forall a, b, c, d:
     *     type Pattern = { r |
     *       Cancelled: ()  => Future c d,
     *       Resolved:  (b) => Future c d,
     *       Rejected:  (a) => Future c d
     *     }
     *     
     *     (Future a b).(Pattern) => Future c d 
     */

  }, {
    key: 'willMatchWith',
    value: function willMatchWith(pattern) {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      var resolve = function resolve(handler) {
        return function (value) {
          return handler(value).listen({
            onCancelled: function onCancelled() {
              return deferred.cancel();
            },
            onResolved: function onResolved(newValue) {
              return deferred.resolve(newValue);
            },
            onRejected: function onRejected(reason) {
              return deferred.reject(reason);
            }
          });
        };
      };
      this.listen({
        onCancelled: resolve(pattern.Cancelled),
        onResolved: resolve(pattern.Resolved),
        onRejected: resolve(pattern.Rejected)
      });

      return deferred.future();
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).() => Future 's 'f
     */

  }, {
    key: 'swap',
    value: function swap() {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      this.listen({
        onCancelled: function onCancelled() {
          return deferred.cancel();
        },
        onRejected: function onRejected(reason) {
          return deferred.resolve(reason);
        },
        onResolved: function onResolved(value) {
          return deferred.reject(value);
        }
      });

      return deferred.future();
    }

    // ---[ Debugging ]--------------------------------------------------
    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).() => String
     */

  }, {
    key: 'toString',
    value: function toString$$1() {
      var listeners = this._listeners.length;
      var state = this._state;

      return 'folktale:Future(' + state + ', ' + listeners + ' listeners)';
    }

    /*~
     * stability: experimental
     * type: |
     *   (Future 'f 's).() => String
     */

  }, {
    key: 'inspect',
    value: function inspect() {
      return this.toString();
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v:
     *     (Future e v).() => Promise v e
     */

  }, {
    key: 'toPromise',
    value: function toPromise() {
      return futureToPromise_1(this);
    }
  }, {
    key: '_state',
    get: function get() {
      throw new TypeError('Future.prototype._state should be implemented in an inherited object.');
    }

    /*~
     * isRequired: true
     * type: |
     *   get (Future 'f 's) => Array (DeferredListener 'f 's)
     */

  }, {
    key: '_listeners',
    get: function get() {
      throw new TypeError('Future.prototype._listeners should be implemented in an inherited object.');
    }
  }]);

  return Future;
}();

// ---[ Constructing futures ]-----------------------------------------


Object.assign(Future, {
  /*~
   * stability: experimental
   * type: |
   *   forall a, b:
   *     (Future).(b) => Future a b
   */
  of: function of$$1(value) {
    var result = new Future(); // eslint-disable-line prefer-const
    result._state = Resolved(value);
    return result;
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Future).(a) => Future a b
   */
  rejected: function rejected(reason) {
    var result = new Future(); // eslint-disable-line prefer-const
    result._state = Rejected(reason);
    return result;
  },


  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (Promise v e) => Future e v
   */
  fromPromise: function fromPromise(aPromise) {
    return promiseToFuture_1(aPromise);
  }
});

provideFantasyLandAliases(Future);
provideFantasyLandAliases(Future.prototype);

// --[ Exports ]-------------------------------------------------------
var _future = Future;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



/*~
 * stability: experimental
 * name: module folktale/concurrency/future
 */
var future = {
  of: _future.of,
  rejected: _future.rejected,
  fromPromise: _future.fromPromise,
  _Deferred: _deferred,
  _ExecutionState: _executionState,
  _Future: _future
};

var _createClass$2 = function () { function defineProperties(target, props$$1) { for (var i = 0; i < props$$1.length; i++) { var descriptor = props$$1[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~ stability: experimental */
var TaskExecution = function () {
  /*~*/
  function TaskExecution(task, deferred) {
    _classCallCheck$2(this, TaskExecution);

    this._task = task;
    this._deferred = deferred;
  }

  /*~*/


  _createClass$2(TaskExecution, [{
    key: "cancel",
    value: function cancel() {
      this._deferred.maybeCancel();
      return this;
    }

    /*~*/

  }, {
    key: "listen",
    value: function listen(pattern) {
      this._deferred.listen(pattern);
      return this;
    }

    /*~*/

  }, {
    key: "promise",
    value: function promise() {
      return this._deferred.promise();
    }

    /*~*/

  }, {
    key: "future",
    value: function future() {
      return this._deferred.future();
    }
  }]);

  return TaskExecution;
}();

var _taskExecution = TaskExecution;

var _createClass$1 = function () { function defineProperties(target, props$$1) { for (var i = 0; i < props$$1.length; i++) { var descriptor = props$$1[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*~ stability: experimental */

var Task = function () {
  /*~
   * stability: experimental
   * type: |
   *   forall value, reason:
   *     new (
   *       ({
   *          resolve: (value) => Void,
   *          reject: (reason) => Void,
   *          cancel: () => Void,
   *          cleanup: (() => Void) => Void,
   *          onCancelled: (() => Void) => Void,
   *          get isCancelled: Boolean
   *        }) => Void
   *     ) => Task value reason
   */
  function Task(computation) {
    _classCallCheck$1(this, Task);

    this._computation = computation;
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2:
   *     (Task e v1).((v1) => Task e v2) => Task e v2
   */


  _createClass$1(Task, [{
    key: 'chain',
    value: function chain(transformation) {
      var _this = this;

      return new Task(function (resolver) {
        var execution = _this.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onRejected: resolver.reject,
          onResolved: function onResolved(value) {
            transformation(value).run().listen({
              onCancelled: resolver.cancel,
              onRejected: resolver.reject,
              onResolved: resolver.resolve
            });
          }
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v1, v2:
     *     (Task e v1).((v1) => v2) => Task e v2
     */

  }, {
    key: 'map',
    value: function map$$1(transformation) {
      var _this2 = this;

      return new Task(function (resolver) {
        var execution = _this2.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onRejected: resolver.reject,
          onResolved: function onResolved(value) {
            return resolver.resolve(transformation(value));
          }
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e1, e2, v:
     *     (Task e1 v).((e1) => e2) => Task e2 v
     */

  }, {
    key: 'mapRejected',
    value: function mapRejected(transformation) {
      var _this3 = this;

      return new Task(function (resolver) {
        var execution = _this3.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onRejected: function onRejected(reason) {
            return resolver.reject(transformation(reason));
          },
          onResolved: resolver.resolve
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v1, v2:
     *     (Task e ((v1) => v2)).(Task e v1) => Task e v2
     */

  }, {
    key: 'apply',
    value: function apply(task) {
      return this.chain(function (f) {
        return task.map(f);
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e1, e2, v1, v2:
     *     (Task e1 v1).((e1) => e2, (v1) => v2) => Task e2 v2
     */

  }, {
    key: 'bimap',
    value: function bimap(rejectionTransformation, successTransformation) {
      var _this4 = this;

      return new Task(function (resolver) {
        var execution = _this4.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onRejected: function onRejected(reason) {
            return resolver.reject(rejectionTransformation(reason));
          },
          onResolved: function onResolved(value) {
            return resolver.resolve(successTransformation(value));
          }
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e1, e2, v1, v2:
     *     type Pattern = { row |
     *       Cancelled: ()  => Task e2 v2,
     *       Resolved:  (b) => Task e2 v2,
     *       Rejected:  (a) => Task e2 v2
     *     }
     *
     *     (Task e1 v1).(Pattern) => Task e2 v2
     */

  }, {
    key: 'willMatchWith',
    value: function willMatchWith(pattern) {
      var _this5 = this;

      return new Task(function (resolver) {
        var execution = _this5.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        var resolve = function resolve(handler) {
          return function (value) {
            return handler(value).run().listen({
              onCancelled: resolver.cancel,
              onRejected: resolver.reject,
              onResolved: resolver.resolve
            });
          };
        };
        execution.listen({
          onCancelled: resolve(function (_) {
            return pattern.Cancelled();
          }),
          onRejected: resolve(pattern.Rejected),
          onResolved: resolve(pattern.Resolved)
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v: (Task e v).() => Task v e
     */

  }, {
    key: 'swap',
    value: function swap() {
      var _this6 = this;

      return new Task(function (resolver) {
        var execution = _this6.run(); // eslint-disable-line prefer-const
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onRejected: resolver.resolve,
          onResolved: resolver.reject
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, e2, v:
     *     (Task e v).((e) => Task e2 v) => Task e2 v
     */

  }, {
    key: 'orElse',
    value: function orElse(handler) {
      var _this7 = this;

      return new Task(function (resolver) {
        var execution = _this7.run();
        resolver.onCancelled(function () {
          return execution.cancel();
        });

        execution.listen({
          onCancelled: resolver.cancel,
          onResolved: resolver.resolve,
          onRejected: function onRejected(reason) {
            handler(reason).run().listen({
              onCancelled: resolver.cancel,
              onRejected: resolver.reject,
              onResolved: resolver.resolve
            });
          }
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v:
     *     (Task e v).(Task e v) => Task e v
     */

  }, {
    key: 'or',
    value: function or$$1(that) {
      var _this8 = this;

      return new Task(function (resolver) {
        var thisExecution = _this8.run(); // eslint-disable-line prefer-const
        var thatExecution = that.run(); // eslint-disable-line prefer-const
        var done = false;

        resolver.onCancelled(function () {
          thisExecution.cancel();
          thatExecution.cancel();
        });

        var guard = function guard(fn, execution) {
          return function (value) {
            if (!done) {
              done = true;
              execution.cancel();
              fn(value);
            }
          };
        };

        thisExecution.listen({
          onRejected: guard(resolver.reject, thatExecution),
          onCancelled: guard(resolver.cancel, thatExecution),
          onResolved: guard(resolver.resolve, thatExecution)
        });

        thatExecution.listen({
          onRejected: guard(resolver.reject, thisExecution),
          onCancelled: guard(resolver.cancel, thisExecution),
          onResolved: guard(resolver.resolve, thisExecution)
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v1, v2:
     *     (Task e v1).(Task e v2) => Task e (v1, v2)
     */

  }, {
    key: 'and',
    value: function and(that) {
      var _this9 = this;

      return new Task(function (resolver) {
        // eslint-disable-line max-statements
        var thisExecution = _this9.run(); // eslint-disable-line prefer-const
        var thatExecution = that.run(); // eslint-disable-line prefer-const
        var valueLeft = null;
        var valueRight = null;
        var doneLeft = false;
        var doneRight = false;
        var cancelled = false;

        resolver.onCancelled(function () {
          thisExecution.cancel();
          thatExecution.cancel();
        });

        var guardResolve = function guardResolve(setter) {
          return function (value) {
            if (cancelled) return;

            setter(value);
            if (doneLeft && doneRight) {
              resolver.resolve([valueLeft, valueRight]);
            }
          };
        };

        var guardRejection = function guardRejection(fn, execution) {
          return function (value) {
            if (cancelled) return;

            cancelled = true;
            execution.cancel();
            fn(value);
          };
        };

        thisExecution.listen({
          onRejected: guardRejection(resolver.reject, thatExecution),
          onCancelled: guardRejection(resolver.cancel, thatExecution),
          onResolved: guardResolve(function (x) {
            valueLeft = x;
            doneLeft = true;
          })
        });

        thatExecution.listen({
          onRejected: guardRejection(resolver.reject, thisExecution),
          onCancelled: guardRejection(resolver.cancel, thisExecution),
          onResolved: guardResolve(function (x) {
            valueRight = x;
            doneRight = true;
          })
        });
      });
    }

    /*~
     * stability: experimental
     * type: |
     *   forall e, v: (Task e v).() => TaskExecution e v
     */

  }, {
    key: 'run',
    value: function run() {
      var deferred = new _deferred(); // eslint-disable-line prefer-const
      var cleanups = [];
      var cancellations = [];
      var isCancelled = false;
      var done = false;

      deferred.listen({
        onCancelled: function onCancelled(_) {
          done = true;
          isCancelled = true;
          cancellations.forEach(function (f) {
            return f();
          });
          cleanups.forEach(function (f) {
            return f();
          });
          cancellations = [];
          cleanups = [];
        },

        onResolved: function onResolved(_value) {
          done = true;
          cleanups.forEach(function (f) {
            return f();
          });
          cleanups = [];
          cancellations = [];
        },

        onRejected: function onRejected(_reason) {
          done = true;
          cleanups.forEach(function (f) {
            return f();
          });
          cleanups = [];
          cancellations = [];
        }
      });

      var resources = this._computation({
        reject: function reject$$1(error) {
          deferred.reject(error);
        },
        resolve: function resolve(value) {
          deferred.resolve(value);
        },
        cancel: function cancel(_) {
          deferred.maybeCancel();
        },

        get isCancelled() {
          return isCancelled;
        },
        cleanup: function cleanup(f) {
          if (done) {
            throw new Error('Can\'t attach a cleanup handler after the task is settled.');
          }
          cleanups.push(f);
        },
        onCancelled: function onCancelled(f) {
          if (done) {
            throw new Error('Can\'t attach a cancellation handler after the task is settled.');
          }
          cancellations.push(f);
        }
      });

      return new _taskExecution(this, deferred);
    }
  }]);

  return Task;
}();

Object.assign(Task, {
  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (v) => Task e v
   */
  of: function of$$1(value) {
    return new Task(function (resolver) {
      return resolver.resolve(value);
    });
  },


  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (e) => Task e v
   */
  rejected: function rejected(reason) {
    return new Task(function (resolver) {
      return resolver.reject(reason);
    });
  }
});

provideFantasyLandAliases(Task);
provideFantasyLandAliases(Task.prototype);

var _task = Task;

/*~
 * stability: experimental
 * type: |
 *   forall value, reason:
 *     (
 *       ({
 *          resolve: (value) => Void,
 *          reject: (reason) => Void,
 *          cancel: () => Void,
 *          cleanup: (() => Void) => Void,
 *          onCancelled: (() => Void) => Void,
 *          get isCancelled: Boolean
 *        }) => Void
 *     ) => Task reason value
 */
var task$2 = function task(computation) {
  return new _task(computation);
};

var task_1 = task$2;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 * type: |
 *   forall v, e: ([Task e v Any]) => Task e v Any
 */
var waitAny = function waitAny(tasks) {
  if (tasks.length === 0) {
    throw new Error('Task.waitAny() requires a non-empty array of tasks.');
  }

  return tasks.reduce(function (a, b) {
    return a.or(b);
  });
};

var waitAny_1 = waitAny;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var of$1 = _task.of;

/*~
 * stability: experimental
 * type: |
 *   forall v, e: ([Task e v Any]) => Task e [v] Any
 */


var waitAll = function waitAll(tasks) {
  return tasks.reduce(function (a, b) {
    return a.and(b).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          xs = _ref2[0],
          x = _ref2[1];

      return [].concat(_toConsumableArray$1(xs), [x]);
    });
  }, of$1([]));
};

var waitAll_1 = waitAll;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



/*~
 * stability: experimental
 * type: |
 *   forall v, e: (GeneratorInstance [Task e v Any]) => Any => Task e [v] Any
 */
var nextGeneratorValue = function nextGeneratorValue(generator) {
  return function (value) {
    var _generator$next = generator.next(value),
        task = _generator$next.value,
        done = _generator$next.done;

    return !done ? task.chain(nextGeneratorValue(generator)
    /* else */) : task;
  };
};

/*~
 * stability: experimental
 * type: |
 *   forall v, e: (Generator [Task e v Any]) => Task e [v] Any
 */
var taskDo = function taskDo(generatorFn) {
  return new _task(function (resolver) {
    return resolver.resolve(generatorFn());
  }).chain(function (generator) {
    return nextGeneratorValue(generator)();
  });
};

var _do = taskDo;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var task$3 = task.task;

/*~
 * stability: experimental
 * authors:
 *   - "@rpearce"
 * type: |
 *    forall s, e, r:
 *    ((Any..., (e, s) => Void) => Void)
 *    => (Any...)
 *    => Task e s r
 */

var nodebackToTask = function nodebackToTask(fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return task$3(function (r) {
      return fn.apply(undefined, args.concat([function (err, data) {
        return err ? r.reject(err) : r.resolve(data);
      }]));
    });
  };
};

var nodebackToTask_1 = nodebackToTask;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var task$4 = task.task;

/*~
 * stability: experimental
 * type: |
 *   forall e, v, r:
 *     ((Any...) => Promise v e) => (Any...) => Task e v r
 */


var promisedToTask = function promisedToTask(aPromiseFn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return task$4(function (resolver) {
      aPromiseFn.apply(undefined, args).then(function (value) {
        return resolver.resolve(value);
      }, function (error) {
        return resolver.reject(error);
      });
    });
  };
};

var promisedToTask_1 = promisedToTask;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



/*~ 
 * stability: experimental 
 * name: module folktale/concurrency/task
 */
var task = {
  of: _task.of,
  rejected: _task.rejected,
  task: task_1,
  waitAny: waitAny_1,
  waitAll: waitAll_1,
  do: _do,
  _Task: _task,
  _TaskExecution: _taskExecution,

  /*~
   * stability: experimental
   * type: |
   *    forall s, e:
   *      ((Any..., (e, s) => Void) => Void)
   *      => (Any...)
   *      => Task e s
   */
  fromNodeback: function fromNodeback(aNodeback) {
    return nodebackToTask_1(aNodeback);
  },


  /*~
   * stability: experimental
   * type: |
   *   forall e, v:
   *     ((Any...) => Promise v e) => (Any...) => Task e v
   */
  fromPromised: function fromPromised(aPromiseFn) {
    return promisedToTask_1(aPromiseFn);
  }
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 * name: module folktale/concurrency
 */
var concurrency = {
  future: future,
  task: task
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var assertFunction = function (method, transformation) {
  if (typeof transformation !== 'function') {
    throw new TypeError(method + ' expects a function, but was given ' + transformation + '.');
  }
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



var defineAdtMethod = function defineAdtMethod(adt, definitions) {
  Object.keys(definitions).forEach(function (name) {
    var methods = definitions[name];
    adt.variants.forEach(function (variant) {
      var method = methods[variant.tag];
      if (!method) {
        throw new TypeError('Method ' + name + ' not defined for ' + variant.tag);
      }
      copyDocumentation_1(methods, method);
      variant.prototype[name] = method;
    });
  });
};

var defineAdtMethods = defineAdtMethod;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Error$3 = result.Error;
var Ok$2 = result.Ok;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Result b a
 */


var maybeToResult = function maybeToResult(aMaybe, failureValue) {
  return aMaybe.matchWith({
    Nothing: function Nothing() {
      return Error$3(failureValue);
    },
    Just: function Just(_ref) {
      var value = _ref.value;
      return Ok$2(value);
    }
  });
};

var maybeToResult_1 = maybeToResult;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Success$2 = validation.Success;
var Failure$2 = validation.Failure;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Validation b a
 */


var maybeToValidation = function maybeToValidation(aMaybe, failureValue) {
  return aMaybe.matchWith({
    Nothing: function Nothing() {
      return Failure$2(failureValue);
    },
    Just: function Just(_ref) {
      var value = _ref.value;
      return Success$2(value);
    }
  });
};

var maybeToValidation_1 = maybeToValidation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------




var union$6 = union.union;
var derivations$5 = union.derivations;






var equality$5 = derivations$5.equality;
var debugRepresentation$4 = derivations$5.debugRepresentation;
var serialization$3 = derivations$5.serialization;

/*~ stability: stable */

var Maybe = union$6('folktale:Maybe', {
  /*~
   * type: |
   *   forall a: () => Maybe a
   */
  Nothing: function Nothing() {},


  /*~
   * type: |
   *   forall a: (a) => Maybe a
   */
  Just: function Just(value) {
    return { value: value };
  }
}).derive(equality$5, debugRepresentation$4, serialization$3);

var Nothing$1 = Maybe.Nothing;
var _Just = Maybe.Just;

var assertMaybe = assertType$1(Maybe);

extend_1(_Just.prototype, {
  /*~
   * isRequired: true
   * type: |
   *   forall a: get (Maybe a) => a
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Maybe.Just');
  }
});

/*~~belongsTo: Maybe */
defineAdtMethods(Maybe, {
  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Maybe a).((a) => b) => Maybe b
   */
  map: {
    /*~*/
    Nothing: function map$$1(transformation) {
      assertFunction('Maybe.Nothing#map', transformation);
      return this;
    },

    /*~*/
    Just: function map$$1(transformation) {
      assertFunction('Maybe.Just#map', transformation);
      return _Just(transformation(this.value));
    }
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Maybe (a) => b).(Maybe a) => Maybe b
   */
  apply: {
    /*~*/
    Nothing: function apply(aMaybe) {
      assertMaybe('Maybe.Nothing#apply', aMaybe);
      return this;
    },

    /*~*/
    Just: function apply(aMaybe) {
      assertMaybe('Maybe.Just#apply', aMaybe);
      return aMaybe.map(this.value);
    }
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Maybe a).((a) => Maybe b) => Maybe b
   */
  chain: {
    /*~*/
    Nothing: function chain(transformation) {
      assertFunction('Maybe.Nothing#chain', transformation);
      return this;
    },

    /*~*/
    Just: function chain(transformation) {
      assertFunction('Maybe.Just#chain', transformation);
      return transformation(this.value);
    }
  },

  /*~
   * type: |
   *   forall a: (Maybe a).() => a :: (throws TypeError)
   */
  unsafeGet: {
    /*~*/
    Nothing: function unsafeGet() {
      throw new TypeError('Can\'t extract the value of a Nothing.\n\n    Since Nothing holds no values, it\'s not possible to extract one from them.\n    You might consider switching from Maybe#get to Maybe#getOrElse, or some other method\n    that is not partial.\n      ');
    },

    /*~*/
    Just: function unsafeGet() {
      return this.value;
    }
  },

  /*~
   * type: |
   *   forall a: (Maybe a).(a) => a
   */
  getOrElse: {
    /*~*/
    Nothing: function getOrElse(_default) {
      return _default;
    },

    /*~*/
    Just: function getOrElse(_default) {
      return this.value;
    }
  },

  /*~
   * type: |
   *   forall a: (Maybe a).((a) => Maybe a) => Maybe a
   */
  orElse: {
    /*~*/
    Nothing: function orElse(handler) {
      assertFunction('Maybe.Nothing#orElse', handler);
      return handler(this.value);
    },

    /*~*/
    Just: function orElse(handler) {
      assertFunction('Maybe.Nothing#orElse', handler);
      return this;
    }
  },

  /*~
   * authors:
   *   - "@diasbruno"
   * type: |
   *   forall a: (Maybe a).(Maybe a) => Maybe a
   *   where a is Semigroup
   */
  concat: {
    /*~*/
    Nothing: function concat$$1(aMaybe) {
      assertMaybe('Maybe.Nothing#concat', aMaybe);
      return aMaybe;
    },

    /*~*/
    Just: function concat$$1(aMaybe) {
      var _this = this;

      assertMaybe('Maybe.Just#concat', aMaybe);
      return aMaybe.matchWith({
        Nothing: function Nothing() {
          return _Just(_this.value);
        },
        Just: function Just(a) {
          return _Just(_this.value.concat(a.value));
        }
      });
    }
  },

  /*~
   * deprecated:
   *   since: 2.0.0
   *   replacedBy: .matchWith(pattern)
   * 
   * type: |
   *   forall a, b:
   *     (Maybe a).({
   *       Nothing: () => b,
   *       Just: (a) => b
   *     }) => b
   */
  cata: {
    /*~*/
    Nothing: function cata(pattern) {
      warnDeprecation_1('`.cata(pattern)` is deprecated. Use `.matchWith(pattern)` instead.');
      return pattern.Nothing();
    },

    /*~*/
    Just: function cata(pattern) {
      warnDeprecation_1('`.cata(pattern)` is deprecated. Use `.matchWith(pattern)` instead.');
      return pattern.Just(this.value);
    }
  },

  /*~
   * type: |
   *   forall a, b: (Maybe a).(() => b, (a) => b) => b
   */
  fold: {
    /*~*/
    Nothing: function Nothing(transformNothing, transformJust) {
      assertFunction('Maybe.Nothing#fold', transformNothing);
      assertFunction('Maybe.Nothing#fold', transformJust);
      return transformNothing();
    },

    /*~*/
    Just: function Just(transformNothing, transformJust) {
      assertFunction('Maybe.Just#fold', transformNothing);
      assertFunction('Maybe.Just#fold', transformJust);
      return transformJust(this.value);
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a: (Maybe a).((a) => Boolean) => Maybe a
   */
  filter: {
    /*~*/
    Nothing: function filter$$1(predicate) {
      assertFunction('Maybe.Nothing#filter', predicate);
      return this;
    },

    /*~*/
    Just: function filter$$1(predicate) {
      assertFunction('Maybe.Just#filter', predicate);
      return predicate(this.value) ? this : Nothing$1();
    }
  }
});

Object.assign(Maybe, {
  /*~
   * stability: stable
   * type: |
   *   forall a: (a) => Maybe a
   */
  of: function of$$1(value) {
    return _Just(value);
  },


  /*~
   * authors:
   *   - "@diasbruno"
   * type: |
   *   forall a: () => Maybe a
   */
  empty: function empty$$1() {
    return Nothing$1();
  },


  /*~
   * deprecated:
   *   since: 2.0.0
   *   replacedBy: .unsafeGet()
   * type: |
   *   forall a: (Maybe a).() => a :: (throws TypeError)
   */
  'get': function get() {
    warnDeprecation_1('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Maybe a).(b) => Result b a
   */
  toResult: function toResult(fallbackValue) {
    return maybeToResult_1(this, fallbackValue);
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Maybe a).(b) => Result b a
   */
  toValidation: function toValidation(fallbackValue) {
    return maybeToValidation_1(this, fallbackValue);
  }
});

provideFantasyLandAliases(_Just.prototype);
provideFantasyLandAliases(Nothing$1.prototype);
provideFantasyLandAliases(Maybe);

var maybe = Maybe;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Just = maybe.Just;
var Nothing = maybe.Nothing;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *
 * type: |
 *   forall a, b:
 *     (Result a b) => Maybe b
 */


var resultToMaybe = function resultToMaybe(aResult) {
  return aResult.matchWith({
    Error: function Error(_ref) {
      var _ = _ref.value;
      return Nothing();
    },
    Ok: function Ok(_ref2) {
      var value = _ref2.value;
      return Just(value);
    }
  });
};

var resultToMaybe_1 = resultToMaybe;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------




var union$5 = union.union;
var derivations$4 = union.derivations;






var equality$4 = derivations$4.equality;
var debugRepresentation$3 = derivations$4.debugRepresentation;
var serialization$2 = derivations$4.serialization;

/*~ stability: experimental */

var Result = union$5('folktale:Result', {
  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (a) => Result a b
   */
  Error: function Error(value) {
    return { value: value };
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Result a b
   */
  Ok: function Ok(value) {
    return { value: value };
  }
}).derive(equality$4, debugRepresentation$3, serialization$2);

var Error$2 = Result.Error;
var Ok$1 = Result.Ok;


var assertResult = assertType$1(Result);

extend_1(Error$2.prototype, {
  /*~
   * isRequired: true
   * type: |
   *   forall a, b: get (Result a b) => a
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Result.Error');
  }
});

extend_1(Ok$1.prototype, {
  /*~
   * isRequired: true
   * type: |
   *   forall a, b: get (Result a b) => b
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Result.Ok');
  }
});

/*~
 * ~belongsTo: Result
 */
defineAdtMethods(Result, {
  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((b) => c) => Result a c
   */
  map: {
    /*~*/
    Error: function map$$1(f) {
      assertFunction('Result.Error#map', f);
      return this;
    },

    /*~*/
    Ok: function map$$1(f) {
      assertFunction('Result.Ok#map', f);
      return Ok$1(f(this.value));
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a ((b) => c)).(Result a b) => Result a c
   */
  apply: {
    /*~*/
    Error: function apply(anResult) {
      assertResult('Result.Error#apply', anResult);
      return this;
    },

    /*~*/
    Ok: function apply(anResult) {
      assertResult('Result.Ok#apply', anResult);
      return anResult.map(this.value);
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((b) => Result a c) => Result a c
   */
  chain: {
    /*~*/
    Error: function chain(f) {
      assertFunction('Result.Error#chain', f);
      return this;
    },

    /*~*/
    Ok: function chain(f) {
      assertFunction('Result.Ok#chain', f);
      return f(this.value);
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => b :: throws TypeError
   */
  unsafeGet: {
    /*~*/
    Error: function unsafeGet() {
      throw new TypeError('Can\'t extract the value of an Error.\n\nError does not contain a normal value - it contains an error.\nYou might consider switching from Result#unsafeGet to Result#getOrElse,\nor some other method that is not partial.\n      ');
    },

    /*~*/
    Ok: function unsafeGet() {
      return this.value;
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).(b) => b
   */
  getOrElse: {
    /*~*/
    Error: function getOrElse(_default) {
      return _default;
    },

    /*~*/
    Ok: function getOrElse(_default) {
      return this.value;
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => Result c b) => Result c b
   */
  orElse: {
    /*~*/
    Error: function orElse(handler) {
      assertFunction('Result.Error#orElse', handler);
      return handler(this.value);
    },

    /*~*/
    Ok: function orElse(handler) {
      assertFunction('Result.Ok#orElse', handler);
      return this;
    }
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Result a b).(Result a b) => Result a b
   *   where b is Semigroup
   */
  concat: {
    /*~*/
    Error: function concat$$1(aResult) {
      assertResult('Result.Error#concat', aResult);
      return this;
    },

    /*~*/
    Ok: function concat$$1(aResult) {
      var _this = this;

      assertResult('Result.Ok#concat', aResult);
      return aResult.map(function (xs) {
        return _this.value.concat(xs);
      });
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => c, (b) => c) => c
   */
  fold: {
    /*~*/
    Error: function fold(f, g) {
      assertFunction('Result.Error#fold', f);
      assertFunction('Result.Error#fold', g);
      return f(this.value);
    },

    /*~*/
    Ok: function fold(f, g) {
      assertFunction('Result.Ok#fold', f);
      assertFunction('Result.Ok#fold', g);
      return g(this.value);
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => Result b a
   */
  swap: {
    /*~*/
    Error: function swap() {
      return Ok$1(this.value);
    },

    /*~*/
    Ok: function swap() {
      return Error$2(this.value);
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   (Result a b).((a) => c, (b) => d) => Result c d
   */
  bimap: {
    /*~*/
    Error: function bimap(f, g) {
      assertFunction('Result.Error#bimap', f);
      assertFunction('Result.Error#bimap', g);
      return Error$2(f(this.value));
    },

    /*~*/
    Ok: function bimap(f, g) {
      assertFunction('Result.Ok#bimap', f);
      assertFunction('Result.Ok#bimap', g);
      return Ok$1(g(this.value));
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => c) => Result c b
   */
  mapError: {
    /*~*/
    Error: function mapError(f) {
      assertFunction('Result.Error#mapError', f);
      return Error$2(f(this.value));
    },

    /*~*/
    Ok: function mapError(f) {
      assertFunction('Result.Ok#mapError', f);
      return this;
    }
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a: (Maybe a).((a) => Boolean) => Maybe a
   */
  filter: {
    /*~*/
    Error: function filter$$1(predicate) {
      assertFunction('Result.Error#filter', predicate);
      return this;
    },

    /*~*/
    Ok: function filter$$1(predicate) {
      assertFunction('Result.Ok#filter', predicate);
      return predicate(this.value) ? this : Error$2();
    }
  }
});

Object.assign(Result, {
  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Result a b
   */
  of: function of$$1(value) {
    return Ok$1(value);
  },


  /*~
   * deprecated:
   *   since: 2.0.0
   *   replacedBy: .unsafeGet()
   * type: |
   *   forall a, b: (Result a b).() => b :: (throws TypeError)
   */
  'get': function get() {
    warnDeprecation_1('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => a or b
   */
  merge: function merge$$1() {
    return this.value;
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => Validation a b
   */
  toValidation: function toValidation() {
    return resultToValidation_1(this);
  },


  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => Maybe b
   */
  toMaybe: function toMaybe() {
    return resultToMaybe_1(this);
  }
});

provideFantasyLandAliases(Error$2.prototype);
provideFantasyLandAliases(Ok$1.prototype);
provideFantasyLandAliases(Result);

var result = Result;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Error$1 = result.Error;
var Ok = result.Ok;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *      (Validation a b) => Result a b
 */


var validationToResult = function validationToResult(aValidation) {
  return aValidation.matchWith({
    Failure: function Failure(_ref) {
      var value = _ref.value;
      return Error$1(value);
    },
    Success: function Success(_ref2) {
      var value = _ref2.value;
      return Ok(value);
    }
  });
};

var validationToResult_1 = validationToResult;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Just$1 = maybe.Just;
var Nothing$2 = maybe.Nothing;

/*~
 * stability: stable
 * authors: 
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Validation a b) => Maybe b
 */


var validationToMaybe = function validationToMaybe(aValidation) {
  return aValidation.matchWith({
    Failure: function Failure() {
      return Nothing$2();
    },
    Success: function Success(_ref) {
      var value = _ref.value;
      return Just$1(value);
    }
  });
};

var validationToMaybe_1 = validationToMaybe;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------




var union$4 = union.union;
var derivations$3 = union.derivations;






var equality$3 = derivations$3.equality;
var debugRepresentation$2 = derivations$3.debugRepresentation;
var serialization$1 = derivations$3.serialization;

/*~ stability: experimental */

var Validation = union$4('folktale:Validation', {
  /*~
   * type: |
   *   forall a, b: (a) => Validation a b
   */
  Failure: function Failure(value) {
    return { value: value };
  },


  /*~
   * type: |
   *   forall a, b: (b) => Validation a b
   */
  Success: function Success(value) {
    return { value: value };
  }
}).derive(equality$3, debugRepresentation$2, serialization$1);

var Success$1 = Validation.Success;
var Failure$1 = Validation.Failure;

var assertValidation = assertType$1(Validation);

extend_1(Failure$1.prototype, {
  /*~
   * isRequired: true
   * type: |
   *   forall a, b: get (Validation a b) => a
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Validation.Failure');
  }
});

extend_1(Success$1.prototype, {
  /*~
   * isRequired: true
   * type: |
   *   forall a, b: get (Validation a b) => b
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Validation.Success');
  }
});

/*~~belongsTo: Validation */
defineAdtMethods(Validation, {
  /*~
   * type: |
   *   forall a, b, c: (Validation a b).((b) => c) => Validation a c
   */
  map: {
    /*~*/
    Failure: function map$$1(transformation) {
      assertFunction('Validation.Failure#map', transformation);
      return this;
    },

    /*~*/
    Success: function map$$1(transformation) {
      assertFunction('Validation.Success#map', transformation);
      return Success$1(transformation(this.value));
    }
  },

  /*~
   * type: |
   *   forall a, b, c: (Validation (b) => c).(Validation a b) => Validation a c
   */
  apply: {
    /*~*/
    Failure: function apply(aValidation) {
      assertValidation('Failure#apply', aValidation);
      return Failure$1.hasInstance(aValidation) ? Failure$1(this.value.concat(aValidation.value)) : /* otherwise */this;
    },

    /*~*/
    Success: function apply(aValidation) {
      assertValidation('Success#apply', aValidation);
      return Failure$1.hasInstance(aValidation) ? aValidation : /* otherwise */aValidation.map(this.value);
    }
  },

  /*~
   * type: |
   *   forall a, b: (Validation a b).() => b :: throws TypeError
   */
  unsafeGet: {
    /*~*/
    Failure: function unsafeGet() {
      throw new TypeError('Can\'t extract the value of a Failure.\n\n    Failure does not contain a normal value - it contains an error.\n    You might consider switching from Validation#get to Validation#getOrElse, or some other method\n    that is not partial.\n      ');
    },

    /*~*/
    Success: function unsafeGet() {
      return this.value;
    }
  },

  /*~
   * type: |
   *   forall a, b: (Validation a b).(b) => b
   */
  getOrElse: {
    /*~*/
    Failure: function getOrElse(_default) {
      return _default;
    },

    /*~*/
    Success: function getOrElse(_default) {
      return this.value;
    }
  },

  /*~
   * type: |
   *   forall a, b, c:
   *     (Validation a b).((a) => Validation c b) => Validation c b
   */
  orElse: {
    /*~*/
    Failure: function orElse(handler) {
      assertFunction('Validation.Failure#orElse', handler);
      return handler(this.value);
    },

    /*~*/
    Success: function orElse(handler) {
      assertFunction('Validation.Success#orElse', handler);
      return this;
    }
  },

  /*~
   * type: |
   *   forall a, b:
   *     (Validation a b).(Validation a b) => Validation a b
   *   where a is Semigroup
   */
  concat: {
    /*~*/
    Failure: function concat$$1(aValidation) {
      assertValidation('Validation.Failure#concat', aValidation);
      if (Failure$1.hasInstance(aValidation)) {
        return Failure$1(this.value.concat(aValidation.value));
      } else {
        return this;
      }
    },

    /*~*/
    Success: function concat$$1(aValidation) {
      assertValidation('Validation.Success#concat', aValidation);
      return aValidation;
    }
  },

  /*~
   * type: |
   *   forall a, b, c:
   *     (Validation a b).((a) => c, (b) => c) => c
   */
  fold: {
    /*~*/
    Failure: function fold(failureTransformation, successTransformation) {
      assertFunction('Validation.Failure#fold', failureTransformation);
      assertFunction('Validation.Failure#fold', successTransformation);
      return failureTransformation(this.value);
    },

    /*~*/
    Success: function fold(failureTransformation, successTransformation) {
      assertFunction('Validation.Success#fold', failureTransformation);
      assertFunction('Validation.Success#fold', successTransformation);
      return successTransformation(this.value);
    }
  },

  /*~
   * type: |
   *   forall a, b: (Validation a b).() => Validation b a
   */
  swap: {
    /*~*/
    Failure: function swap() {
      return Success$1(this.value);
    },

    /*~*/
    Success: function swap() {
      return Failure$1(this.value);
    }
  },

  /*~
   * type: |
   *   forall a, b, c, d:
   *     (Validation a b).((a) => c, (b) => d) => Validation c d
   */
  bimap: {
    /*~*/
    Failure: function bimap(failureTransformation, successTransformation) {
      assertFunction('Validation.Failure#fold', failureTransformation);
      assertFunction('Validation.Failure#fold', successTransformation);
      return Failure$1(failureTransformation(this.value));
    },

    /*~*/
    Success: function bimap(failureTransformation, successTransformation) {
      assertFunction('Validation.Success#fold', failureTransformation);
      assertFunction('Validation.Success#fold', successTransformation);
      return Success$1(successTransformation(this.value));
    }
  },

  /*~
   * type: |
   *   forall a, b, c:
   *     (Validation a b).((a) => c) Validation c b
   */
  mapFailure: {
    /*~*/
    Failure: function mapFailure(transformation) {
      assertFunction('Validation.Failure#mapFailure', transformation);
      return Failure$1(transformation(this.value));
    },

    /*~*/
    Success: function mapFailure(transformation) {
      assertFunction('Validation.Failure#mapFailure', transformation);
      return this;
    }
  }
});

Object.assign(Validation, {
  /*~
   * type: |
   *   forall a, b: (b) => Validation a b
   */
  of: function of$$1(value) {
    return Success$1(value);
  },


  /*~
   * type: |
   *   forall a, b: (Validation a b).() => b :: throws TypeError
   */
  'get': function get() {
    warnDeprecation_1('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },


  /*~
   * type: |
   *   forall a, b: (Validation a b).() => a or b
   */
  merge: function merge$$1() {
    return this.value;
  },


  /*~
   * type: |
   *   forall a, b: (Validation a b).() => Result a b
   */
  toResult: function toResult() {
    return validationToResult_1(this);
  },


  /*~
   * type: |
   *   forall a, b: (Validation a b).() => Maybe b
   */
  toMaybe: function toMaybe() {
    return validationToMaybe_1(this);
  }
});

provideFantasyLandAliases(Success$1.prototype);
provideFantasyLandAliases(Failure$1.prototype);
provideFantasyLandAliases(Validation);

var validation = Validation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Success = validation.Success;
var Failure = validation.Failure;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Result a b) => Validation a b
 */


var resultToValidation = function resultToValidation(aResult) {
  return aResult.matchWith({
    Error: function Error(_ref) {
      var value = _ref.value;
      return Failure(value);
    },
    Ok: function Ok(_ref2) {
      var value = _ref2.value;
      return Success(value);
    }
  });
};

var resultToValidation_1 = resultToValidation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Success$3 = validation.Success;
var Failure$3 = validation.Failure;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (a or None, b) => Validation b a
 */


var nullableToValidation = function nullableToValidation(a, fallbackValue) {
  return a != null ? Success$3(a) : /*else*/Failure$3(fallbackValue);
};

var nullableToValidation_1 = nullableToValidation;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Error$4 = result.Error;
var Ok$3 = result.Ok;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a:
 *     (a or None) => Result None a
 */


var nullableToResult = function nullableToResult(a) {
  return a != null ? Ok$3(a) : /*else*/Error$4(a);
};

var nullableToResult_1 = nullableToResult;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Nothing$3 = maybe.Nothing;
var Just$2 = maybe.Just;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall a:
 *     (a or None) => Maybe a
 */


var nullableToMaybe = function nullableToMaybe(a) {
  return a != null ? Just$2(a) : /*else*/Nothing$3();
};

var nullableToMaybe_1 = nullableToMaybe;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * name: module folktale/conversions
 */
var conversions = {
  resultToValidation: resultToValidation_1,
  resultToMaybe: resultToMaybe_1,
  validationToResult: validationToResult_1,
  validationToMaybe: validationToMaybe_1,
  maybeToValidation: maybeToValidation_1,
  maybeToResult: maybeToResult_1,
  nullableToValidation: nullableToValidation_1,
  nullableToResult: nullableToResult_1,
  nullableToMaybe: nullableToMaybe_1,
  nodebackToTask: nodebackToTask_1,
  futureToPromise: futureToPromise_1,
  promiseToFuture: promiseToFuture_1,
  promisedToTask: promisedToTask_1
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => 'a
 */
var identity$1 = function identity$$1(value) {
  return value;
};

// --[ Exports ]-------------------------------------------------------
var identity_1 = identity$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => ('b) => 'a
 */
var constant = function constant(value) {
  return function (_) {
    return value;
  };
};

// --[ Exports ]-------------------------------------------------------
var constant_1 = constant;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * signature: compose(f, g)(value)
 * type: |
 *   (('b) => 'c, ('a) => 'b) => (('a) => 'c)
 */
var compose$1 = function compose$$1(f, g) {
  return function (value) {
    return f(g(value));
  };
};

// --[ Convenience ]---------------------------------------------------

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (('b) => 'c) . (('a) => 'b) => (('a) => 'c)
 */
compose$1.infix = function (that) {
  return compose$1(that, this);
};

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Function...) -> Function
 */
compose$1.all = function () {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  /* eslint-disable no-magic-numbers */
  if (fns.length < 1) {
    // eslint-disable-next-line prefer-rest-params
    throw new TypeError("compose.all requires at least one argument, " + arguments.length + " given.");
  }
  return fns.reduce(compose$1);
}; /* eslint-enable no-magic-numbers */

// --[ Exports ]-------------------------------------------------------
var compose_1 = compose$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var hole = {};

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Number, (Any... => Any)) => ((hole | Any)...) => Any :: (throw TypeError)
 */
var partialize = function partialize(arity, fn) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    //  eslint-disable-line max-statements
    /* eslint-disable no-magic-numbers */
    if (args.length < arity) {
      throw new TypeError("The partial function takes at least " + arity + " arguments, but was given " + args.length + ".");
    }

    // Figure out if we have holes
    var holes = 0;
    for (var i = 0; i < args.length; ++i) {
      if (args[i] === hole) {
        holes += 1;
      }
    }

    if (holes > 0) {
      return partialize(holes, function () {
        // eslint-disable-line max-statements
        var realArgs = []; // eslint-disable-line prefer-const
        var argIndex = 0;

        for (var _i = 0; _i < args.length; ++_i) {
          var arg = args[_i];
          if (arg === hole) {
            realArgs.push(arguments.length <= argIndex ? undefined : arguments[argIndex]);
            argIndex += 1;
          } else {
            realArgs.push(arg);
          }
        }

        return fn.apply(undefined, realArgs);
      });
    } else {
      return fn.apply(undefined, args);
    }
  };
}; /* eslint-enable no-magic-numbers */

// ---[ Special Values ]-----------------------------------------------
/*~ stability: experimental */
partialize.hole = hole;

// --[ Exports ]-------------------------------------------------------
var partialize_1 = partialize;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * name: module folktale/core/lambda
 */
var lambda = {
  identity: identity_1,
  constant: constant_1,
  curry: curry_1,
  compose: compose_1,
  partialize: partialize_1
};

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var hasOwnProperty = Object.prototype.hasOwnProperty;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (
 *     object    : Object 'a,
 *     transform : ((String, 'a)) => (String, 'b),
 *     define    : (('x : Object 'b), String, 'b) => Object 'b :: mutates 'x
 *   ) => Object 'b
 */
var mapEntries = function mapEntries(object, transform, define) {
  return Object.keys(object).reduce(function (result, key) {
    var _transform = transform([key, object[key]]),
        _transform2 = _slicedToArray$1(_transform, 2),
        newKey = _transform2[0],
        newValue = _transform2[1];

    return define(result, newKey, newValue);
  }, {});
};

// --[ Convenience ]---------------------------------------------------
/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b
 */
mapEntries.overwrite = function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    result[key] = value;
    return result;
  });
};

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * throws:
 *   Error: when the transform returns duplicate property names.
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b :: throws Error
 */
mapEntries.unique = function (object, transform) {
  return mapEntries(object, transform, function (result, key, value) {
    if (hasOwnProperty.call(result, key)) {
      throw new Error("The property " + key + " already exists in the resulting object.");
    }
    result[key] = value;
    return result;
  });
};

// --[ Exports ]-------------------------------------------------------
var mapEntries_1 = mapEntries;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a) => Array (String or Symbol, 'a)
 */
var toPairs$1 = function toPairs$$1(object) {
  return Object.keys(object).map(function (k) {
    return [k, object[k]];
  });
};

// --[ Exports ]-------------------------------------------------------
var toPairs_1 = toPairs$1;

var _slicedToArray$2 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var define$2 = Object.defineProperty;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the length of the array
 * type: |
 *   (Array (String or Symbol, 'a)) => Object 'a
 */
var fromPairs$1 = function fromPairs$$1(pairs) {
  return pairs.reduce(function (r, _ref) {
    var _ref2 = _slicedToArray$2(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

    return define$2(r, k, { value: v,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }, {});
};

// --[ Exports ]-------------------------------------------------------
var fromPairs_1 = fromPairs$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * name: module folktale/core/object
 */
var object = {
  mapEntries: mapEntries_1,
  mapValues: mapValues_1,
  values: values_1,
  toPairs: toPairs_1,
  fromPairs: fromPairs_1
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: stable
 * name: module folktale/core
 */
var core = {
  lambda: lambda,
  object: object
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var ap$1 = fantasyLand.ap;


var warn$1 = warnDeprecatedMethod('ap');
var unsupported$1 = unsupportedMethod('ap');

var isNew$1 = function isNew(a) {
  return typeof a[ap$1] === 'function';
};
var isOld$1 = function isOld(a) {
  return typeof a.ap === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b, F a) => F b
 *   where F is Apply
 */
var apply = function apply(applicativeFunction, applicativeValue) {
  return isNew$1(applicativeValue) ? applicativeValue[ap$1](applicativeFunction) : isOld$1(applicativeFunction) ? warn$1(applicativeFunction.ap(applicativeValue)) : /*otherwise*/unsupported$1(applicativeFunction);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b) => (F a) => F b
 *   where F is Apply
 */
apply.curried = curry_1(2, apply); // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b).(F a) => F b
 *   where F is Apply
 */
apply.infix = function (applicativeValue) {
  return apply(this, applicativeValue);
};

var apply_1 = apply;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flConcat = fantasyLand.concat;


var warn$2 = warnDeprecatedMethod('concat');
var unsupported$2 = unsupportedMethod('concat');

var isNewSemigroup = function isNewSemigroup(a) {
  return typeof a[flConcat] === 'function';
};
var isOldSemigroup = function isOldSemigroup(a) {
  return typeof a.concat === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => S a
 *   where S is Semigroup
 */
var concat$1 = function concat$$1(semigroupLeft, semigroupRight) {
  return isNewSemigroup(semigroupLeft) ? semigroupLeft[flConcat](semigroupRight) : isOldSemigroup(semigroupLeft) ? warn$2(semigroupLeft.concat(semigroupRight)) : /*otherwise*/unsupported$2(semigroupLeft);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a) => (S a) => S a
 *   where S is Semigroup
 */
concat$1.curried = curry_1(2, function (semigroupRight, semigroupLeft) {
  return (// eslint-disable-line no-magic-numbers
    concat$1(semigroupLeft, semigroupRight)
  );
});

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a).(S a) => S a
 *   where S is Semigroup
 */
concat$1.infix = function (aSemigroup) {
  return concat$1(this, aSemigroup);
};

var concat_1 = concat$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flChain = fantasyLand.chain;


var warn$3 = warnDeprecatedMethod('chain');
var unsupported$3 = unsupportedMethod('chain');

var isNew$2 = function isNew(a) {
  return typeof a[flChain] === 'function';
};
var isOld$2 = function isOld(a) {
  return typeof a.chain === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     (C a, (a) => C b) => C b
 *   where C is Chain
 */
var chain = function chain(monad, transformation) {
  return isNew$2(monad) ? monad[flChain](transformation) : isOld$2(monad) ? warn$3(monad.chain(transformation)) : /*otherwise*/unsupported$3(monad);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     ((a) => C b) => (C a) => C b
 *   where C is Chain
 */
chain.curried = curry_1(2, function (transformation, monad) {
  return (// eslint-disable-line no-magic-numbers
    chain(monad, transformation)
  );
});

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     (C a).((a) => C b) => C b
 *   where C is Chain
 */
chain.infix = function (transformation) {
  return chain(this, transformation);
};

var chain_1 = chain;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flEmpty = fantasyLand.empty;


var warn$4 = warnDeprecatedMethod('empty');
var unsupported$4 = unsupportedMethod('empty');

var isNew$3 = function isNew(a) {
  return typeof a[flEmpty] === 'function';
};
var isCtorNew = function isCtorNew(a) {
  return typeof a.constructor[flEmpty] === 'function';
};
var isOld$3 = function isOld(a) {
  return typeof a.empty === 'function';
};
var isCtorOld = function isCtorOld(a) {
  return typeof a.constructor.empty === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M) => M a
 *   where M is Monoid 
 */
var empty$1 = function empty$$1(monoid) {
  return isNew$3(monoid) ? monoid[flEmpty]() : isCtorNew(monoid) ? monoid.constructor[flEmpty]() : isOld$3(monoid) ? warn$4(monoid.empty()) : isCtorOld(monoid) ? warn$4(monoid.constructor.empty()) : /*otherwise*/unsupported$4(monoid);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M) => M a
 *   where M is Monoid 
 */
empty$1.curried = curry_1(1, empty$1); // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M).() => M a
 *   where M is Monoid 
 */
empty$1.infix = function () {
  return empty$1(this);
};

var empty_1 = empty$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flMap = fantasyLand.map;


var warn$5 = warnDeprecatedMethod('map');
var unsupported$5 = unsupportedMethod('map');

var isNew$4 = function isNew(a) {
  return typeof a[flMap] === 'function';
};
var isOld$4 = function isOld(a) {
  return typeof a.map === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F a, (a) => b) => F b
 *   where F is Functor
 */
var map$1 = function map$$1(functor, transformation) {
  return isNew$4(functor) ? functor[flMap](transformation) : isOld$4(functor) ? warn$5(functor.map(transformation)) : /*otherwise*/unsupported$5(functor);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     ((a) => b) => (F a) => F b
 *   where F is Functor
 */
map$1.curried = curry_1(2, function (transformation, functor) {
  return (// eslint-disable-line no-magic-numbers
    map$1(functor, transformation)
  );
});

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F a).((a) => b) => F b
 *   where F is Functor
 */
map$1.infix = function (transformation) {
  return map$1(this, transformation);
};

var map_1 = map$1;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flOf = fantasyLand.of;


var warn$6 = warnDeprecatedMethod('of');
var unsupported$6 = unsupportedMethod('of');

var isNew$5 = function isNew(a) {
  return typeof a[flOf] === 'function';
};
var isCtorNew$1 = function isCtorNew(a) {
  return typeof a.constructor[flOf] === 'function';
};
var isOld$5 = function isOld(a) {
  return typeof a.of === 'function';
};
var isCtorOld$1 = function isCtorOld(a) {
  return typeof a.constructor.of === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F, a) => F a
 *   where F is Applicative
 */
var of$2 = function of$$1(applicative, value) {
  return isNew$5(applicative) ? applicative[flOf](value) : isCtorNew$1(applicative) ? applicative.constructor[flOf](value) : isOld$5(applicative) ? warn$6(applicative.of(value)) : isCtorOld$1(applicative) ? warn$6(applicative.constructor.of(value)) : /*otherwise*/unsupported$6(applicative);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F) => (a) => F a
 *   where F is Applicative
 */
of$2.curried = curry_1(2, of$2); // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F).(a) => F a
 *   where F is Applicative
 */
of$2.infix = function (value) {
  return of$2(this, value);
};

var of_1 = of$2;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var flBimap = fantasyLand.bimap;


var warn$7 = warnDeprecatedMethod('bimap');
var unsupported$7 = unsupportedMethod('bimap');

var isNew$6 = function isNew(a) {
  return typeof a[flBimap] === 'function';
};
var isOld$6 = function isOld(a) {
  return typeof a.bimap === 'function';
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     (F a b, (a) => c, (b) => d) => F c d
 *   where F is Bifunctor
 */
var bimap = function bimap(bifunctor, transformLeft, transformRight) {
  return isNew$6(bifunctor) ? bifunctor[flBimap](transformLeft, transformRight) : isOld$6(bifunctor) ? warn$7(bifunctor.bimap(transformLeft, transformRight)) : /*otherwise*/unsupported$7(bifunctor);
};

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     ((a) => c) => ((b) => d) => (F a b) => F c d
 *   where F is Bifunctor
 */
bimap.curried = curry_1(3, function (transformLeft, transformRight, bifunctor) {
  return (// eslint-disable-line no-magic-numbers
    bimap(bifunctor, transformLeft, transformRight)
  );
});

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     (F a b).((a) => c, (b) => d) => F c d
 *   where F is Bifunctor
 */
bimap.infix = function (transformLeft, transformRight) {
  return bimap(this, transformLeft, transformRight);
};

var bimap_1 = bimap;

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 * name: module folktale/fantasy-land/curried
 */
var curried = {
  apply: apply_1.curried,
  bimap: bimap_1.curried,
  chain: chain_1.curried,
  concat: concat_1.curried,
  empty: empty_1.curried,
  equals: equals_1.curried,
  map: map_1.curried,
  of: of_1.curried
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 * name: module folktale/fantasy-land/infix
 */
var infix = {
  apply: apply_1.infix,
  bimap: bimap_1.infix,
  chain: chain_1.infix,
  concat: concat_1.infix,
  empty: empty_1.infix,
  equals: equals_1.infix,
  map: map_1.infix,
  of: of_1.infix
};

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * name: module folktale/fantasy-land
 */
var fantasyLand$2 = {
  apply: apply_1,
  concat: concat_1,
  chain: chain_1,
  empty: empty_1,
  map: map_1,
  of: of_1,
  equals: equals_1,
  bimap: bimap_1,
  curried: curried,
  infix: infix
};

var _module$exports;

function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------




var typeSymbol$4 = union_1.typeSymbol;

/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * name: module folktale/maybe
 */


var maybe$2 = (_module$exports = {
  Just: maybe.Just,
  Nothing: maybe.Nothing,
  hasInstance: maybe.hasInstance,
  of: maybe.of,
  empty: maybe.empty,
  fromJSON: maybe.fromJSON
}, _defineProperty$3(_module$exports, typeSymbol$4, maybe[typeSymbol$4]), _defineProperty$3(_module$exports, 'fantasy-land/of', maybe['fantasy-land/of']), _defineProperty$3(_module$exports, 'fromNullable', function fromNullable(aNullable) {
  return nullableToMaybe_1(aNullable);
}), _defineProperty$3(_module$exports, 'fromResult', function fromResult(aResult) {
  return resultToMaybe_1(aResult);
}), _defineProperty$3(_module$exports, 'fromValidation', function fromValidation(aValidation) {
  return validationToMaybe_1(aValidation);
}), _module$exports);

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Error$5 = result.Error;
var Ok$4 = result.Ok;

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b: (() => b :: throws a) => Result a b
 */


var _try = function _try(f) {
  try {
    return Ok$4(f());
  } catch (e) {
    return Error$5(e);
  }
};

var _try_1 = _try;

var _module$exports$1;

function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



var typeSymbol$5 = union_1.typeSymbol;

/*~
 * stability: stable
 * name: module folktale/result
 */


var result$2 = (_module$exports$1 = {
  Error: result.Error,
  Ok: result.Ok,
  hasInstance: result.hasInstance,
  of: result.of,
  fromJSON: result.fromJSON
}, _defineProperty$4(_module$exports$1, typeSymbol$5, result[typeSymbol$5]), _defineProperty$4(_module$exports$1, 'try', _try_1), _defineProperty$4(_module$exports$1, 'fromNullable', function fromNullable(aNullable) {
  return nullableToResult_1(aNullable);
}), _defineProperty$4(_module$exports$1, 'fromValidation', function fromValidation(aValidation) {
  return validationToResult_1(aValidation);
}), _defineProperty$4(_module$exports$1, 'fromMaybe', function fromMaybe(aMaybe, failureValue) {
  return maybeToResult_1(aMaybe, failureValue);
}), _module$exports$1);

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


var Success$4 = validation.Success;

/*~
 * stability: experimental
 * type: |
 *   forall a, b: (Array (Validation a b)) => Validation a b
 *   where a is Semigroup
 */


var collect = function collect(validations) {
  return validations.reduce(function (a, b) {
    return a.concat(b);
  }, Success$4());
};

var collect_1 = collect;

var _module$exports$2;

function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------



var typeSymbol$6 = union_1.typeSymbol;

/*~ 
 * stability: stable
 * name: module folktale/validation
 */


var validation$2 = (_module$exports$2 = {
  Success: validation.Success,
  Failure: validation.Failure,
  hasInstance: validation.hasInstance,
  of: validation.of,
  fromJSON: validation.fromJSON
}, _defineProperty$5(_module$exports$2, typeSymbol$6, validation[typeSymbol$6]), _defineProperty$5(_module$exports$2, 'collect', collect_1), _defineProperty$5(_module$exports$2, 'fromNullable', function fromNullable(aNullable, fallbackValue) {
  return nullableToValidation_1(aNullable, fallbackValue);
}), _defineProperty$5(_module$exports$2, 'fromResult', function fromResult(aResult) {
  return resultToValidation_1(aResult);
}), _defineProperty$5(_module$exports$2, 'fromMaybe', function fromMaybe(aMaybe, fallbackValue) {
  return maybeToValidation_1(aMaybe, fallbackValue);
}), _module$exports$2);

//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~ 
 * stability: stable
 * name: module folktale
 */
var folktale = {
  adt: adt,
  concurrency: concurrency,
  conversions: conversions,
  core: core,
  fantasyLand: fantasyLand$2,
  maybe: maybe$2,
  result: result$2,
  validation: validation$2
};

var folktale_1 = folktale.validation;

var utils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propValue = exports.loggingValidator = exports.logToConsole = exports.reduceObjIndexed = exports.iReduce = exports.freeze = exports.quoteAndJoinWithComma = exports.wrapSB = exports.quote = exports.joinWithColon = exports.joinWithOr = exports.joinWithAnd = exports.joinWithComma = undefined;





var Success = folktale.validation.Success;

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

var joinWithComma = exports.joinWithComma = (0, _ramda__default.join)(', ');
var joinWithAnd = exports.joinWithAnd = (0, _ramda__default.join)(' and ');
var joinWithOr = exports.joinWithOr = (0, _ramda__default.join)(' or ');
var joinWithColon = exports.joinWithColon = (0, _ramda__default.join)(': ');
var quote = exports.quote = function quote(value) {
  return '\'' + value + '\'';
};
var wrapSB = exports.wrapSB = function wrapSB(value) {
  return '[' + value + ']';
};
var quoteAndJoinWithComma = exports.quoteAndJoinWithComma = (0, _ramda__default.compose)(joinWithComma, (0, _ramda__default.map)(quote));

// -----------------------------------------------------------------------------
// Objects
// -----------------------------------------------------------------------------

var freeze = Object.freeze;

// -----------------------------------------------------------------------------
// Functional Utility
// -----------------------------------------------------------------------------

exports.freeze = freeze;
var iReduce = exports.iReduce = (0, _ramda__default.addIndex)(_ramda__default.reduce);
var reduceObjIndexed = exports.reduceObjIndexed = (0, _ramda__default.curry)(function (f, acc, v) {
  return (0, _ramda__default.compose)((0, _ramda__default.reduce)(f, acc), _ramda__default.toPairs)(v);
});

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

var log = (0, _ramda__default.curry)(function (loggingFunction, prefix) {
  return (0, _ramda__default.tap)((0, _ramda__default.compose)(loggingFunction, (0, _ramda__default.join)(': '), (0, _ramda__default.flip)(_ramda__default.append)([prefix]), JSON.stringify));
});

// eslint-disable-next-line no-console
var logToConsole = exports.logToConsole = log(console.log);

var loggingValidator = exports.loggingValidator = function loggingValidator(message) {
  return function (validation) {
    logToConsole(message)(validation);
    return Success(validation);
  };
};

// -----------------------------------------------------------------------------
// Props / Lenses
// -----------------------------------------------------------------------------

var propValue = exports.propValue = (0, _ramda__default.prop)('value');
});

unwrapExports(utils);
var utils_1 = utils.propValue;
var utils_2 = utils.loggingValidator;
var utils_3 = utils.logToConsole;
var utils_4 = utils.reduceObjIndexed;
var utils_5 = utils.iReduce;
var utils_6 = utils.freeze;
var utils_7 = utils.quoteAndJoinWithComma;
var utils_8 = utils.wrapSB;
var utils_9 = utils.quote;
var utils_10 = utils.joinWithColon;
var utils_11 = utils.joinWithOr;
var utils_12 = utils.joinWithAnd;
var utils_13 = utils.joinWithComma;

var _const = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
// eslint-disable-next-line import/prefer-default-export
var TYPES = exports.TYPES = Object.freeze({
  Function: "Function",
  Array: "Array",
  Object: "Object",
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Undefined: "Undefined"
});

var ROOT_FIELD = exports.ROOT_FIELD = "root";
});

unwrapExports(_const);
var _const_1 = _const.TYPES;
var _const_2 = _const.ROOT_FIELD;

var messages = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orErrorMessages = exports.andErrorMessages = exports.validNumberErrorMessage = exports.isEmptyErrorMessage = exports.exclusiveKeyErrorMessage = exports.objectValidatorErrorMessage = exports.constraintValidatorErrorMessage = exports.lengthLessThanErrorMessage = exports.lengthGreaterThanErrorMessage = exports.missingRequiredKeyErrorMessage = exports.numberWithUnitErrorMessage = exports.valuesErrorMessage = exports.valueErrorMessage = exports.invalidKeysErrorMessage = exports.whitelistErrorMessage = exports.arrayElementsErrorMessage = exports.arrayElementErrorMessage = exports.typeErrorMessage = exports.fieldErrorMessage = undefined;







var prefixForTypeErrorMessage = function prefixForTypeErrorMessage(complement$$1) {
  return complement$$1 ? 'Was type' : 'Wasn\'t type';
};

var fieldErrorMessage = exports.fieldErrorMessage = function fieldErrorMessage(field, errorMessage) {
  return 'Field ' + (0, utils.joinWithColon)([(0, utils.quote)(field), errorMessage]);
};

var typeErrorMessage = exports.typeErrorMessage = function typeErrorMessage(typeName) {
  var complement$$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (0, utils.joinWithColon)([prefixForTypeErrorMessage(complement$$1), (0, utils.quote)(typeName)]);
};

var arrayElementErrorMessage = exports.arrayElementErrorMessage = function arrayElementErrorMessage(value, message) {
  return (0, utils.joinWithColon)([(0, utils.quote)(value), message]);
};

var arrayElementsErrorMessage = exports.arrayElementsErrorMessage = function arrayElementsErrorMessage(elementErrorMessages) {
  return (0, utils.joinWithColon)(['Array contained invalid element(s)', (0, utils.joinWithComma)(elementErrorMessages)]);
};

var whitelistErrorMessage = exports.whitelistErrorMessage = function whitelistErrorMessage(whitelist) {
  return (0, utils.joinWithColon)(['Value wasn\'t one of the accepted values', (0, utils.joinWithComma)(whitelist)]);
};

var invalidKeysErrorMessage = exports.invalidKeysErrorMessage = function invalidKeysErrorMessage(invalidKeys) {
  return (0, utils.joinWithColon)(['Object included invalid key(s)', (0, utils.quote)((0, utils.wrapSB)((0, utils.joinWithComma)(invalidKeys)))]);
};

var valueErrorMessage = exports.valueErrorMessage = function valueErrorMessage(name) {
  return function (value) {
    return 'Key ' + (0, utils.joinWithColon)([(0, utils.quote)(name), value]);
  };
};

var valuesErrorMessage = exports.valuesErrorMessage = function valuesErrorMessage(messages) {
  return (0, utils.joinWithColon)(['Object included invalid values(s)', (0, utils.joinWithComma)(messages)]);
};

var numberWithUnitErrorMessage = exports.numberWithUnitErrorMessage = function numberWithUnitErrorMessage(unit) {
  return (0, utils.joinWithColon)(['Wasn\'t number with unit', (0, utils.quote)(unit)]);
};

var missingRequiredKeyErrorMessage = exports.missingRequiredKeyErrorMessage = function missingRequiredKeyErrorMessage(keys) {
  return (0, utils.joinWithColon)(['Object was missing required key(s)', (0, utils.wrapSB)((0, utils.quoteAndJoinWithComma)(keys))]);
};

var lengthGreaterThanErrorMessage = exports.lengthGreaterThanErrorMessage = function lengthGreaterThanErrorMessage(length$$1) {
  return 'Length must be greater than ' + length$$1;
};

var lengthLessThanErrorMessage = exports.lengthLessThanErrorMessage = function lengthLessThanErrorMessage(length$$1) {
  return 'Length must be less than ' + length$$1;
};

var constraintValidatorErrorMessage = exports.constraintValidatorErrorMessage = function constraintValidatorErrorMessage(messages) {
  return 'Constraints ' + messages;
};

var objectValidatorErrorMessage = exports.objectValidatorErrorMessage = function objectValidatorErrorMessage(fieldName) {
  return function (messages) {
    return fieldName === _const.ROOT_FIELD ? (0, utils.joinWithColon)(['Object Invalid', messages]) : 'for field ' + (0, utils.joinWithColon)([(0, utils.quote)(fieldName), messages]);
  };
};

var exclusiveKeyErrorMessage = exports.exclusiveKeyErrorMessage = function exclusiveKeyErrorMessage(keys) {
  return (0, utils.joinWithColon)(['Object had more than one exlusive key', (0, utils.wrapSB)((0, utils.quoteAndJoinWithComma)(keys))]);
};

var isEmptyErrorMessage = exports.isEmptyErrorMessage = (0, _ramda__default.always)('Was Empty');

var validNumberErrorMessage = exports.validNumberErrorMessage = (0, _ramda__default.always)('Wasn\'t a valid Number');

var andErrorMessages = exports.andErrorMessages = utils.joinWithAnd;

var orErrorMessages = exports.orErrorMessages = utils.joinWithOr;
});

unwrapExports(messages);
var messages_1 = messages.orErrorMessages;
var messages_2 = messages.andErrorMessages;
var messages_3 = messages.validNumberErrorMessage;
var messages_4 = messages.isEmptyErrorMessage;
var messages_5 = messages.exclusiveKeyErrorMessage;
var messages_6 = messages.objectValidatorErrorMessage;
var messages_7 = messages.constraintValidatorErrorMessage;
var messages_8 = messages.lengthLessThanErrorMessage;
var messages_9 = messages.lengthGreaterThanErrorMessage;
var messages_10 = messages.missingRequiredKeyErrorMessage;
var messages_11 = messages.numberWithUnitErrorMessage;
var messages_12 = messages.valuesErrorMessage;
var messages_13 = messages.valueErrorMessage;
var messages_14 = messages.invalidKeysErrorMessage;
var messages_15 = messages.whitelistErrorMessage;
var messages_16 = messages.arrayElementsErrorMessage;
var messages_17 = messages.arrayElementErrorMessage;
var messages_18 = messages.typeErrorMessage;
var messages_19 = messages.fieldErrorMessage;

var withField = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var Failure = folktale.validation.Failure;

exports.default = function (field, validator) {
  return function (o) {
    return validator(o).orElse(function (message) {
      return Failure((0, messages.fieldErrorMessage)(field, message));
    });
  };
};
});

unwrapExports(withField);

var anyOfValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





exports.default = function (validators) {
  return function (o) {
    return (0, _ramda__default.reduce)(function (accumulatedValidation, validator) {
      return !accumulatedValidation ? validator(o) : accumulatedValidation.orElse(function (errorMessage1) {
        return validator(o).mapFailure(function (errorMessage2) {
          return [(0, messages.andErrorMessages)([errorMessage1, errorMessage2])];
        });
      });
    }, null)(validators);
  };
};
});

unwrapExports(anyOfValidator);

/**
 * A function that returns `undefined`.
 *
 * @func stubUndefined
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.0.0|v1.0.0}
 * @category Function
 * @sig ... -> undefined
 * @return {undefined}
 * @example
 *
 * RA.stubUndefined(); //=> undefined
 * RA.stubUndefined(1, 2, 3); //=> undefined
 */
var stubUndefined = /*#__PURE__*/_ramda.always(void 0); // eslint-disable-line no-void

/**
 * Checks if input value is `undefined`.
 *
 * @func isUndefined
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.0.1|v0.0.1}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotUndefined|isNotUndefined}
 * @example
 *
 * RA.isUndefined(1); //=> false
 * RA.isUndefined(undefined); //=> true
 * RA.isUndefined(null); //=> false
 */
var isUndefined = /*#__PURE__*/_ramda.equals( /*#__PURE__*/stubUndefined());

/**
 * Checks if input value is complement `undefined`.
 *
 * @func isNotUndefined
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.0.1|v0.0.1}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isUndefined|isUndefined}
 * @example
 *
 * RA.isNotUndefined(1); //=> true
 * RA.isNotUndefined(undefined); //=> false
 * RA.isNotUndefined(null); //=> true
 */
var isNotUndefined = /*#__PURE__*/_ramda.complement(isUndefined);

/**
 * Checks if input value is `null`.
 *
 * @func isNull
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.1.0|v0.1.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotNull|isNotNull}
 * @example
 *
 * RA.isNull(1); //=> false
 * RA.isNull(undefined); //=> false
 * RA.isNull(null); //=> true
 */
var isNull = /*#__PURE__*/_ramda.equals(null);

/**
 * Checks if input value is complement of `null`.
 *
 * @func isNotNull
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.1.0|v0.1.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNull|isNull}
 * @example
 *
 * RA.isNotNull(1); //=> true
 * RA.isNotNull(undefined); //=> true
 * RA.isNotNull(null); //=> false
 */
var isNotNull = /*#__PURE__*/_ramda.complement(isNull);

/**
 * Checks if input value is complement of `null` or `undefined`.
 *
 * @func isNotNil
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.3.0|v0.3.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isNil|isNil}
 * @example
 *
 * RA.isNotNil(null); //=> false
 * RA.isNotNil(undefined); //=> false
 * RA.isNotNil(0); //=> true
 * RA.isNotNil([]); //=> true
 */
var isNotNil = /*#__PURE__*/_ramda.complement(_ramda.isNil);

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};

/**
 * Checks if input value is `Array`.
 *
 * @func isArray
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.3.0|v0.3.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotArray|isNotArray}
 * @example
 *
 * RA.isArray([]); //=> true
 * RA.isArray(null); //=> false
 * RA.isArray({}); //=> false
 */
var isArray = /*#__PURE__*/_ramda.or(Array.isArray, _isArray);

/**
 * Checks if input value is complement of `Array`
 *
 * @func isNotArray
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.3.0|v0.3.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isArray|isArray}
 * @example
 *
 * RA.isNotArray([]); //=> false
 * RA.isNotArray(null); //=> true
 * RA.isNotArray({}); //=> true
 */
var isNotArray = /*#__PURE__*/_ramda.complement(isArray);

/**
 * Checks if input value is `Boolean`.
 *
 * @func isBoolean
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.3.0|v0.3.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotBoolean|isNotBoolean}
 * @example
 *
 * RA.isBoolean(false); //=> true
 * RA.isBoolean(true); //=> true
 * RA.isBoolean(null); //=> false
 */
var isBoolean = /*#__PURE__*/_ramda.is(Boolean);

/**
 * Checks if input value is complement of `Boolean`.
 *
 * @func isNotBoolean
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.3.0|v0.3.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isBoolean|isBoolean}
 * @example
 *
 * RA.isNotBoolean(false); //=> false
 * RA.isNotBoolean(true); //=> false
 * RA.isNotBoolean(null); //=> true
 */
var isNotBoolean = /*#__PURE__*/_ramda.complement(isBoolean);

/**
 * Returns true if the given value is not its type's empty value; `false` otherwise.
 *
 * @func isNotEmpty
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.4.0|v0.4.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isEmpty|isEmpty}
 * @example
 *
 * RA.isNotEmpty([1, 2, 3]); //=> true
 * RA.isNotEmpty([]); //=> false
 * RA.isNotEmpty(''); //=> false
 * RA.isNotEmpty(null); //=> true
 * RA.isNotEmpty(undefined): //=> true
 * RA.isNotEmpty({}); //=> false
 * RA.isNotEmpty({length: 0}); //=> true
 */
var isNotEmpty = /*#__PURE__*/_ramda.complement(_ramda.isEmpty);

/**
 * Returns `true` if the given value is its type's empty value, `null` or `undefined`.
 *
 * @func isNilOrEmpty
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.4.0|v0.4.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#isEmpty|isEmpty}, {@link http://ramdajs.com/docs/#isNil|isNil}
 * @example
 *
 * RA.isNilOrEmpty([1, 2, 3]); //=> false
 * RA.isNilOrEmpty([]); //=> true
 * RA.isNilOrEmpty(''); //=> true
 * RA.isNilOrEmpty(null); //=> true
 * RA.isNilOrEmpty(undefined): //=> true
 * RA.isNilOrEmpty({}); //=> true
 * RA.isNilOrEmpty({length: 0}); //=> false
 */
var isNilOrEmpty = /*#__PURE__*/_ramda.anyPass([_ramda.isNil, _ramda.isEmpty]);

function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}
var _isString_1 = _isString;

/**
 * Checks if input value is `String`.
 *
 * @func isString
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.4.0|v0.4.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotString|isNotString}
 * @example
 *
 * RA.isString('abc'); //=> true
 * RA.isString(1); //=> false
 */
var isString = _isString_1;

/**
 * Checks if input value is complement of `String`.
 *
 * @func isNotString
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.4.0|v0.4.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isString|isString}
 * @example
 *
 * RA.isNotString('abc'); //=> false
 * RA.isNotString(1); //=> true
 */
var isNotString = /*#__PURE__*/_ramda.complement(isString);

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable max-len */
/**
 * Tests whether or not an object is similar to an array.
 *
 * @func isArrayLike
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.9.0|v1.9.0}
 * @licence https://github.com/ramda/ramda/blob/master/LICENSE.txt
 * @category List
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @returns {Boolean} `true` if `val` has a numeric length property and extreme indices defined; `false` otherwise.
 * @see {@link RA.isNotArrayLike|isNotArrayLike}

 * @example
 *
 * RA.isArrayLike([]); //=> true
 * RA.isArrayLike(true); //=> false
 * RA.isArrayLike({}); //=> false
 * RA.isArrayLike({length: 10}); //=> false
 * RA.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
/* eslint-enable max-len */
var isArrayLike = function isArrayLike(val) {
  if (isArray(val)) {
    return true;
  }
  if (!val) {
    return false;
  }
  if (isString(val)) {
    return false;
  }
  if ((typeof val === 'undefined' ? 'undefined' : _typeof$1(val)) !== 'object') {
    return false;
  }
  if (val.nodeType === 1) {
    return !!val.length;
  }
  if (val.length === 0) {
    return true;
  }
  if (val.length > 0) {
    return _ramda.has(0, val) && _ramda.has(val.length - 1, val);
  }
  return false;
};



/**
 The MIT License (MIT)

 Copyright (c) 2013-2016 Scott Sauyet and Michael Hurley

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * Tests whether or not an object is similar to an array.
 *
 * @func isNotArrayLike
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isArrayLike|isArrayLike}
 * @example
 *
 * RA.isNotArrayLike([]); //=> false
 * RA.isNotArrayLike(true); //=> true
 * RA.isNotArrayLike({}); //=> true
 * RA.isNotArrayLike({length: 10}); //=> true
 * RA.isNotArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> false
 */
var isNotArrayLike = /*#__PURE__*/_ramda.complement(isArrayLike);

var GeneratorFunction = null;
try {
  GeneratorFunction = /*#__PURE__*/new Function('return function* () {}')().constructor; // eslint-disable-line no-new-func
} catch (e) {} // eslint-disable-line no-empty


/* eslint-disable max-len */
/**
 * Checks if input value is `Generator Function`.
 *
 * @func isGeneratorFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFunction|isFunction}, {@link RA.isAsyncFunction|isAsyncFunction}, {@link RA.isNotGeneratorFunction|isNotGeneratorFunction}
 * @example
 *
 * RA.isGeneratorFunction(function* test() { }); //=> true
 * RA.isGeneratorFunction(null); //=> false
 * RA.isGeneratorFunction(function test() { }); //=> false
 * RA.isGeneratorFunction(() => {}); //=> false
 */
/* eslint-enable max-len */
var isGeneratorFunction = function isGeneratorFunction(val) {
  var toStringCheck = Object.prototype.toString.call(val) === '[object GeneratorFunction]';
  var legacyConstructorCheck = isNotNull(GeneratorFunction) && val instanceof GeneratorFunction;

  return _ramda.or(toStringCheck, legacyConstructorCheck);
};

/* eslint-disable max-len */
/**
 * Checks if input value is complement of `Generator Function`
 *
 * @func isNotGeneratorFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFunction|isFunction}, {@link RA.isAsyncFunction|isAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
 * @example
 *
 * RA.isNotGeneratorFunction(function* test() { }); //=> false
 * RA.isNotGeneratorFunction(null); //=> true
 * RA.isNotGeneratorFunction(function test() { }); //=> true
 * RA.isNotGeneratorFunction(() => {}); //=> true
 */
/* eslint-enable max-len */
var isNotGeneratorFunction = /*#__PURE__*/_ramda.complement(isGeneratorFunction);

/* eslint-disable max-len */
/**
 * Checks if input value is `Async Function`.
 *
 * @func isAsyncFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFunction|isFunction}, {@link RA.isNotAsyncFunction|isNotAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
 * @example
 *
 * RA.isAsyncFunction(async function test() { }); //=> true
 * RA.isAsyncFunction(null); //=> false
 * RA.isAsyncFunction(function test() { }); //=> false
 * RA.isAsyncFunction(() => {}); //=> false
 */
/* eslint-enable max-len */
var isAsyncFunction = function isAsyncFunction(val) {
  return Object.prototype.toString.call(val) === '[object AsyncFunction]';
};

/* eslint-disable max-len */
/**
 * Checks if input value is complement of `Async Function`
 *
 * @func isNotAsyncFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFunction|isFunction}, {@link RA.isAsyncFunction|isAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
 * @example
 *
 * RA.isNotAsyncFunction(async function test() { }); //=> false
 * RA.isNotAsyncFunction(null); //=> true
 * RA.isNotAsyncFunction(function test() { }); //=> true
 * RA.isNotAsyncFunction(() => {}); //=> true
 */
/* eslint-enable max-len */
var isNotAsyncFunction = /*#__PURE__*/_ramda.complement(isAsyncFunction);

/* eslint-disable max-len */
/**
 * Checks if input value is `Function`.
 *
 * @func isFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotFunction|isNotFunction}, {@link RA.isAsyncFunction|isNotAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
 * @example
 *
 * RA.isFunction(function test() { }); //=> true
 * RA.isFunction(function* test() { }); //=> true
 * RA.isFunction(async function test() { }); //=> true
 * RA.isFunction(() => {}); //=> true
 * RA.isFunction(null); //=> false
 * RA.isFunction('abc'); //=> false
 */
/* eslint-enable max-len */
var isFunction = /*#__PURE__*/_ramda.anyPass([function (val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}, isGeneratorFunction, isAsyncFunction]);

/* eslint-disable max-len */
/**
 * Checks if input value is complement of `Function`.
 *
 * @func isNotFunction
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFunction|isFunction}, {@link RA.isAsyncFunction|isNotAsyncFunction}, {@link RA.isGeneratorFunction|isGeneratorFunction}
 * @example
 *
 * RA.isNotFunction(function test() { }); //=> false
 * RA.isNotFunction(function* test() { }); //=> false
 * RA.isNotFunction(async function test() { }); //=> false
 * RA.isNotFunction(() => {}); //=> false
 * RA.isNotFunction(null); //=> true
 * RA.isNotFunction('abc'); //=> true
 */
/* eslint-enable max-len */
var isNotFunction = /*#__PURE__*/_ramda.complement(isFunction);

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isOfTypeObject = function isOfTypeObject(val) {
  return (typeof val === 'undefined' ? 'undefined' : _typeof$2(val)) === 'object';
};

/* eslint-disable max-len */
/**
 * Checks if input value is language type of `Object`.
 *
 * @func isObj
 * @aliases isObject
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotObj|isNotObj}, {@link RA.isObjLike|isObjLike}, {@link RA.isPlainObj|isPlainObj}
 * @example
 *
 * RA.isObj({}); //=> true
 * RA.isObj([]); //=> true
 * RA.isObj(() => {}); //=> true
 * RA.isObj(null); //=> false
 * RA.isObj(undefined); //=> false
 */
/* eslint-enable max-len */
var isObj = /*#__PURE__*/_ramda.both(isNotNull, /*#__PURE__*/_ramda.anyPass([isOfTypeObject, isFunction]));

/* eslint-disable max-len */
/**
 * Checks if input value is complement of language type of `Object`.
 *
 * @func isNotObj
 * @aliases isNotObject
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isObj|isObj}, {@link RA.isObjLike|isObjLike}, {@link RA.isPlainObj|isPlainObj}
 * @example
 *
 * RA.isNotObj({}); //=> false
 * RA.isNotObj([]); //=> false
 * RA.isNotObj(() => {}); //=> false
 * RA.isNotObj(null); //=> true
 * RA.isNotObj(undefined); //=> true
 */
/* eslint-enable max-len */
var isNotObj = /*#__PURE__*/_ramda.complement(isObj);

/* eslint-disable max-len */
/**
 * Checks if value is object-like. A value is object-like if it's not null and has a typeof result of "object".
 *
 * @func isObjLike
 * @aliases isObjectLike
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotObjLike|isNotObjLike}, {@link RA.isObj|isObj}, {@link RA.isPlainObj|isPlainObj}
 * @example
 *
 * RA.isObjLike({}); //=> true
 * RA.isObjLike([]); //=> true
 * RA.isObjLike(() => {}); //=> false
 * RA.isObjLike(null); //=> false
 * RA.isObjLike(undefined); //=> false
 */
/* eslint-enable max-len */
var isObjLike = /*#__PURE__*/_ramda.both(isNotNull, isOfTypeObject);

/* eslint-disable max-len */
/**
 * Checks if value is not object-like. A value is object-like if it's not null and has a typeof result of "object".
 *
 * @func isNotObjLike
 * @aliases isNotObjectLike
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isObjLike|isObjLike}, {@link RA.isObj|isObj}, {@link RA.isPlainObj|isPlainObj}
 * @example
 *
 * RA.isNotObjLike({}); //=> false
 * RA.isNotObjLike([]); //=> false
 * RA.isNotObjLike(() => {}); //=> true
 * RA.isNotObjLike(null); //=> true
 * RA.isNotObjLike(undefined); //=> true
 */
/* eslint-enable max-len */
var isNotObjLike = /*#__PURE__*/_ramda.complement(isObjLike);

function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}
var _isObject_1 = _isObject;

var isObjectConstructor = /*#__PURE__*/_ramda.pipe(_ramda.toString, /*#__PURE__*/_ramda.equals( /*#__PURE__*/_ramda.toString(Object)));
var hasObjectConstructor = /*#__PURE__*/_ramda.pathSatisfies( /*#__PURE__*/_ramda.both(isFunction, isObjectConstructor), ['constructor']);

/* eslint-disable max-len */
/**
 * Check to see if an object is a plain object (created using `{}`, `new Object()` or `Object.create(null)`).
 *
 * @func isPlainObj
 * @aliases isPlainObject
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotPlainObj|isNotPlainObj}, {@link RA.isObjLike|isObjLike}, {@link RA.isObj|isObj}
 * @example
 *
 * class Bar {
 *   constructor() {
 *     this.prop = 'value';
 *   }
 * }
 *
 * RA.isPlainObj(new Bar()); //=> false
 * RA.isPlainObj({ prop: 'value' }); //=> true
 * RA.isPlainObj(['a', 'b', 'c']); //=> false
 * RA.isPlainObj(Object.create(null); //=> true
 * RA.isPlainObj(new Object()); //=> true
 */
/* eslint-enable max-len */
var isPlainObj = function isPlainObj(val) {
  if (!isObjLike(val) || !_isObject_1(val)) {
    return false;
  }

  var proto = Object.getPrototypeOf(val);

  if (isNull(proto)) {
    return true;
  }

  return hasObjectConstructor(proto);
};

/* eslint-disable max-len */
/**
 * Check to see if an object is a not plain object (created using `{}`, `new Object()` or `Object.create(null)`).
 *
 * @func isNotPlainObj
 * @aliases isNotPlainObject
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.5.0|v0.5.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isPlainObj|isPlainObj}, {@link RA.isObjLike|isObjLike}, {@link RA.isObj|isObj}
 * @example
 *
 * class Bar {
 *   constructor() {
 *     this.prop = 'value';
 *   }
 * }
 *
 * RA.isNotPlainObj(new Bar()); //=> true
 * RA.isNotPlainObj({ prop: 'value' }); //=> false
 * RA.isNotPlainObj(['a', 'b', 'c']); //=> true
 * RA.isNotPlainObj(Object.create(null); //=> false
 * RA.isNotPlainObj(new Object()); //=> false
 */
/* eslint-enable max-len */
var isNotPlainObj = /*#__PURE__*/_ramda.complement(isPlainObj);

/* eslint-disable max-len */
/**
 * Checks if value is `Date` object.
 *
 * @func isDate
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotDate|isNotDate}, {@link RA.isValidDate|isValidDate}, {@link RA.isNotValidDate|isNotValidDate}
 * @example
 *
 * RA.isDate(new Date()); //=> true
 * RA.isDate('1997-07-16T19:20+01:00'); //=> false
 */
/* eslint-enable max-len */
var isDate = /*#__PURE__*/_ramda.is(Date);

/**
 * Checks if value is complement of `Date` object.
 *
 * @func isNotDate
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isDate|isDate}
 * @example
 *
 * RA.isNotDate(new Date()); //=> false
 * RA.isNotDate('1997-07-16T19:20+01:00'); //=> true
 */
var isNotDate = /*#__PURE__*/_ramda.complement(isDate);

function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}
var _isNumber_1 = _isNumber;

/**
 * Checks if value is a `Number` primitive or object.
 *
 * @func isNumber
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotNumber|isNotNumber}
 * @example
 *
 * RA.isNumber(5); // => true
 * RA.isNumber(Number.MAX_VALUE); // => true
 * RA.isNumber(-Infinity); // => true
 * RA.isNumber(NaN); // => true
 * RA.isNumber('5'); // => false
 */
var isNumber = _isNumber_1;

// eslint-disable-next-line no-restricted-globals
var isNaNPolyfill = /*#__PURE__*/_ramda.both(isNumber, isNaN);

/**
 * Checks whether the passed value is `NaN` and its type is `Number`.
 * It is a more robust version of the original, global isNaN().
 *
 *
 * @func isNaN
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotNaN|isNotNaN}
 * @example
 *
 * RA.isNaN(NaN); // => true
 * RA.isNaN(Number.NaN); // => true
 * RA.isNaN(0 / 0); // => true
 *
 * // e.g. these would have been true with global isNaN().
 * RA.isNaN('NaN'); // => false
 * RA.isNaN(undefined); // => false
 * RA.isNaN({}); // => false
 * RA.isNaN('blabla'); // => false
 *
 * RA.isNaN(true); // => false
 * RA.isNaN(null); // => false
 * RA.isNaN(37); // => false
 * RA.isNaN('37'); // => false
 * RA.isNaN('37.37'); // => false
 * RA.isNaN(''); // => false
 * RA.isNaN(' '); // => false
 */
var _isNaN = /*#__PURE__*/_ramda.or(Number.isNaN, isNaNPolyfill);

/**
 * Checks whether the passed value is complement of `NaN` and its type is not `Number`.
 *
 * @func isNotNaN
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNaN|isNaN}
 * @example
 *
 * RA.isNotNaN(NaN); // => false
 * RA.isNotNaN(Number.NaN); // => false
 * RA.isNotNaN(0 / 0); // => false
 *
 * RA.isNotNaN('NaN'); // => true
 * RA.isNotNaN(undefined); // => true
 * RA.isNotNaN({}); // => true
 * RA.isNotNaN('blabla'); // => true
 *
 * RA.isNotNaN(true); // => true
 * RA.isNotNaN(null); // => true
 * RA.isNotNaN(37); // => true
 * RA.isNotNaN('37'); // => true
 * RA.isNotNaN('37.37'); // => true
 * RA.isNotNaN(''); // => true
 * RA.isNotNaN(' '); // => true
 */
var isNotNaN = /*#__PURE__*/_ramda.complement(_isNaN);

/* eslint-disable max-len */
/**
 * Checks if value is valid `Date` object.
 *
 * @func isValidDate
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.8.0|v1.8.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isDate|isDate}, {@link RA.isNotDate|isNotDate}, {@link RA.isNotValidDate|isNotValidDate}
 * @example
 *
 * RA.isValidDate(new Date()); //=> true
 * RA.isValidDate(new Date('a')); //=> false
 */
/* eslint-enable max-len */
var isValidDate = /*#__PURE__*/_ramda.both(isDate, /*#__PURE__*/_ramda.pipe( /*#__PURE__*/_ramda.invoker(0, 'getTime'), isNotNaN));

/**
 * Checks if value is complement of valid `Date` object.
 *
 * @func isNotValidDate
 * @aliases isInvalidDate
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.8.0|v1.8.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isValidDate|isValidDate}, {@link RA.isDate|isDate}, {@link RA.isNotDate|isNotDate}
 * @example
 *
 * RA.isNotValidDate(new Date()); //=> false
 * RA.isNotValidDate(new Date('a')); //=> true
 */
var isNotValidDate = /*#__PURE__*/_ramda.complement(isValidDate);

/**
 * Checks if value is a complement of `Number` primitive or object.
 *
 * @func isNotNumber
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.6.0|v0.6.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNumber|isNumber}
 * @example
 *
 * RA.isNotNumber(5); // => false
 * RA.isNotNumber(Number.MAX_VALUE); // => false
 * RA.isNotNumber(-Infinity); // => false
 * RA.isNotNumber('5'); // => true
 */
var isNotNumber = /*#__PURE__*/_ramda.complement(isNumber);

/**
 * Checks if value is a positive `Number` primitive or object.
 *
 * @func isPositive
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.15.0|v1.15.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNegative|isNegative}
 * @example
 *
 * RA.isPositive(1); // => true
 * RA.isPositive(Number.MAX_VALUE); // => true
 * RA.isPositive(-Infinity); // => false
 * RA.isPositive(NaN); // => false
 * RA.isPositive('5'); // => false
 */
var isPositive = /*#__PURE__*/_ramda.both(isNumber, /*#__PURE__*/_ramda.lt(0));

/**
 * Checks if value is a negative `Number` primitive or object.
 *
 * @func isNegative
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.15.0|v1.15.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isPositive|isPositive}
 * @example
 *
 * RA.isNegative(-1); // => true
 * RA.isNegative(Number.MIN_VALUE); // => false
 * RA.isNegative(+Infinity); // => false
 * RA.isNegative(NaN); // => false
 * RA.isNegative('5'); // => false
 */
var isNegative = /*#__PURE__*/_ramda.both(isNumber, /*#__PURE__*/_ramda.gt(0));

// eslint-disable-next-line no-restricted-globals
var isFinitePolyfill = /*#__PURE__*/_ramda.both(isNumber, isFinite);

/**
 * Checks whether the passed value is a finite `Number`.
 *
 * @func isFinite
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotFinite|isNotFinite}
 * @example
 *
 * RA.isFinite(Infinity); //=> false
 * RA.isFinite(NaN); //=> false
 * RA.isFinite(-Infinity); //=> false
 *
 * RA.isFinite(0); // true
 * RA.isFinite(2e64); // true
 *
 * RA.isFinite('0');  // => false
 *                    // would've been true with global isFinite('0')
 * RA.isFinite(null); // => false
 *                    // would've been true with global isFinite(null)
 */
var _isFinite = /*#__PURE__*/_ramda.or(Number.isFinite, isFinitePolyfill);

/**
 * Checks whether the passed value is complement of finite `Number`.
 *
 *
 * @func isNotFinite
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFinite|isFinite}
 * @example
 *
 * RA.isNotFinite(Infinity); //=> true
 * RA.isNotFinite(NaN); //=> true
 * RA.isNotFinite(-Infinity); //=> true
 *
 * RA.isNotFinite(0); // false
 * RA.isNotFinite(2e64); // false
 *
 * RA.isNotFinite('0');  // => true
 * RA.isNotFinite(null); // => true
 */
var isNotFinite = /*#__PURE__*/_ramda.complement(_isFinite);

var isIntegerPolyfill = /*#__PURE__*/_ramda.both(_isFinite, /*#__PURE__*/_ramda.converge(_ramda.equals, [Math.floor, _ramda.identity]));

/**
 * Checks whether the passed value is an `integer`.
 *
 * @func isInteger
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotInteger|isNotInteger}
 * @example
 *
 * RA.isInteger(0); //=> true
 * RA.isInteger(1); //=> true
 * RA.isInteger(-100000); //=> true
 *
 * RA.isInteger(0.1);       //=> false
 * RA.isInteger(Math.PI);   //=> false
 *
 * RA.isInteger(NaN);       //=> false
 * RA.isInteger(Infinity);  //=> false
 * RA.isInteger(-Infinity); //=> false
 * RA.isInteger('10');      //=> false
 * RA.isInteger(true);      //=> false
 * RA.isInteger(false);     //=> false
 * RA.isInteger([1]);       //=> false
 */
var isInteger = /*#__PURE__*/_ramda.or(Number.isInteger, isIntegerPolyfill);

/**
 * Checks whether the passed value is complement of an `integer`.
 *
 *
 * @func isNotInteger
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/0.7.0|v0.7.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isInteger|isInteger}
 * @example
 *
 * RA.isNotInteger(0); //=> false
 * RA.isNotInteger(1); //=> false
 * RA.isNotInteger(-100000); //=> false
 *
 * RA.isNotInteger(0.1);       //=> true
 * RA.isNotInteger(Math.PI);   //=> true
 *
 * RA.isNotInteger(NaN);       //=> true
 * RA.isNotInteger(Infinity);  //=> true
 * RA.isNotInteger(-Infinity); //=> true
 * RA.isNotInteger('10');      //=> true
 * RA.isNotInteger(true);      //=> true
 * RA.isNotInteger(false);     //=> true
 * RA.isNotInteger([1]);       //=> true
 */
var isNotInteger = /*#__PURE__*/_ramda.complement(isInteger);

/**
 * Checks whether the passed value is a `float`.
 *
 * @func isFloat
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.14.0|v1.14.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotFloat|isNotFloat}
 * @example
 *
 * RA.isFloat(0); //=> false
 * RA.isFloat(1); //=> false
 * RA.isFloat(-100000); //=> false
 *
 * RA.isFloat(0.1);       //=> true
 * RA.isFloat(Math.PI);   //=> true
 *
 * RA.isFloat(NaN);       //=> false
 * RA.isFloat(Infinity);  //=> false
 * RA.isFloat(-Infinity); //=> false
 * RA.isFloat('10');      //=> false
 * RA.isFloat(true);      //=> false
 * RA.isFloat(false);     //=> false
 * RA.isFloat([1]);       //=> false
 */
var isFloat = /*#__PURE__*/_ramda.both(_isFinite, /*#__PURE__*/_ramda.complement(isInteger));

/**
 * Checks whether the passed value is complement of a `float`.
 *
 * @func isNotFloat
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.14.0|v1.14.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isFloat|isFloat}
 * @example
 *
 * RA.isNotFloat(0); //=> true
 * RA.isNotFloat(1); //=> true
 * RA.isNotFloat(-100000); //=> true
 *
 * RA.isNotFloat(0.1);       //=> false
 * RA.isNotFloat(Math.PI);   //=> false
 *
 * RA.isNotFloat(NaN);       //=> true
 * RA.isNotFloat(Infinity);  //=> true
 * RA.isNotFloat(-Infinity); //=> true
 * RA.isNotFloat('10');      //=> true
 * RA.isNotFloat(true);      //=> true
 * RA.isNotFloat(false);     //=> true
 * RA.isNotFloat([1]);       //=> true
 */
var isNotFloat = /*#__PURE__*/_ramda.complement(isFloat);

/**
 * Checks if value is a valid `Number`. A valid `Number` is a number that is not `NaN`, `Infinity`
 * or `-Infinity`.
 *
 * @func isValidNumber
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.2.0|v2.2.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isNotValidNumber|isNotValidNumber}
 * @example
 *
 * RA.isValidNumber(1); //=> true
 * RA.isValidNumber(''); //=> false
 * RA.isValidNumber(NaN); //=> false
 * RA.isValidNumber(Infinity); //=> false
 * RA.isValidNumber(-Infinity); //=> false
 */
var isValidNumber = /*#__PURE__*/_ramda.either(isInteger, isFloat);

/**
 * Checks if value is not a valid `Number`. A valid `Number` is a number that is not `NaN`,
 * `Infinity` or `-Infinity`.
 *
 * @func isNotValidNumber
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.2.0|v2.2.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isValidNumber|isValidNumber}
 * @example
 *
 * RA.isNotValidNumber(1); //=> false
 * RA.isNotValidNumber(''); //=> true
 * RA.isNotValidNumber(NaN); //=> true
 * RA.isNotValidNumber(Infinity); //=> true
 * RA.isNotValidNumber(-Infinity); //=> true
 */
var isNotValidNumber = /*#__PURE__*/_ramda.complement(isValidNumber);

/**
 * Checks if value is odd integer number.
 * An odd number is an integer which is not a multiple DIVISIBLE of two.
 *
 * @func isOdd
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.18.0|v1.18.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isEven|isEven}
 * @example
 *
 * RA.isOdd(1); // => true
 * RA.isOdd(-Infinity); // => false
 * RA.isOdd(4); // => false
 * RA.isOdd(3); // => true
 */
var isOdd = /*#__PURE__*/_ramda.both(isInteger, /*#__PURE__*/_ramda.pipe( /*#__PURE__*/_ramda.flip(_ramda.modulo)(2), /*#__PURE__*/_ramda.complement(_ramda.equals)(0)));

/**
 * Checks if value is even integer number.
 * An even number is an integer which is "evenly divisible" by two.
 * Zero is an even number because zero divided by two equals zero,
 * which despite not being a natural number, is an integer.
 * Even numbers are either positive or negative.
 *
 * @func isEven
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.18.0|v1.18.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isOdd|isOdd}
 * @example
 *
 * RA.isEven(0); // => true
 * RA.isEven(1); // => false
 * RA.isEven(-Infinity); // => false
 * RA.isEven(4); // => true
 * RA.isEven(3); // => false
 */
var isEven = /*#__PURE__*/_ramda.both(isInteger, /*#__PURE__*/_ramda.complement(isOdd));

/**
 * Checks if input value is a pair.
 *
 * @func isPair
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#pair|pair}, {@link RA.isNotPair|isNotPair}
 * @example
 *
 * RA.isPair([]); // => false
 * RA.isPair([0]); // => false
 * RA.isPair([0, 1]); // => true
 * RA.isPair([0, 1, 2]); // => false
 * RA.isPair({ 0: 0, 1: 1 }); // => false
 * RA.isPair({ foo: 0, bar: 0 }); // => false
 */
var isPair = /*#__PURE__*/_ramda.both(isArray, /*#__PURE__*/_ramda.pipe(_ramda.length, /*#__PURE__*/_ramda.equals(2)));

/**
 * Checks if input value is complement of a pair.
 *
 * @func isNotPair
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#pair|pair}, {@link RA.isPair|isPair}
 * @example
 *
 * RA.isNotPair([]); // => true
 * RA.isNotPair([0]); // => true
 * RA.isNotPair([0, 1]); // => false
 * RA.isNotPair([0, 1, 2]); // => true
 * RA.isNotPair({0: 0, 1: 1}); // => true
 * RA.isNotPair({foo: 0, bar: 0}); // => true
 */
var isNotPair = /*#__PURE__*/_ramda.complement(isPair);

/**
 * Checks if input value is a `thenable`.
 * `thenable` is an object or function that defines a `then` method.
 *
 * @func isThenable
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.1.0|v2.1.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link RA.isPromise|isPromise}
 * @example
 *
 * RA.isThenable(null); // => false
 * RA.isThenable(undefined); // => false
 * RA.isThenable([]); // => false
 * RA.isThenable(Promise.resolve()); // => true
 * RA.isThenable(Promise.reject()); // => true
 * RA.isThenable({ then: () => 1 }); // => true
 */
var isThenable = /*#__PURE__*/_ramda.pathSatisfies(isFunction, ['then']);

/**
 * Checks if input value is a native `Promise`.
 * The Promise object represents the eventual completion (or failure)
 * of an asynchronous operation, and its resulting value.
 *
 * @func isPromise
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.1.0|v2.1.0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link https://promisesaplus.com/|Promises/A+}, {@link RA.isThenable|isThenable}
 * @example
 *
 * RA.isPromise(null); // => false
 * RA.isPromise(undefined); // => false
 * RA.isPromise([]); // => false
 * RA.isPromise(Promise.resolve()); // => true
 * RA.isPromise(Promise.reject()); // => true
 * RA.isPromise({ then: () => 1 }); // => false
 */
var isPromise = /*#__PURE__*/_ramda.both(isObj, /*#__PURE__*/_ramda.pipe(_ramda.toString, /*#__PURE__*/_ramda.equals('[object Promise]')));

/**
 * In JavaScript, a `truthy` value is a value that is considered true
 * when evaluated in a Boolean context. All values are truthy unless
 * they are defined as falsy (i.e., except for `false`, `0`, `""`, `null`, `undefined`, and `NaN`).
 *
 * @func isTruthy
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.2.0|v2.2..0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy|truthy}, {@link RA.isFalsy|isFalsy}
 * @example
 *
 * RA.isTruthy({}); // => true
 * RA.isTruthy([]); // => true
 * RA.isTruthy(42); // => true
 * RA.isTruthy(3.14); // => true
 * RA.isTruthy('foo'); // => true
 * RA.isTruthy(new Date()); // => true
 * RA.isTruthy(Infinity); // => true
 */
var isTruthy = /*#__PURE__*/_ramda.pipe(Boolean, /*#__PURE__*/_ramda.equals(true));

/**
 * A falsy value is a value that translates to false when evaluated in a Boolean context.
 * Falsy values are `false`, `0`, `""`, `null`, `undefined`, and `NaN`.
 *
 * @func isFalsy
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.2.0|v2.2..0}
 * @category Type
 * @sig * -> Boolean
 * @param {*} val The value to test
 * @return {Boolean}
 * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy|falsy}, {@link RA.isTruthy|isTruthy}
 * @example
 *
 * RA.isFalsy(false); // => true
 * RA.isFalsy(0); // => true
 * RA.isFalsy(''); // => true
 * RA.isFalsy(null); // => true
 * RA.isFalsy(undefined); // => true
 * RA.isFalsy(NaN); // => true
 */
var isFalsy = /*#__PURE__*/_ramda.complement(isTruthy);

/**
 * A function that returns `null`.
 *
 * @func stubNull
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.6.0|v1.6.0}
 * @category Function
 * @sig ... -> null
 * @return {null}
 * @example
 *
 * RA.stubNull(); //=> null
 * RA.stubNull(1, 2, 3); //=> null
 */
var stubNull = /*#__PURE__*/_ramda.always(null);

/**
 * This function returns a new empty object.
 *
 * @func stubObj
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.1.0|v2.1.0}
 * @category Function
 * @sig ... -> Object
 * @aliases stubObject
 * @return {Object} Returns the new empty object.
 * @example
 *
 * RA.stubObj(); //=> {}
 * RA.stubObj(1, 2, 3); //=> {}
 */

var stubObj = function stubObj() {
  return {};
};

/**
 * A function that returns empty string.
 *
 * @func stubString
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.1.0|v2.1.0}
 * @category Function
 * @sig ... -> String
 * @return {string} The empty string
 * @example
 *
 * RA.stubString(); //=> ''
 * RA.stubString(1, 2, 3); //=> ''
 */
var stubString = /*#__PURE__*/_ramda.always('');

/**
 * A function that returns new empty array on every call.
 *
 * @func stubArray
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.1.0|v2.1.0}
 * @category Function
 * @sig ... -> Array
 * @return {Array} New empty array
 * @example
 *
 * RA.stubArray(); //=> []
 * RA.stubArray(1, 2, 3); //=> []
 */

var stubArray = function stubArray() {
  return [];
};

/**
 * A function that performs no operations.
 *
 * @func noop
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.0.0|v1.0.0}
 * @category Function
 * @sig ... -> undefined
 * @return {undefined}
 * @example
 *
 * RA.noop(); //=> undefined
 * RA.noop(1, 2, 3); //=> undefined
 */
var noop$2 = /*#__PURE__*/_ramda.always( /*#__PURE__*/stubUndefined());

var mapping = /*#__PURE__*/Object.freeze({
  equals: 'fantasy-land/equals',
  lte: 'fantasy-land/lte',
  compose: 'fantasy-land/compose',
  id: 'fantasy-land/id',
  concat: 'fantasy-land/concat',
  empty: 'fantasy-land/empty',
  map: 'fantasy-land/map',
  contramap: 'fantasy-land/contramap',
  ap: 'fantasy-land/ap',
  of: 'fantasy-land/of',
  alt: 'fantasy-land/alt',
  zero: 'fantasy-land/zero',
  reduce: 'fantasy-land/reduce',
  traverse: 'fantasy-land/traverse',
  chain: 'fantasy-land/chain',
  chainRec: 'fantasy-land/chainRec',
  extend: 'fantasy-land/extend',
  extract: 'fantasy-land/extract',
  bimap: 'fantasy-land/bimap',
  promap: 'fantasy-land/promap'
});

var isFunctor = /*#__PURE__*/_ramda.anyPass([/*#__PURE__*/_ramda.pathSatisfies(isFunction, ['map']), /*#__PURE__*/_ramda.pathSatisfies(isFunction, [mapping.map])]);
var isApply = /*#__PURE__*/_ramda.both(isFunctor, /*#__PURE__*/_ramda.anyPass([/*#__PURE__*/_ramda.pathSatisfies(isFunction, ['ap']), /*#__PURE__*/_ramda.pathSatisfies(isFunction, [mapping.ap])]));

var ap$2 = /*#__PURE__*/_ramda.curryN(2, function (applyF, applyX) {
  // return original ramda `ap` if not Apply spec
  if (!isApply(applyF) || !isApply(applyX)) {
    return _ramda.ap(applyF, applyX);
  }

  try {
    // new version of `ap` starting from ramda version > 0.23.0
    return applyF.ap(applyX);
  } catch (e) {
    // old version of `ap` till ramda version <= 0.23.0
    return applyX.ap(applyF);
  }
});

/**
 * "lifts" a function to be the specified arity, so that it may "map over" objects that satisfy
 * the fantasy land Apply spec of algebraic structures.
 *
 * Lifting is specific for {@link https://github.com/scalaz/scalaz|scalaz} and {@link http://www.functionaljava.org/|functional java} implementations.
 * Old version of fantasy land spec were not compatible with this approach,
 * but as of fantasy land 1.0.0 Apply spec also adopted this approach.
 *
 * This function acts as interop for ramda <= 0.23.0 and {@link https://monet.github.io/monet.js/|monet.js}.
 *
 * More info {@link https://github.com/fantasyland/fantasy-land/issues/50|here}.
 *
 * @func liftFN
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.2.0|v1.2.0}
 * @category Function
 * @sig Apply a => Number -> (a... -> a) -> (a... -> a)
 * @param {Number} arity The arity of the lifter function
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function
 * @see {@link http://ramdajs.com/docs/#lift|lift}, {@link http://ramdajs.com/docs/#ap|ap}
 * @example
 *
 * const { Maybe } = require('monet');
 *
 * const add3 = (a, b, c) => a + b + c;
 * const madd3 = RA.liftFN(3, add3);
 *
 * madd3(Maybe.Some(10), Maybe.Some(15), Maybe.Some(17)); //=> Maybe.Some(42)
 * madd3(Maybe.Some(10), Maybe.Nothing(), Maybe.Some(17)); //=> Maybe.Nothing()
 */
var liftFN = /*#__PURE__*/_ramda.curry(function (arity, fn) {
  var lifted = _ramda.curryN(arity, fn);
  return _ramda.curryN(arity, function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var accumulator = _ramda.map(lifted, _ramda.head(args));
    var apps = _ramda.slice(1, Infinity, args);
    return _ramda.reduce(ap$2, accumulator, apps);
  });
});

/**
 * "lifts" a function to be the specified arity, so that it may "map over" objects that satisfy
 * the fantasy land Apply spec of algebraic structures.
 *
 * Lifting is specific for {@link https://github.com/scalaz/scalaz|scalaz} and {@link http://www.functionaljava.org/|functional java} implementations.
 * Old version of fantasy land spec were not compatible with this approach,
 * but as of fantasy land 1.0.0 Apply spec also adopted this approach.
 *
 * This function acts as interop for ramda <= 0.23.0 and {@link https://monet.github.io/monet.js/|monet.js}.
 *
 * More info {@link https://github.com/fantasyland/fantasy-land/issues/50|here}.
 *
 * @func liftF
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.2.0|v1.2.0}
 * @category Function
 * @sig Apply a => (a... -> a) -> (a... -> a)
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function
 * @see {@link RA.liftFN|liftFN}
 * @example
 *
 * const { Maybe } = require('monet');
 *
 * const add3 = (a, b, c) => a + b + c;
 * const madd3 = RA.liftF(add3);
 *
 * madd3(Maybe.Some(10), Maybe.Some(15), Maybe.Some(17)); //=> Maybe.Some(42)
 * madd3(Maybe.Some(10), Maybe.Nothing(), Maybe.Some(17)); //=> Maybe.Nothing()
 */
var liftF = function liftF(fn) {
  return liftFN(fn.length, fn);
};

/* eslint-disable max-len */
/**
 * The catamorphism is a way of folding a type into a value.
 *
 * **Either**
 *
 * If the either is right than the right function will be executed with
 * the `right` value and the value of the function returned. Otherwise the left function
 * will be called with the `left` value.
 *
 * **Maybe**
 *
 * If the maybe is Some than the right function will be executed with the `some` value and the value of the function
 * returned. Otherwise the left function with be called without an argument.
 *
 *
 *
 * @func cata
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.4.0|v1.4.0}
 * @category Function
 * @sig (a -> b) -> (a -> c) -> Cata a -> b | c
 * @param {Function} leftFn The left function that consumes the left value
 * @param {Function} rightFn The right function that consumes the right value
 * @param {Cata} catamorphicObj Either, Maybe or any other type with catamorphic capabilities (`cata` or `either` method)
 * @return {*}
 * @see {@link https://monet.github.io/monet.js/#cata|cata explained}
 * @example
 *
 * // Either
 * const eitherR = Either.Right(1);
 * const eitherL = Either.Left(2);
 *
 * RA.cata(identity, identity, eitherR); //=> 1
 * RA.cata(identity, identity, eitherL); //=> 2
 *
 * // Maybe
 * const maybeSome = Maybe.Some(1);
 * const maybeNothing = Maybe.Nothing();
 *
 * RA.cata(identity, identity, maybeSome); //=> 1
 * RA.cata(identity, identity, maybeNothing); //=> undefined
 */
/* eslint-enable */
var catamorphism = /*#__PURE__*/_ramda.curry(function (leftFn, rightFn, catamorphicObj) {
  if (isFunction(catamorphicObj.cata)) {
    return catamorphicObj.cata(leftFn, rightFn);
  }
  return catamorphicObj.either(leftFn, rightFn);
});

/**
 * Weaves a configuration into function returning the runnable monad like `Reader` or `Free`.
 * This allows us to pre-bind the configuration in advance and use the weaved function
 * without need to explicitly pass the configuration on every call.
 *
 * @func weave
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.7.0|v1.7.0}
 * @category Function
 * @sig (*... -> *) -> * -> (*... -> *)
 * @param {Function} fn The function to weave
 * @param {*} config The configuration to weave into fn
 * @return {Function} Auto-curried weaved function
 * @example
 *
 * const { Reader: reader } = require('monet');
 *
 * const log = value => reader(
 *   config => config.log(value)
 * );
 *
 * // no weaving
 * log('test').run(console); //=> prints 'test'
 *
 * // weaving
 * const wlog = RA.weave(log, console);
 * wlog('test'); //=> prints 'test'
 */
var weave = /*#__PURE__*/_ramda.curryN(2, function (fn, config) {
  return _ramda.curryN(fn.length, function () {
    return fn.apply(undefined, arguments).run(config);
  });
});

/**
 * Weaves a configuration into function returning the runnable monad like `Reader` or `Free`.
 * This allows us to pre-bind the configuration in advance and use the weaved function
 * without need to explicitly pass the configuration on every call.
 *
 * @func weaveLazy
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.10.0|v1.10.0}
 * @category Function
 * @sig (*... -> *) -> (* -> *) -> (*... -> *)
 * @param {Function} fn The function to weave
 * @param {Function} configAccessor The function that returns the configuration object
 * @return {Function} Auto-curried weaved function
 * @example
 *
 * const { Reader: reader } = require('monet');
 *
 * const log = value => reader(
 *   config => config.log(value)
 * );
 *
 * const consoleAccessor = R.always(console);
 *
 * // no weaving
 * log('test').run(console); //=> prints 'test'
 *
 * // weaving
 * const wlog = RA.weaveLazy(log, consoleAccessor);
 * wlog('test'); //=> prints 'test'
 */
var weaveLazy = /*#__PURE__*/_ramda.curryN(2, function (fn, configAccessor) {
  return _ramda.curryN(fn.length, function () {
    return fn.apply(undefined, arguments).run(configAccessor());
  });
});

/**
 * Returns a curried equivalent of the provided function, with the specified arity.
 * This function is like curryN, except that the provided arguments order is reversed.
 *
 * @func curryRightN
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.12.0|v1.12.0}
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function
 * @param {Function} fn The function to curry
 * @return {Function}  A new, curried function
 * @see {@link http://ramdajs.com/docs/#curryN|curryN}, {@link RA.curryRight|curryRight}
 * @example
 *
 * const concatStrings = (a, b, c) => a + b + c;
 * const concatStringsCurried = RA.curryRightN(3, concatStrings);
 *
 * concatStringCurried('a')('b')('c'); // => 'cba'
 */
var curryRightN = /*#__PURE__*/_ramda.curryN(2, function (arity, fn) {
  return _ramda.curryN(arity, function wrapper() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return fn.apply(this, _ramda.reverse(args));
  });
});

/**
 * Returns a curried equivalent of the provided function.
 * This function is like curry, except that the provided arguments order is reversed.
 *
 * @func curryRight
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.12.0|v1.12.0}
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry
 * @return {Function}  A new, curried function
 * @see {@link http://ramdajs.com/docs/#curry|curry}, {@link RA.curryRightN|curryRightN}
 * @example
 *
 * const concatStrings = (a, b, c) => a + b + c;
 * const concatStringsCurried = RA.curryRight(concatStrings);
 *
 * concatStringCurried('a')('b')('c'); // => 'cba'
 */
var curryRight = /*#__PURE__*/_ramda.converge(curryRightN, [_ramda.length, _ramda.identity]);

/* eslint-disable max-len */
/**
 * Composable shortcut for `Promise.resolve`.
 *
 * Returns a Promise object that is resolved with the given value.
 * If the value is a thenable (i.e. has a "then" method), the returned promise will
 * "follow" that thenable, adopting its eventual state.
 *
 * @func resolveP
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.16.0|v1.16.0}
 * @category Function
 * @sig a -> Promise a
 * @param {*} [value=undefined] Argument to be resolved by this Promise. Can also be a Promise or a thenable to resolve
 * @return {Promise} A Promise that is resolved with the given value, or the promise passed as value, if the value was a promise object
 * @see {@link RA.rejectP|rejectP}
 * @example
 *
 * RA.resolveP(); //=> Promise(undefined)
 * RA.resolveP('a'); //=> Promise('a')
 * RA.resolveP([1, 2, 3]); //=> Promise([1, 2, 3])
 */
/* eslint-enable max-len */
var resolveP = /*#__PURE__*/_ramda.bind(Promise.resolve, Promise);

/**
 * Composable shortcut for `Promise.reject`.
 *
 * Returns a Promise object that is rejected with the given reason.
 *
 * @func rejectP
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.16.0|v1.16.0}
 * @category Function
 * @sig a -> Promise a
 * @param {*} [reason=undefined] Reason why this Promise rejected.
 * @return {Promise} A Promise that is rejected with the given reason
 * @see {@link RA.resolveP|resolveP}
 * @example
 *
 * RA.rejectP(); //=> Promise(undefined)
 * RA.rejectP('a'); //=> Promise('a')
 * RA.rejectP([1, 2, 3]); //=> Promise([1, 2, 3])
 */
var rejectP = /*#__PURE__*/_ramda.bind(Promise.reject, Promise);

// helpers
var filterIndexed = /*#__PURE__*/_ramda.addIndex(_ramda.filter);
var containsIndex = /*#__PURE__*/_ramda.curry(function (indexes, val, index) {
  return _ramda.contains(index, indexes);
});

/**
 * Picks values from list by indexes.
 *
 * @func pickIndexes
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.1.0|v1.1.0}
 * @category List
 * @sig  [Number] -> [a] -> [a]
 * @param {Array} indexes The indexes to pick
 * @param {Array} list The list to pick values from
 * @return {Array} New array containing only values at `indexes`
 * @see {@link http://ramdajs.com/docs/#pick|pick}, {@link RA.omitIndexes|omitIndexes}
 * @example
 *
 * RA.pickIndexes([0, 2], ['a', 'b', 'c']); //=> ['a', 'c']
 */
var pickIndexes = /*#__PURE__*/_ramda.curry(function (indexes, list) {
  return filterIndexed(containsIndex(indexes), list);
});

/**
 * Creates a list from from arguments.
 *
 * @func list
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.1.0|v1.1.0}
 * @category List
 * @sig  a... -> [a...]
 * @param {...*} items The items of the feature list
 * @return {Array} New list created from items
 * @see {@link https://github.com/ramda/ramda/wiki/Cookbook#create-a-list-function|Ramda Cookbook}
 * @example
 *
 * RA.list('a', 'b', 'c'); //=> ['a', 'b', 'c']
 */
var list = /*#__PURE__*/_ramda.unapply(_ramda.identity);

/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: R.concat expects both arguments to be of the same type, unlike
 * the native Array.prototype.concat method.
 * It will throw an error if you concat an Array with a non-Array value.
 * Dispatches to the concat method of the second argument, if present.
 *
 * @func concatRight
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.11.0|v1.11.0}
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `secondList`
 * followed by the elements of `firstList`.
 * @see {@link http://ramdajs.com/docs/#concat|concat}
 * @example
 *
 * RA.concatRight('ABC', 'DEF'); //=> 'DEFABC'
 * RA.concatRight([4, 5, 6], [1, 2, 3]); //=> [1, 2, 3, 4, 5, 6]
 * RA.concatRight([], []); //=> []
 */
var concatRight = /*#__PURE__*/_ramda.flip(_ramda.concat);

/* eslint-disable max-len */
/**
 * Given an `Iterable`(arrays are `Iterable`), or a promise of an `Iterable`,
 * which produces promises (or a mix of promises and values),
 * iterate over all the values in the `Iterable` into an array and
 * reduce the array to a value using the given iterator function.
 *
 * If the iterator function returns a promise, then the result of the promise is awaited,
 * before continuing with next iteration. If any promise in the array is rejected or a promise
 * returned by the iterator function is rejected, the result is rejected as well.
 *
 * If `initialValue` is `undefined` (or a promise that resolves to `undefined`) and
 * the `Iterable` contains only 1 item, the callback will not be called and
 * the `Iterable's` single item is returned. If the `Iterable` is empty, the callback
 * will not be called and `initialValue` is returned (which may be undefined).
 *
 * This function is basically equivalent to {@link http://bluebirdjs.com/docs/api/promise.reduce.html|bluebird.reduce}.
 *
 * @func reduceP
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|v1.13.0}
 * @category List
 * @typedef MaybePromise = Promise.<*> | *
 * @sig ((Promise a, MaybePromise b) -> Promise a) -> MaybePromise a -> MaybePromise [MaybePromise b] -> Promise a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the current element from the list
 * @param {*|Promise.<*>} acc The accumulator value
 * @param {Array.<*>|Promise.<Array<*|Promise.<*>>>} list The list to iterate over
 * @return {Promise} The final, accumulated value
 * @see {@link http://ramdajs.com/docs/#reduce|reduce}, {@link RA.reduceRightP|reduceRightP}, {@link http://bluebirdjs.com/docs/api/promise.reduce.html|bluebird.reduce}
 * @example
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   Promise.resolve(0),
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   [Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceP(
 *   (total, fileName) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   Promise.resolve([Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt'])
 * ); // => Promise(10)
 *
 */
/* esline-enable max-len */
var reduceP = /*#__PURE__*/_ramda.curryN(3, function (fn, acc, list) {
  return resolveP(list).then(function (iterable) {
    var listLength = _ramda.length(iterable);

    if (listLength === 0) {
      return acc;
    }

    var reducer = _ramda.reduce(function (accP, currentValueP) {
      return accP.then(function (previousValue) {
        return Promise.all([previousValue, currentValueP]);
      }).then(function (_ref) {
        var previousValue = _ref[0],
            currentValue = _ref[1];

        if (isUndefined(previousValue) && listLength === 1) {
          return currentValue;
        }

        return fn(previousValue, currentValue);
      });
    });

    return reducer(resolveP(acc), iterable);
  });
});

// in older ramda versions the order of the arguments is flipped
var flipArgs = /*#__PURE__*/_ramda.pipe(_ramda.reduceRight(_ramda.concat, ''), _ramda.equals('ba'))(['a', 'b']);

/* eslint-disable max-len */
/**
 * Given an `Iterable`(arrays are `Iterable`), or a promise of an `Iterable`,
 * which produces promises (or a mix of promises and values),
 * iterate over all the values in the `Iterable` into an array and
 * reduce the array to a value using the given iterator function.
 *
 * Similar to {@link RA.reduceP|reduceP} except moves through the input list from the right to the left.
 * The iterator function receives two values: (value, acc),
 * while the arguments' order of reduceP's iterator function is (acc, value).
 *
 * @func reduceRightP
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|v1.13.0}
 * @category List
 * @typedef MaybePromise = Promise.<*> | *
 * @sig ((MaybePromise b, Promise a) -> Promise a) -> MaybePromise a -> MaybePromise [MaybePromise b] -> Promise a
 * @param {Function} fn The iterator function. Receives two values, the current element from the list and the accumulator
 * @param {*|Promise.<*>} acc The accumulator value
 * @param {Array.<*>|Promise.<Array<*|Promise.<*>>>} list The list to iterate over
 * @return {Promise} The final, accumulated value
 * @see {@link RA.reduceP|reduceP}, {@link http://bluebirdjs.com/docs/api/promise.reduce.html|bluebird.reduce}
 * @example
 *
 * RA.reduceRightP(
 *   (fileName, total) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceRightP(
 *   (fileName, total) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   Promise.resolve(0),
 *   ['file1.txt', 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceRightP(
 *   (fileName, total) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   [Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt']
 * ); // => Promise(10)
 *
 * RA.reduceRightP(
 *   (fileName, total) => fs
 *     .readFileAsync(fileName, 'utf8')
 *     .then(contents => total + parseInt(contents, 10)),
 *   0,
 *   Promise.resolve([Promise.resolve('file1.txt'), 'file2.txt', 'file3.txt'])
 * ); // => Promise(10)
 *
 */
/* esline-enable max-len */
var reduceRightP = /*#__PURE__*/_ramda.curryN(3, function (fn, acc, list) {
  return resolveP(list).then(function (iterable) {
    var listLength = _ramda.length(iterable);

    if (listLength === 0) {
      return acc;
    }

    var reducer = _ramda.reduceRight(function (arg1, arg2) {
      var accP = void 0;
      var currentValueP = void 0;

      if (flipArgs) {
        accP = arg1;
        currentValueP = arg2;
      } else {
        accP = arg2;
        currentValueP = arg1;
      }

      return accP.then(function (previousValue) {
        return Promise.all([previousValue, currentValueP]);
      }).then(function (_ref) {
        var previousValue = _ref[0],
            currentValue = _ref[1];

        if (isUndefined(previousValue) && listLength === 1) {
          return currentValue;
        }

        return fn(currentValue, previousValue);
      });
    });

    return reducer(resolveP(acc), iterable);
  });
});

/**
 * Returns the elements of the given list or string (or object with a slice method)
 * from fromIndex (inclusive).
 * Dispatches to the slice method of the second argument, if present.
 *
 * @func sliceFrom
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.16.0|v1.16.0}
 * @category List
 * @sig  Number -> [a] -> [a]
 * @param {number} fromIndex The start index (inclusive)
 * @param {Array|string} list The list or string to slice
 * @return {Array|string} The sliced list or string
 * @see {@link http://ramdajs.com/docs/#slice|slice}, {@link RA.sliceTo|sliceTo}
 * @example
 *
 * RA.sliceFrom(1, [1, 2, 3]); //=> [2, 3]
 */
var sliceFrom = /*#__PURE__*/_ramda.slice(_ramda.__, Infinity);

/**
 * Returns the elements of the given list or string (or object with a slice method)
 * to toIndex (exclusive).
 * Dispatches to the slice method of the second argument, if present.
 *
 * @func sliceTo
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.16.0|v1.16.0}
 * @category List
 * @sig  Number -> [a] -> [a]
 * @param {number} toIndex The end index (exclusive)
 * @param {Array|string} list The list or string to slice
 * @return {Array|string} The sliced list or string
 * @see {@link http://ramdajs.com/docs/#slice|slice}, {@link RA.sliceFrom|sliceFrom}
 * @example
 *
 * RA.sliceTo(2, [1, 2, 3]); //=> [1, 2]
 */
var sliceTo = /*#__PURE__*/_ramda.slice(0);

// helpers
var rejectIndexed = /*#__PURE__*/_ramda.addIndex(_ramda.reject);
var containsIndex$1 = /*#__PURE__*/_ramda.curry(function (indexes, val, index) {
  return _ramda.contains(index, indexes);
});

/**
 * Returns a partial copy of an array omitting the indexes specified.
 *
 * @func omitIndexes
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category List
 * @sig [Int] -> [a] -> [a]
 * @see {@link http://ramdajs.com/docs/#omit|omit}, {@link RA.pickIndexes|pickIndexes}
 * @param {!Array} indexes The array of indexes to omit from the new array
 * @param {!Array} list The array to copy from
 * @return {!Array} The new array with omitted indexes
 * @example
 *
 * RA.omitIndexes([-1, 1, 3], ['a', 'b', 'c', 'd']); //=> ['a', 'c']
 */
var omitIndexes = /*#__PURE__*/_ramda.curry(function (indexes, list) {
  return rejectIndexed(containsIndex$1(indexes), list);
});

/**
 * Acts as multiple path: arrays of paths in, array of values out. Preserves order.
 *
 * @func paths
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.2.0|v1.2.0}
 * @category List
 * @sig  [[k]] -> {k: v} - [v]
 * @param {Array} ps The property paths to fetch
 * @param {Object} obj The object to query
 * @return {Array} The corresponding values or partially applied function
 * @see {@link https://github.com/ramda/ramda/wiki/Cookbook#derivative-of-rprops-for-deep-fields|Ramda Cookbook}, {@link http://ramdajs.com/docs/#props|props}
 * @example
 *
 * const obj = {
 *   a: { b: { c: 1 } },
 *   x: 2,
 * };
 *
 * RA.paths([['a', 'b', 'c'], ['x']], obj); //=> [1, 2]
 */
var paths = /*#__PURE__*/_ramda.curry(function (ps, obj) {
  return _ramda.ap([_ramda.path(_ramda.__, obj)], ps);
});

/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to logic of renaming function.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * @func renameKeysWith
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.5.0|v1.5.0}
 * @category Object
 * @sig (a -> b) -> {a: *} -> {b: *}
 * @param {Function} fn Function that renames the keys
 * @param {!Object} obj Provided object
 * @return {!Object} New object with renamed keys
 * @see {@link https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object-by-a-function|Ramda Cookbook}, {@link RA.renameKeys|renameKeys}
 * @example
 *
 * RA.renameKeysWith(R.concat('a'), { A: 1, B: 2, C: 3 }) //=> { aA: 1, aB: 2, aC: 3 }
 */
var renameKeysWith = /*#__PURE__*/_ramda.curry(function (fn, obj) {
  return _ramda.pipe(_ramda.toPairs, _ramda.map(_ramda.adjust(fn, 0)), _ramda.fromPairs)(obj);
});

var valueOrKey = function valueOrKey(keysMap) {
  return function (key) {
    if (_ramda.has(key, keysMap)) {
      return keysMap[key];
    }
    return key;
  };
};

/**
 * Creates a new object with the own properties of the provided object, but the
 * keys renamed according to the keysMap object as `{oldKey: newKey}`.
 * When some key is not found in the keysMap, then it's passed as-is.
 *
 * Keep in mind that in the case of keys conflict is behaviour undefined and
 * the result may vary between various JS engines!
 *
 * @func renameKeys
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.5.0|v1.5.0}
 * @category Object
 * @sig {a: b} -> {a: *} -> {b: *}
 * @param {!Object} keysMap
 * @param {!Object} obj
 * @return {!Object} New object with renamed keys
 * @see {@link https://github.com/ramda/ramda/wiki/Cookbook#rename-keys-of-an-object|Ramda Cookbook}, {@link RA.renameKeysWith|renameKeysWith}
 * @example
 *
 * const input = { firstName: 'Elisia', age: 22, type: 'human' };
 *
 * RA.renameKeys({ firstName: 'name', type: 'kind', foo: 'bar' })(input);
 * //=> { name: 'Elisia', age: 22, kind: 'human' }
 */
var renameKeys = /*#__PURE__*/_ramda.curry(function (keysMap, obj) {
  return renameKeysWith(valueOrKey(keysMap), obj);
});

/**
 * Create a new object with the own properties of the second object merged with
 * the own properties of the first object. If a key exists in both objects,
 * the value from the first object will be used. *
 * Putting it simply: it sets properties only if they don't exist.
 *
 * @func mergeRight
 * @aliases resetToDefault, defaults
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.6.0|v1.6.0}
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} r Destination
 * @param {Object} l Source
 * @return {Object}
 * @see {@link http://ramdajs.com/docs/#merge|merge}, {@link https://github.com/ramda/ramda/wiki/Cookbook#set-properties-only-if-they-dont-exist|Ramda Cookbook}
 * @example
 *
 * RA.mergeRight({ 'age': 40 }, { 'name': 'fred', 'age': 10 });
 * //=> { 'name': 'fred', 'age': 40 }
 */
var mergeRight = /*#__PURE__*/_ramda.flip(_ramda.merge);

/**
 * Functional equivalent of merging object properties with object spread operator.
 *
 * @func mergeProps
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.17.0|v1.17.0}
 * @category Object
 * @sig [k] -> {k: {a}} -> {a}
 * @see {@link RA.mergePaths|mergePaths}
 * @param {!Array} ps The property names to merge
 * @param {!Object} obj The object to query
 * @return {!Object} The object composed of merged properties of obj
 * @example
 *
 * const obj = {
 *   foo: { fooInner: 1 },
 *   bar: { barInner: 2 }
 * };
 *
 * { ...obj.foo, ...obj.bar }; //=> { fooInner: 1, barInner: 2 }
 * RA.mergeProps(['foo', 'bar'], obj); //=> { fooInner: 1, barInner: 2 }
 */
var mergeProps = /*#__PURE__*/_ramda.curryN(2, /*#__PURE__*/_ramda.pipe(_ramda.props, _ramda.mergeAll));

/**
 * Merge objects under corresponding paths.
 *
 * @func mergePaths
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.17.0|v1.17.0}
 * @category Object
 * @sig [[k]] -> {k: {a}} -> {a}
 * @see {@link RA.mergeProps|mergeProps}
 * @param {!Array} paths The property paths to merge
 * @param {!Object} obj The object to query
 * @return {!Object} The object composed of merged property paths of obj
 * @example
 *
 * const obj = {
 *   foo: { fooInner: { fooInner2: 1 } },
 *   bar: { barInner: 2 }
 * };
 *
 * { ...obj.foo.fooInner, ...obj.bar }; //=>  { fooInner2: 1, barInner: 2 }
 * RA.mergePaths([['foo', 'fooInner'], ['bar']], obj); //=> { fooInner2: 1, barInner: 2 }
 */
var mergePaths = /*#__PURE__*/_ramda.curryN(2, /*#__PURE__*/_ramda.pipe(paths, _ramda.mergeAll));

/**
 * Create a new object with the own properties of the object under the `path`
 * merged with the own properties of the provided `source`.
 * If a key exists in both objects, the value from the `source` object will be used.
 *
 * @func mergePath
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.18.0|v1.18.0}
 * @category Object
 * @sig [k] -> {a} -> {k: {a}} -> {k: {a}}
 * @see {@link RA.mergeProp|mergeProp}
 * @param {!Array} path The property path of the destination object
 * @param {!Object} source The source object
 * @param {!Object} obj The object that has destination object under corresponding property path
 * @return {!Object} The new version of object
 * @example
 *
 * RA.mergePath(
 *  ['outer', 'inner'],
 *  { foo: 3, bar: 4 },
 *  { outer: { inner: { foo: 2 } } }
 * ); //=> { outer: { inner: { foo: 3, bar: 4 } }
 */
var mergePath = /*#__PURE__*/_ramda.curry(function (path$$1, source, obj) {
  return _ramda.over(_ramda.lensPath(path$$1), mergeRight(source), obj);
});

/**
 * Create a new object with the own properties of the object under the `p`
 * merged with the own properties of the provided `source`.
 * If a key exists in both objects, the value from the `source` object will be used.
 *
 * @func mergeProp
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.18.0|v1.18.0}
 * @category Object
 * @sig [k] -> {a} -> {k: {a}} -> {k: {a}}
 * @see {@link RA.mergePath|mergePath}
 * @param {!Array} p The property of the destination object
 * @param {!Object} source The source object
 * @param {!Object} obj The object that has destination object under corresponding property
 * @return {!Object} The new version of object
 * @example
 *
 * RA.mergeProp(
 *  'outer',
 *  { foo: 3, bar: 4 },
 *  { outer: { foo: 2 } }
 * ); //=> { outer: { foo: 3, bar: 4 } };
 */
var mergeProp = /*#__PURE__*/_ramda.curry(function (p, subj, obj) {
  return mergePath(_ramda.of(p), subj, obj);
});

/**
 * Returns a "view" of the given data structure, determined by the given lens.
 * The lens's focus determines which portion of the data structure is visible.
 * Returns the defaultValue if "view" is null, undefined or NaN; otherwise the "view" is returned.
 *
 * @func viewOr
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|1.13.0}
 * @category Object
 * @typedef Lens s b = Functor f => (b -> f b) -> s -> f s
 * @sig a -> Lens s b -> s -> b | a
 * @see {@link http://ramdajs.com/docs/#view|view}
 * @param {*} defaultValue The default value
 * @param {Function} lens Van Laarhoven lens
 * @param {*} data The data structure
 * @returns {*} "view" or defaultValue
 *
 * @example
 *
 * RA.viewOr('N/A', R.lensProp('x'), {}); // => 'N/A'
 * RA.viewOr('N/A', R.lensProp('x'), { x: 1 }); // => 1
 * RA.viewOr('some', R.lensProp('y'), { y: null }); // => 'some'
 * RA.viewOr('some', R.lensProp('y'), { y: false }); // => false
 */

var viewOr = /*#__PURE__*/_ramda.curryN(3, function (defaultValue, lens, data) {
  return _ramda.defaultTo(defaultValue, _ramda.view(lens, data));
});

/**
 * Returns whether or not an object has an own property with the specified name at a given path.
 *
 * @func hasPath
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.14.0|v1.14.0}
 * @category Object
 * @typedef Idx = String | Int
 * @sig [Idx] -> {a} -> Boolean
 * @param {Array.<string|number>} path The path of the nested property
 * @param {Object} obj The object to test
 * @return {Boolean}
 * @see {@link http://ramdajs.com/docs/#has|has}
 * @example
 *
 * RA.hasPath(['a', 'b'], { a: { b: 1 } }); //=> true
 * RA.hasPath(['a', 'b', 'c'], { a: { b: 1 } }); //=> false
 * RA.hasPath(['a', 'b'], { a: { } }); //=> false
 * RA.hasPath([0], [1, 2]); //=> true
 */
var hasPath = /*#__PURE__*/_ramda.curryN(2, function (objPath, obj) {
  var prop$$1 = _ramda.head(objPath);

  // termination conditions
  if (_ramda.length(objPath) === 0 || !isObj(obj)) {
    return false;
  } else if (_ramda.length(objPath) === 1) {
    return _ramda.has(prop$$1, obj);
  }

  return hasPath(_ramda.tail(objPath), _ramda.path([prop$$1], obj)); // base case
});

/**
 * Spreads object under property path onto provided object.
 * It's like {@link RA.flattenPath|flattenPath}, but removes object under the property path.
 *
 * @func spreadPath
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Object
 * @typedef Idx = String | Int
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {!Array.<string|number>} path The property path to spread
 * @param {!Object} obj The provided object
 * @return {!Object} The result of the spread
 * @see {@link RA.spreadProp|spreadProp}, {@link RA.flattenPath|flattenPath}
 * @example
 *
 * RA.spreadPath(
 *   ['b1', 'b2'],
 *   { a: 1, b1: { b2: { c: 3, d: 4 } } }
 * ); // => { a: 1, c: 3, d: 4, b1: {} };
 */
var spreadPath = /*#__PURE__*/_ramda.curryN(2, /*#__PURE__*/_ramda.converge(_ramda.merge, [_ramda.dissocPath, /*#__PURE__*/_ramda.pathOr({})]));

/**
 * Spreads object under property onto provided object.
 * It's like {@link RA.flattenProp|flattenProp}, but removes object under the property.
 *
 * @func spreadProp
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Object
 * @typedef Idx = String | Int
 * @sig Idx -> {k: v} -> {k: v}
 * @param {!string|number} prop The property to spread
 * @param {!Object} obj The provided object
 * @return {!Object} The result of the spread
 * @see {@link RA.spreadPath|spreadPath}, {@link RA.flattenProp|flattenProp}
 * @example
 *
 * RA.spreadProp('b', { a: 1, b: { c: 3, d: 4 } }); // => { a: 1, c: 3, d: 4 };
 */
var spreadProp = /*#__PURE__*/_ramda.curry(function (prop$$1, obj) {
  return spreadPath(_ramda.of(prop$$1), obj);
});

/**
 * Flattens a property path so that its fields are spread out into the provided object.
 * It's like {@link RA.spreadPath|spreadPath}, but preserves object under the property path.
 *
 * @func flattenPath
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Object
 * @typedef Idx = String | Int
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {!Array.<string|number>} path The property path to flatten
 * @param {!Object} obj The provided object
 * @return {!Object} The flattened object
 * @see {@link RA.flattenProp|flattenProp}, {@link RA.spreadPath|spreadPath}
 * @example
 *
 * RA.flattenPath(
 *   ['b1', 'b2'],
 *   { a: 1, b1: { b2: { c: 3, d: 4 } } }
 * ); // => { a: 1, c: 3, d: 4, b1: { b2: { c: 3, d: 4 } } };
 */
var flattenPath = /*#__PURE__*/_ramda.curry(function (path$$1, obj) {
  return _ramda.merge(obj, _ramda.pathOr({}, path$$1, obj));
});

/**
 * Flattens a property so that its fields are spread out into the provided object.
 * It's like {@link RA.spreadProp|spreadProp}, but preserves object under the property path.
 *
 * @func flattenProp
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|v1.19.0}
 * @category Object
 * @typedef Idx = String | Int
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {!string|number} prop The property to flatten
 * @param {!Object} obj The provided object
 * @return {!Object} The flattened object
 * @see {@link RA.flattenPath|flattenPath}, {@link RA.spreadProp|spreadProp}
 * @example
 *
 * RA.flattenProp(
 *   'b',
 *   { a: 1, b: { c: 3, d: 4 } }
 * ); // => { a: 1, c: 3, d: 4, b: { c: 3, d: 4 } };
 */
var flattenProp = /*#__PURE__*/_ramda.curry(function (prop$$1, obj) {
  return flattenPath(_ramda.of(prop$$1), obj);
});

/**
 * Returns `true` if data structure focused by the given lens equals provided value.
 *
 * @func lensEq
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|1.13.0}
 * @category Relation
 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig  Lens s a -> b -> s -> Boolean
 * @see {@link RA.lensNotEq|lensNotEq}
 * @param {function} lens Van Laarhoven lens
 * @param {*} value The value to compare the focused data structure with
 * @param {*} data The data structure
 * @return {Boolean} `true` if the focused data structure equals value, `false` otherwise
 *
 * @example
 *
 * RA.lensEq(R.lensIndex(0), 1, [0, 1, 2]); // => false
 * RA.lensEq(R.lensIndex(1), 1, [0, 1, 2]); // => true
 * RA.lensEq(R.lensPath(['a', 'b']), 'foo', { a: { b: 'foo' } }) // => true
 */
var lensEq = /*#__PURE__*/_ramda.curryN(3, function (lens, val, data) {
  return _ramda.pipe(_ramda.view(lens), _ramda.equals(val))(data);
});

/**
 * Returns `true` if data structure focused by the given lens doesn't equal provided value.
 *
 * @func lensNotEq
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|1.13.0}
 * @category Relation
 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> b -> s -> Boolean
 * @see {@link RA.lensEq|lensEq}
 * @param {function} lens Van Laarhoven lens
 * @param {*} value The value to compare the focused data structure with
 * @param {*} data The data structure
 * @return {Boolean} `false` if the focused data structure equals value, `true` otherwise
 *
 * @example
 *
 * RA.lensNotEq(R.lensIndex(0), 1, [0, 1, 2]); // => true
 * RA.lensNotEq(R.lensIndex(1), 1, [0, 1, 2]); // => false
 * RA.lensNotEq(R.lensPath(['a', 'b']), 'foo', { a: { b: 'foo' } }) // => false
 */
var lensNotEq = /*#__PURE__*/_ramda.complement(lensEq);

/**
 * Returns `true` if data structure focused by the given lens satisfies the predicate.
 * Note that the predicate is expected to return boolean value and will be evaluated
 * as `false` unless the predicate returns `true`.
 *
 * @func lensSatisfies
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|1.13.0}
 * @category Relation
 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig  Boolean b => (a -> b) -> Lens s a -> s -> b
 * @see {@link RA.lensNotSatisfy|lensNotSatisfy}
 * @param {Function} predicate The predicate function
 * @param {Function} lens Van Laarhoven lens
 * @param {*} data The data structure
 * @return {Boolean} `true` if the focused data structure satisfies the predicate, `false` otherwise
 *
 * @example
 *
 * RA.lensSatisfies(R.equals(true), R.lensIndex(0), [false, true, 1]); // => false
 * RA.lensSatisfies(R.equals(true), R.lensIndex(1), [false, true, 1]); // => true
 * RA.lensSatisfies(R.equals(true), R.lensIndex(2), [false, true, 1]); // => false
 * RA.lensSatisfies(R.identity, R.lensProp('x'), { x: 1 }); // => false
 */
var lensSatisfies = /*#__PURE__*/_ramda.curryN(3, function (predicate, lens, data) {
  return _ramda.pipe(_ramda.view(lens), predicate, _ramda.equals(true))(data);
});

/**
 * Returns `true` if data structure focused by the given lens doesn't satisfy the predicate.
 * Note that the predicate is expected to return boolean value.
 *
 * @func lensNotSatisfy
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.13.0|1.13.0}
 * @category Relation
 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig  Boolean b => (a -> b) -> Lens s a -> s -> b
 * @see {@link RA.lensSatisfies|lensSatisfies}
 * @param {Function} predicate The predicate function
 * @param {Function} lens Van Laarhoven lens
 * @param {*} data The data structure
 * @return {Boolean} `false` if the focused data structure satisfies the predicate, `true` otherwise
 *
 * @example
 *
 * RA.lensNotSatisfy(R.equals(true), R.lensIndex(0), [false, true, 1]); // => true
 * RA.lensNotSatisfy(R.equals(true), R.lensIndex(1), [false, true, 1]); // => false
 * RA.lensNotSatisfy(R.equals(true), R.lensIndex(2), [false, true, 1]); // => true
 * RA.lensNotSatisfy(R.identity, R.lensProp('x'), { x: 1 }); // => true
 */
var lensNotSatisfy = /*#__PURE__*/_ramda.complement(lensSatisfies);

// This implementation was highly inspired by the implementations
// in ramda-lens library.
//
// https://github.com/ramda/ramda-lens


// isomorphic :: ((a -> b), (b -> a)) -> Isomorphism
//     Isomorphism = x -> y
var isomorphic = function isomorphic(to, from) {
  var isomorphism = function isomorphism(x) {
    return to(x);
  };
  isomorphism.from = from;
  return isomorphism;
};

// isomorphisms :: ((a -> b), (b -> a)) -> (a -> b)
var isomorphisms = function isomorphisms(to, from) {
  return isomorphic(_ramda.curry(function (toFunctorFn, target) {
    return _ramda.map(from, toFunctorFn(to(target)));
  }), _ramda.curry(function (toFunctorFn, target) {
    return _ramda.map(to, toFunctorFn(from(target)));
  }));
};

// from :: Isomorphism -> a -> b
var from = /*#__PURE__*/_ramda.curry(function (isomorphism, x) {
  return isomorphism.from(x);
});

/**
 * Defines an isomorphism that will work like a lens. It takes two functions.
 * The function that converts and the function that recovers.
 *
 * @func lensIso
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/1.19.0|1.19.0}
 * @category Relation
 * @typedef Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> (a -> s) -> Lens s a
 * @param {!function} to The function that converts
 * @param {!function} from The function that recovers
 * @return {!function} The isomorphic lens
 * @see {@link http://ramdajs.com/docs/#lens|lens}
 *
 * @example
 *
 * const lensJSON = RA.lensIso(JSON.parse, JSON.stringify);
 *
 * R.over(lensJSON, assoc('b', 2), '{"a":1}'); //=> '{"a":1,"b":2}'
 * R.over(RA.lensIso.from(lensJSON), R.replace('}', ',"b":2}'), { a: 1 }); // => { a: 1, b: 2 }
 */
var lensIso = /*#__PURE__*/_ramda.curry(isomorphisms);
lensIso.from = from;

/**
 * Returns the second argument if predicate function returns `true`,
 * otherwise the third argument is returned.
 *
 * @func defaultWhen
 * @memberOf RA
 * @since {@link https://char0n.github.io/ramda-adjunct/2.2.0|v2.2.0}
 * @category Logic
 * @sig  (a -> Boolean) -> b -> a -> a | b
 * @param {!function} predicate The predicate function
 * @param {*} defaultVal The default value
 * @param {*} val `val` will be returned instead of `defaultVal` if predicate returns false
 * @return {*} The `val` if predicate returns `false`, otherwise the default value
 * @see {@link http://ramdajs.com/docs/#defaultTo|defaultTo}
 * @example
 *
 * RA.defaultWhen(RA.isNull, 1, null); // => 1
 * RA.defaultWhen(RA.isNull, 1, 2); // => 2
 */
var defaultWhen = /*#__PURE__*/_ramda.curry(function (predicate, defaultVal, val) {
  return predicate(val) ? defaultVal : val;
});

// type :: Monad a => a -> String
var type = /*#__PURE__*/_ramda.either( /*#__PURE__*/_ramda.path(['@@type']), /*#__PURE__*/_ramda.path(['constructor', '@@type']));

// typeEquals :: Monad a => String -> a -> Boolean
var typeEquals = /*#__PURE__*/_ramda.curry(function (typeIdent, monad) {
  return type(monad) === typeIdent;
});

// isSameType :: (Monad a, Monad b) => a -> b -> Boolean
var isSameType = /*#__PURE__*/_ramda.curryN(2, /*#__PURE__*/_ramda.useWith(_ramda.equals, [type, type]));

// isNotSameType :: (Monad a, Monad b) => a -> b -> Boolean
var isNotSameType = /*#__PURE__*/_ramda.complement(isSameType);

// aliases :: Prototype -> NewPrototypePairs
//     Prototype = Object
//     NewPrototypePairs = Array
var aliases$1 = /*#__PURE__*/_ramda.pipe(_ramda.toPairs, /*#__PURE__*/_ramda.map( /*#__PURE__*/_ramda.over( /*#__PURE__*/_ramda.lensIndex(0), /*#__PURE__*/_ramda.replace('fantasy-land/', ''))));

var _functorTrait;
var _applyTrait;
var _setoidTrait;
var _semigroupTrait;
var _chainTrait;
var _ordTrait;

var functorTrait = (_functorTrait = {}, _functorTrait[mapping.map] = function (fn) {
  return this.constructor[mapping.of](fn(this.value));
}, _functorTrait);

var applyTrait = (_applyTrait = {}, _applyTrait[mapping.ap] = function (applyWithFn) {
  var _this = this;

  return applyWithFn.map(function (fn) {
    return fn(_this.value);
  });
}, _applyTrait);

var setoidTrait = (_setoidTrait = {}, _setoidTrait[mapping.equals] = function (setoid) {
  return isSameType(this, setoid) && _ramda.equals(this.value, setoid.value);
}, _setoidTrait);

var semigroupTrait = (_semigroupTrait = {}, _semigroupTrait[mapping.concat] = function (semigroup) {
  var concatenatedValue = this.value;

  if (isString(this.value) || isNumber(this.value)) {
    concatenatedValue = this.value + semigroup.value;
  } else if (_ramda.pathSatisfies(isFunction, ['value', mapping.concat], this)) {
    concatenatedValue = this.value[mapping.concat](semigroup.value);
  } else if (_ramda.pathSatisfies(isFunction, ['value', 'concat'], this)) {
    concatenatedValue = this.value.concat(semigroup.value);
  }

  return this.constructor[mapping.of](concatenatedValue);
}, _semigroupTrait);

var chainTrait = (_chainTrait = {}, _chainTrait[mapping.chain] = function (fn) {
  var newChain = fn(this.value);

  return isSameType(this, newChain) ? newChain : this;
}, _chainTrait);

var ordTrait = (_ordTrait = {}, _ordTrait[mapping.lte] = function (ord) {
  return isSameType(this, ord) && (this.value < ord.value || this[mapping.equals](ord));
}, _ordTrait);

var _createClass$3 = /*#__PURE__*/ function () { function defineProperties(target, props$$1) { for (var i = 0; i < props$$1.length; i++) { var descriptor = props$$1[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// we do this here for jsdocs generate properly
var of$3 = mapping.of;
var ap$4 = mapping.ap;
var map$2 = mapping.map;
var equals$2 = mapping.equals;
var concat$2 = mapping.concat;
var chain$1 = mapping.chain;
var lte = mapping.lte;
var empty$2 = mapping.empty;
var contramap = mapping.contramap;

/**
 * The simplest {@link https://github.com/fantasyland/fantasy-land|fantasy-land}
 * compatible monad which attaches no information to values.
 *
 * The Identity type is a very simple type that has no interesting side effects and
 * is effectively just a container of some value. So why does it exist ?
 * The Identity type is often used as the base monad of a monad
 * transformer when no other behaviour is required.
 *
 * @memberOf RA
 * @implements
 * {@link https://github.com/fantasyland/fantasy-land#apply|Apply},
 * {@link https://github.com/fantasyland/fantasy-land#applicative|Applicative},
 * {@link https://github.com/fantasyland/fantasy-land#functor|Functor},
 * {@link https://github.com/fantasyland/fantasy-land#setoid|Setoid},
 * {@link https://github.com/fantasyland/fantasy-land#semigroup|Semigroup},
 * {@link https://github.com/fantasyland/fantasy-land#chain|Chain},
 * {@link https://github.com/fantasyland/fantasy-land#monad|Monad},
 * {@link https://github.com/fantasyland/fantasy-land#ord|Ord},
 * {@link https://github.com/fantasyland/fantasy-land#monoid|Monoid*},
 * {@link https://github.com/fantasyland/fantasy-land#contravariant|Contravariant}
 * @since {@link https://char0n.github.io/ramda-adjunct/1.8.0|v1.8.0}
 */

var Identity = /*#__PURE__*/function () {
  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#applicative|Applicative} specification.
   *
   * @static
   * @sig of :: Applicative f => a -> f a
   * @param {*} value
   * @returns {RA.Identity}
   * @example
   *
   * const a = Identity.of(1); //=> Identity(1)
   */
  Identity[of$3] = function (value) {
    return new Identity(value);
  };

  /**
   * @static
   */


  _createClass$3(Identity, null, [{
    key: '@@type',
    get: function get() {
      return 'RA/Identity';
    }

    /**
     * Private constructor. Use {@link RA.Identity.of|Identity.of} instead.
     *
     * @private
     * @param {*} value
     * @return {RA.Identity}
     */

  }]);

  function Identity(value) {
    _classCallCheck$3(this, Identity);

    this.value = value;
  }

  /**
   * Catamorphism for a value.
   * @returns {*}
   * @example
   *
   * const a = Identity.of(1);
   * a.get(); //=> 1
   */


  Identity.prototype.get = function get() {
    return this.value;
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#apply|Apply} specification.
   *
   * @sig ap :: Apply f => f a ~> f (a -> b) -> f b
   * @param {RA.Identity} applyWithFn
   * @return {RA.Identity}
   * @example
   *
   * const a = Identity.of(1);
   * const b = Identity.of(1).map(a => b => a + b);
   *
   * a.ap(b); //=> Identity(2)
   */


  Identity.prototype[ap$4] = function (applyWithFn) {
    return applyTrait[ap$4].call(this, applyWithFn);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#functor|Functor} specification.
   *
   * @sig map :: Functor f => f a ~> (a -> b) -> f b
   * @param {Function} fn
   * @return {RA.Identity}
   * @example
   *
   * const a = Identity.of(1);
   * a.map(a => a + 1); //=> Identity(2)
   */


  Identity.prototype[map$2] = function (fn) {
    return functorTrait[map$2].call(this, fn);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#setoid|Setoid} specification.
   *
   * @sig equals :: Setoid a => a ~> a -> Boolean
   * @param {RA.Identity} setoid
   * @return {boolean}
   * @example
   *
   * const a = Identity.of(1);
   * const b = Identity.of(1);
   * const c = Identity.of(2);
   *
   * a.equlas(b); //=> true
   * a.equals(c); //=> false
   */


  Identity.prototype[equals$2] = function (setoid) {
    return setoidTrait[equals$2].call(this, setoid);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#semigroup|Semigroup} specification.
   *
   * @sig concat :: Semigroup a => a ~> a -> a
   * @param {RA.Identity} semigroup
   * @return {RA.Identity}
   * @example
   *
   * const a = Identity.of(1);
   * const b = Identity.of(1);
   * a.concat(b); //=> 2
   *
   * const c = Identity.of('c');
   * const d = Identity.of('d');
   * c.concat(d); //=> 'cd'
   *
   * const e = Identity.of(['e']);
   * const f = Identity.of(['f']);
   * e.concat(f); //=> ['e', 'f']
   */


  Identity.prototype[concat$2] = function (semigroup) {
    return semigroupTrait[concat$2].call(this, semigroup);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#chain|Chain} specification.
   *
   * @sig chain :: Chain m => m a ~> (a -> m b) -> m b
   * @param {Function} fn Function returning the value of the same {@link https://github.com/fantasyland/fantasy-land#semigroup|Chain}
   * @return {RA.Identity}
   * @example
   *
   * const a = Identity.of(1);
   * const fn = val => Identity.of(val + 1);
   *
   * a.chain(fn).chain(fn); //=> Identity(3)
   */


  Identity.prototype[chain$1] = function (fn) {
    return chainTrait[chain$1].call(this, fn);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#ord|Ord} specification.
   *
   * @sig lte :: Ord a => a ~> a -> Boolean
   * @param {RA.Identity} ord
   * @return {boolean}
   * @example
   *
   * const a = Identity.of(1);
   * const b = Identity.of(1);
   * const c = Identity.of(2);
   *
   * a.lte(b); //=> true
   * a.lte(c); //=> true
   * c.lte(a); //=> false
   */


  Identity.prototype[lte] = function (ord) {
    return ordTrait[lte].call(this, ord);
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#monoid|Monoid*} specification.
   * Partial implementation of Monoid specification. `empty` method on instance only, returning
   * identity value of the wrapped type. Using `R.empty` under the hood.
   *
   *
   * @sig empty :: Monoid m => () -> m
   * @return {RA.Identity}
   * @example
   *
   * const a = Identity.of('test');
   * const i = a.empty();
   *
   * a.concat(i); //=> Identity('string');
   * i.concat(a); //=> Identity('string');
   */


  Identity.prototype[empty$2] = function () {
    return this.constructor.of(_ramda.empty(this.value));
  };

  /**
   * Fantasy land {@link https://github.com/fantasyland/fantasy-land#contravariant|Contravariant} specification.
   *
   * @sig contramap :: Contravariant f => f a ~> (b -> a) -> f b
   * @param {Function} fn
   * @return {RA.Identity}
   * @example
   *
   * const identity = a => a;
   * const add1 = a => a + 1;
   * const divide2 = a => a / 2;
   *
   * Identity.of(divide2).contramap(add1).get()(3); //=> 2
   * Identity.of(identity).contramap(divide2).contramap(add1).get()(3); //=> 2
   * Identity.of(identity).contramap(a => divide2(add1(a))).get()(3); //=> 2
   */


  Identity.prototype[contramap] = function (fn) {
    var _this = this;

    return this.constructor.of(function (value) {
      return _this.value(fn(value));
    });
  };

  return Identity;
}();

aliases$1(Identity).forEach(function (_ref) {
  var alias = _ref[0],
      fn = _ref[1];

  Identity[alias] = fn;
});
aliases$1(Identity.prototype).forEach(function (_ref2) {
  var alias = _ref2[0],
      fn = _ref2[1];

  Identity.prototype[alias] = fn;
});

/**
 * @namespace RA
 */

// Type


var _ramdaAdjunct = Object.freeze({
	isNotUndefined: isNotUndefined,
	isUndefined: isUndefined,
	isNull: isNull,
	isNotNull: isNotNull,
	isNotNil: isNotNil,
	isArray: isArray,
	isNotArray: isNotArray,
	isBoolean: isBoolean,
	isNotBoolean: isNotBoolean,
	isNotEmpty: isNotEmpty,
	isNilOrEmpty: isNilOrEmpty,
	isString: isString,
	isNotString: isNotString,
	isArrayLike: isArrayLike,
	isNotArrayLike: isNotArrayLike,
	isGeneratorFunction: isGeneratorFunction,
	isNotGeneratorFunction: isNotGeneratorFunction,
	isAsyncFunction: isAsyncFunction,
	isNotAsyncFunction: isNotAsyncFunction,
	isFunction: isFunction,
	isNotFunction: isNotFunction,
	isObj: isObj,
	isObject: isObj,
	isNotObj: isNotObj,
	isNotObject: isNotObj,
	isObjLike: isObjLike,
	isObjectLike: isObjLike,
	isNotObjLike: isNotObjLike,
	isNotObjectLike: isNotObjLike,
	isPlainObj: isPlainObj,
	isPlainObject: isPlainObj,
	isNotPlainObj: isNotPlainObj,
	isNotPlainObject: isNotPlainObj,
	isDate: isDate,
	isNotDate: isNotDate,
	isValidDate: isValidDate,
	isNotValidDate: isNotValidDate,
	isInvalidDate: isNotValidDate,
	isNumber: isNumber,
	isNotNumber: isNotNumber,
	isPositive: isPositive,
	isNegative: isNegative,
	isNaN: _isNaN,
	isNotNaN: isNotNaN,
	isFinite: _isFinite,
	isNotFinite: isNotFinite,
	isInteger: isInteger,
	isNotInteger: isNotInteger,
	isFloat: isFloat,
	isNotFloat: isNotFloat,
	isValidNumber: isValidNumber,
	isNotValidNumber: isNotValidNumber,
	isOdd: isOdd,
	isEven: isEven,
	isPair: isPair,
	isNotPair: isNotPair,
	isThenable: isThenable,
	isPromise: isPromise,
	isTruthy: isTruthy,
	isFalsy: isFalsy,
	stubUndefined: stubUndefined,
	stubNull: stubNull,
	stubObj: stubObj,
	stubObject: stubObj,
	stubString: stubString,
	stubArray: stubArray,
	noop: noop$2,
	liftFN: liftFN,
	liftF: liftF,
	cata: catamorphism,
	weave: weave,
	weaveLazy: weaveLazy,
	curryRightN: curryRightN,
	curryRight: curryRight,
	resolveP: resolveP,
	rejectP: rejectP,
	pickIndexes: pickIndexes,
	list: list,
	concatRight: concatRight,
	reduceP: reduceP,
	reduceRightP: reduceRightP,
	sliceFrom: sliceFrom,
	sliceTo: sliceTo,
	omitIndexes: omitIndexes,
	paths: paths,
	renameKeys: renameKeys,
	renameKeysWith: renameKeysWith,
	mergeRight: mergeRight,
	resetToDefault: mergeRight,
	mergeProps: mergeProps,
	mergePaths: mergePaths,
	mergeProp: mergeProp,
	mergePath: mergePath,
	viewOr: viewOr,
	hasPath: hasPath,
	spreadProp: spreadProp,
	spreadPath: spreadPath,
	flattenProp: flattenProp,
	flattenPath: flattenPath,
	lensEq: lensEq,
	lensNotEq: lensNotEq,
	lensSatisfies: lensSatisfies,
	lensNotSatisfy: lensNotSatisfy,
	lensIso: lensIso,
	defaultWhen: defaultWhen,
	Identity: Identity
});

var allOfValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});









var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;


var toErr = (0, _ramda__default.compose)(Failure, (0, _ramda__default.flip)(_ramda__default.append)([]), (0, _ramda__default.when)(_ramdaAdjunct.isArray, messages.andErrorMessages));

exports.default = function (validators) {
  return function (o) {
    return (0, _ramda__default.reduce)(function (acc, validator) {
      return acc.concat(validator(o));
    }, Success(o), validators).orElse(toErr);
  };
};
});

unwrapExports(allOfValidator);

var orValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



var _anyOfValidator2 = _interopRequireDefault(anyOfValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (validator1, validator2) {
  return function (o) {
    return (0, _anyOfValidator2.default)([validator1, validator2])(o);
  };
};
});

unwrapExports(orValidator);

var andValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



var _allOfValidator2 = _interopRequireDefault(allOfValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (validator1, validator2) {
  return function (o) {
    return (0, _allOfValidator2.default)([validator1, validator2])(o);
  };
};
});

unwrapExports(andValidator);

var _const$3 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
// eslint-disable-next-line import/prefer-default-export
var UNITS = exports.UNITS = Object.freeze({
  EM: 'em',
  REM: 'rem',
  PX: 'px',
  DPI: 'dpi',
  PERCENT: '%'
});
});

unwrapExports(_const$3);
var _const_1$1 = _const$3.UNITS;

var predicates = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnitRemOrEm = exports.isAspectRatioString = exports.isNumberWithPercent = exports.isNumberWithDpi = exports.isNumberWithRem = exports.isNumberWithEm = exports.isNumberWithPx = exports.isNumberWithUnit = exports.isValidPositiveNumber = exports.isValidNumber = undefined;







var isValidNumber = exports.isValidNumber = (0, _ramda__default.either)(_ramdaAdjunct.isFloat, _ramdaAdjunct.isInteger);
var isValidPositiveNumber = exports.isValidPositiveNumber = (0, _ramda__default.both)(isValidNumber, (0, _ramda__default.gt)(_ramda__default.__, 0));

var isNumberWithUnit = exports.isNumberWithUnit = (0, _ramda__default.curry)(function (units, value) {
  var regex = '^-?\\d+(?:.\\d+)?(?:' + (0, _ramda__default.join)('|', units) + ')$';
  return new RegExp(regex).test(value);
});
var isNumberWithPx = exports.isNumberWithPx = isNumberWithUnit([_const$3.UNITS.PX]);
var isNumberWithEm = exports.isNumberWithEm = isNumberWithUnit([_const$3.UNITS.EM]);
var isNumberWithRem = exports.isNumberWithRem = isNumberWithUnit([_const$3.UNITS.REM]);
var isNumberWithDpi = exports.isNumberWithDpi = isNumberWithUnit([_const$3.UNITS.DPI]);
var isNumberWithPercent = exports.isNumberWithPercent = isNumberWithUnit([_const$3.UNITS.PERCENT]);
var isAspectRatioString = exports.isAspectRatioString = (0, _ramda__default.test)(/^[1-9]+[0-9]* ?\/ ?[1-9]+[0-9]*$/);

var isUnitRemOrEm = exports.isUnitRemOrEm = (0, _ramda__default.contains)(_ramda__default.__, [_const$3.UNITS.EM, _const$3.UNITS.REM]);
});

unwrapExports(predicates);
var predicates_1 = predicates.isUnitRemOrEm;
var predicates_2 = predicates.isAspectRatioString;
var predicates_3 = predicates.isNumberWithPercent;
var predicates_4 = predicates.isNumberWithDpi;
var predicates_5 = predicates.isNumberWithRem;
var predicates_6 = predicates.isNumberWithEm;
var predicates_7 = predicates.isNumberWithPx;
var predicates_8 = predicates.isNumberWithUnit;
var predicates_9 = predicates.isValidPositiveNumber;
var predicates_10 = predicates.isValidNumber;

var parse = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unitPartOfUnitedNumber = exports.numericPartOfUnitedNumber = exports.elementsOfUnitedNumber = undefined;



var elementsOfUnitedNumber = exports.elementsOfUnitedNumber = function elementsOfUnitedNumber(value) {
  var captures = /^(-?\d+(?:.\d+)?)([a-z]+)?$/.exec(value);
  if (!captures || (0, _ramda__default.any)(_ramda__default.isNil, [captures, captures[1], captures[2]])) {
    throw new Error('Supplied value was not a number with a unit: \'' + value + '\'');
  }
  return [Number(captures[1]), captures[2]];
};

var numericPartOfUnitedNumber = exports.numericPartOfUnitedNumber = (0, _ramda__default.compose)((0, _ramda__default.view)((0, _ramda__default.lensIndex)(0)), elementsOfUnitedNumber);

var unitPartOfUnitedNumber = exports.unitPartOfUnitedNumber = (0, _ramda__default.compose)((0, _ramda__default.view)((0, _ramda__default.lensIndex)(1)), elementsOfUnitedNumber);
});

unwrapExports(parse);
var parse_1 = parse.unitPartOfUnitedNumber;
var parse_2 = parse.numericPartOfUnitedNumber;
var parse_3 = parse.elementsOfUnitedNumber;

var convert = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unitedDimensionToUnitlessPixelValue = exports.remOrEmToPxValue = exports.pxToRemOrEmValue = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();







var pxToRemOrEmValue = exports.pxToRemOrEmValue = function pxToRemOrEmValue(value, baseFontSize) {
  return (0, _ramda__default.divide)(value, baseFontSize);
};

var remOrEmToPxValue = exports.remOrEmToPxValue = function remOrEmToPxValue(value, baseFontSize) {
  return (0, _ramda__default.multiply)(value, baseFontSize);
};

var unitedDimensionToUnitlessPixelValue = exports.unitedDimensionToUnitlessPixelValue = function unitedDimensionToUnitlessPixelValue(value, baseFontSize) {
  var _elementsOfUnitedNumb = (0, parse.elementsOfUnitedNumber)(value),
      _elementsOfUnitedNumb2 = _slicedToArray(_elementsOfUnitedNumb, 2),
      number = _elementsOfUnitedNumb2[0],
      unit = _elementsOfUnitedNumb2[1];

  return (0, predicates.isUnitRemOrEm)(unit) ? remOrEmToPxValue(number, baseFontSize) : number;
};
});

unwrapExports(convert);
var convert_1 = convert.unitedDimensionToUnitlessPixelValue;
var convert_2 = convert.remOrEmToPxValue;
var convert_3 = convert.pxToRemOrEmValue;

var utils$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendUnit = undefined;



// eslint-disable-next-line import/prefer-default-export
var appendUnit = exports.appendUnit = (0, _ramda__default.curry)(function (value, unit) {
  return (0, _ramda__default.join)('', [value, unit]);
});
});

unwrapExports(utils$2);
var utils_1$1 = utils$2.appendUnit;

var output = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outputWithUnit = undefined;







// eslint-disable-next-line import/prefer-default-export
var outputWithUnit = exports.outputWithUnit = function outputWithUnit(unit, baseFontSize, value) {
  return (0, utils$2.appendUnit)((0, predicates.isUnitRemOrEm)(unit) ? (0, convert.pxToRemOrEmValue)(value, baseFontSize) : value, unit);
};
});

unwrapExports(output);
var output_1 = output.outputWithUnit;

var lib$1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendUnit = exports.isUnitRemOrEm = exports.isAspectRatioString = exports.isNumberWithPercent = exports.isNumberWithDpi = exports.isNumberWithRem = exports.isNumberWithEm = exports.isNumberWithPx = exports.isNumberWithUnit = exports.isValidPositiveNumber = exports.isValidNumber = exports.unitPartOfUnitedNumber = exports.numericPartOfUnitedNumber = exports.elementsOfUnitedNumber = exports.outputWithUnit = exports.unitedDimensionToUnitlessPixelValue = exports.remOrEmToPxValue = exports.pxToRemOrEmValue = exports.UNITS = undefined;













exports.UNITS = _const$3.UNITS;
exports.pxToRemOrEmValue = convert.pxToRemOrEmValue;
exports.remOrEmToPxValue = convert.remOrEmToPxValue;
exports.unitedDimensionToUnitlessPixelValue = convert.unitedDimensionToUnitlessPixelValue;
exports.outputWithUnit = output.outputWithUnit;
exports.elementsOfUnitedNumber = parse.elementsOfUnitedNumber;
exports.numericPartOfUnitedNumber = parse.numericPartOfUnitedNumber;
exports.unitPartOfUnitedNumber = parse.unitPartOfUnitedNumber;
exports.isValidNumber = predicates.isValidNumber;
exports.isValidPositiveNumber = predicates.isValidPositiveNumber;
exports.isNumberWithUnit = predicates.isNumberWithUnit;
exports.isNumberWithPx = predicates.isNumberWithPx;
exports.isNumberWithEm = predicates.isNumberWithEm;
exports.isNumberWithRem = predicates.isNumberWithRem;
exports.isNumberWithDpi = predicates.isNumberWithDpi;
exports.isNumberWithPercent = predicates.isNumberWithPercent;
exports.isAspectRatioString = predicates.isAspectRatioString;
exports.isUnitRemOrEm = predicates.isUnitRemOrEm;
exports.appendUnit = utils$2.appendUnit;
});

unwrapExports(lib$1);
var lib_1$1 = lib$1.appendUnit;
var lib_2$1 = lib$1.isUnitRemOrEm;
var lib_3$1 = lib$1.isAspectRatioString;
var lib_4$1 = lib$1.isNumberWithPercent;
var lib_5$1 = lib$1.isNumberWithDpi;
var lib_6$1 = lib$1.isNumberWithRem;
var lib_7$1 = lib$1.isNumberWithEm;
var lib_8$1 = lib$1.isNumberWithPx;
var lib_9$1 = lib$1.isNumberWithUnit;
var lib_10$1 = lib$1.isValidPositiveNumber;
var lib_11 = lib$1.isValidNumber;
var lib_12 = lib$1.unitPartOfUnitedNumber;
var lib_13 = lib$1.numericPartOfUnitedNumber;
var lib_14 = lib$1.elementsOfUnitedNumber;
var lib_15 = lib$1.outputWithUnit;
var lib_16 = lib$1.unitedDimensionToUnitlessPixelValue;
var lib_17 = lib$1.remOrEmToPxValue;
var lib_18 = lib$1.pxToRemOrEmValue;
var lib_19 = lib$1.UNITS;

var predicateValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;

exports.default = function (errorMessage, predicate) {
  return function (o) {
    return predicate(o) ? Success(o) : Failure([errorMessage]);
  };
};
});

unwrapExports(predicateValidator);

var numberWithUnitValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _predicateValidator2 = _interopRequireDefault(predicateValidator);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a type validator
exports.default = function (unit) {
  return (0, _predicateValidator2.default)((0, messages.numberWithUnitErrorMessage)(unit), (0, lib$1.isNumberWithUnit)([unit]));
};
});

unwrapExports(numberWithUnitValidator);

var applySuccessValueTo = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





exports.default = function (f) {
  return (0, _ramda__default.compose)(f, utils.propValue);
};
});

unwrapExports(applySuccessValueTo);

var chain$2 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _applySuccessValueTo2 = _interopRequireDefault(applySuccessValueTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (acc, f) {
  return acc.matchWith({
    Success: (0, _applySuccessValueTo2.default)(f),
    Failure: _ramda__default.identity
  });
};
});

unwrapExports(chain$2);

var untilFailureValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _chain2 = _interopRequireDefault(chain$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Success = folktale.validation.Success;

exports.default = function (validators) {
  return function (o) {
    return (0, _ramda__default.reduce)(_chain2.default, Success(o), validators);
  };
};
});

unwrapExports(untilFailureValidator);

var typeValidator = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



var _predicateValidator2 = _interopRequireDefault(predicateValidator);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (predicate, typeName) {
  var complement$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return (0, _predicateValidator2.default)((0, messages.typeErrorMessage)(typeName, complement$$1), predicate);
};
});

unwrapExports(typeValidator);

var validateIsFunction = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isFunction, _const.TYPES.Function);
});

unwrapExports(validateIsFunction);

var validateIsBoolean = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isBoolean, _const.TYPES.Boolean);
});

unwrapExports(validateIsBoolean);

var validateIsString = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isString, _const.TYPES.String);
});

unwrapExports(validateIsString);

var validateIsObject = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isPlainObj, _const.TYPES.Object);
});

unwrapExports(validateIsObject);

var validateIsArray = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isArray, _const.TYPES.Array);
});

unwrapExports(validateIsArray);

var wrapFailureMessageWith = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var Failure = folktale.validation.Failure;

exports.default = function (messageWrapper) {
  return (0, _ramda__default.compose)(Failure, _ramda__default.of, messageWrapper, utils.propValue);
};
});

unwrapExports(wrapFailureMessageWith);

var validateArrayElements = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});









var _wrapFailureMessageWith2 = _interopRequireDefault(wrapFailureMessageWith);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;


var validateAllWith = function validateAllWith(validator) {
  return function (o) {
    return (0, _ramda__default.reduce)(function (acc, element) {
      return acc.concat(validator(element).orElse(function (message) {
        return Failure([(0, messages.arrayElementErrorMessage)(element, message)]);
      }));
    }, Success(), o);
  };
};

exports.default = function (validator) {
  return function (o) {
    var v = validateAllWith(validator);
    var validation = v(o);
    return validation.matchWith({
      Success: (0, _ramda__default.always)(Success(o)),
      Failure: (0, _wrapFailureMessageWith2.default)(messages.arrayElementsErrorMessage)
    });
  };
};
});

unwrapExports(validateArrayElements);

var validateIsArrayOf = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



var _untilFailureValidator2 = _interopRequireDefault(untilFailureValidator);



var _validateIsArray2 = _interopRequireDefault(validateIsArray);



var _validateArrayElements2 = _interopRequireDefault(validateArrayElements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (validator) {
  return (0, _untilFailureValidator2.default)([_validateIsArray2.default, (0, _validateArrayElements2.default)(validator)]);
};
});

unwrapExports(validateIsArrayOf);

var validateIsUndefined = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isUndefined, _const.TYPES.Undefined);
});

unwrapExports(validateIsUndefined);

var validateIsNotUndefined = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _typeValidator2 = _interopRequireDefault(typeValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _typeValidator2.default)(_ramdaAdjunct.isNotUndefined, _const.TYPES.Undefined, true);
});

unwrapExports(validateIsNotUndefined);

var validateIsValidNumber = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _predicateValidator2 = _interopRequireDefault(predicateValidator);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _predicateValidator2.default)((0, messages.validNumberErrorMessage)(), _ramdaAdjunct.isValidNumber);
});

unwrapExports(validateIsValidNumber);

var validateIsWhitelistedString = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;

exports.default = function (whitelist) {
  return function (o) {
    return (0, _ramda__default.contains)(o, whitelist) ? Success(o) : Failure([(0, messages.whitelistErrorMessage)(whitelist)]);
  };
};
});

unwrapExports(validateIsWhitelistedString);

var validateWhitelistedKeys = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;

exports.default = function (validKeys) {
  return function (o) {
    var collectInvalidKeys = (0, _ramda__default.compose)((0, _ramda__default.without)(validKeys), _ramda__default.keys);
    var invalidKeys = collectInvalidKeys(o);
    return (0, _ramda__default.isEmpty)(invalidKeys) ? Success(o) : Failure([(0, messages.invalidKeysErrorMessage)(invalidKeys)]);
  };
};
});

unwrapExports(validateWhitelistedKeys);

var validateRequiredKeys = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;

exports.default = function (requiredKeys) {
  return function (o) {
    var collectInvalidKeys = (0, _ramda__default.reject)((0, _ramda__default.flip)(_ramda__default.has)(o));
    var invalidKeys = collectInvalidKeys(requiredKeys);
    return (0, _ramda__default.isEmpty)(invalidKeys) ? Success(o) : Failure([(0, messages.missingRequiredKeyErrorMessage)(invalidKeys)]);
  };
};
});

unwrapExports(validateRequiredKeys);

var validateObjectValues = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();









var Success = folktale.validation.Success,
    _Failure = folktale.validation.Failure;


var validate = function validate(validatorsMap) {
  return function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        v = _ref2[1];

    var validator = validatorsMap[name];

    return (0, _ramdaAdjunct.isNotUndefined)(validator) ? validator(v).matchWith({
      Success: (0, _ramda__default.always)(acc),
      Failure: function Failure(_ref3) {
        var value = _ref3.value;
        return acc.concat(_Failure([(0, messages.valueErrorMessage)(name)(value)]));
      }
    }) : acc;
  };
};

exports.default = function (validatorsMap) {
  return function (o) {
    return (0, _ramda__default.compose)((0, _ramda__default.reduce)(validate(validatorsMap), Success(o)), _ramda__default.toPairs)(o).orElse(function (message) {
      return _Failure([(0, messages.valuesErrorMessage)(message)]);
    });
  };
};
});

unwrapExports(validateObjectValues);

var validateIsNotEmpty = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var _predicateValidator2 = _interopRequireDefault(predicateValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _predicateValidator2.default)((0, messages.isEmptyErrorMessage)(), _ramdaAdjunct.isNotEmpty);
});

unwrapExports(validateIsNotEmpty);

var validateLengthGreaterThan = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _predicateValidator2 = _interopRequireDefault(predicateValidator);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use any Ramda relation that returns a boolean for numeric comparison
exports.default = function (stringLength) {
  return (0, _predicateValidator2.default)((0, messages.lengthGreaterThanErrorMessage)(stringLength), (0, _ramda__default.compose)((0, _ramda__default.flip)(_ramda__default.gt)(stringLength), _ramda__default.length));
};
});

unwrapExports(validateLengthGreaterThan);

var validateLengthLessThan = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _predicateValidator2 = _interopRequireDefault(predicateValidator);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use any Ramda relation that returns a boolean for numeric comparison
exports.default = function (stringLength) {
  return (0, _predicateValidator2.default)((0, messages.lengthLessThanErrorMessage)(stringLength), (0, _ramda__default.compose)((0, _ramda__default.flip)(_ramda__default.lt)(stringLength), _ramda__default.length));
};
});

unwrapExports(validateLengthLessThan);

var validateLengthBetween = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _untilFailureValidator2 = _interopRequireDefault(untilFailureValidator);



var _validateLengthGreaterThan2 = _interopRequireDefault(validateLengthGreaterThan);



var _validateLengthLessThan2 = _interopRequireDefault(validateLengthLessThan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _ramda__default.curry)(function (minimumLength, maximumLength) {
  return (0, _untilFailureValidator2.default)([(0, _validateLengthGreaterThan2.default)(minimumLength), (0, _validateLengthLessThan2.default)(maximumLength)]);
});
});

unwrapExports(validateLengthBetween);

var deepFreeze = function deepFreeze (o) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop$$1) {
    if (o.hasOwnProperty(prop$$1)
    && o[prop$$1] !== null
    && (typeof o[prop$$1] === "object" || typeof o[prop$$1] === "function")
    && !Object.isFrozen(o[prop$$1])) {
      deepFreeze(o[prop$$1]);
    }
  });
  
  return o;
};

var validateExclusiveKeys = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});







var Success = folktale.validation.Success,
    Failure = folktale.validation.Failure;

exports.default = function (exclusiveKeys) {
  return function (o) {
    var collectExclusiveKeys = (0, _ramda__default.filter)((0, _ramda__default.flip)(_ramda__default.has)(o));
    var collectedExclusiveKeys = collectExclusiveKeys(exclusiveKeys);
    return collectedExclusiveKeys.length <= 1 ? Success(o) : Failure([(0, messages.exclusiveKeyErrorMessage)(collectedExclusiveKeys)]);
  };
};
});

unwrapExports(validateExclusiveKeys);

var constraints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_NAMES = undefined;

var _nameField, _validatorField, _transformerField, _defaultValueField, _isRequiredField, _valueField, _childrenField, _fieldsValidatorField, _fieldsField;



var _deepFreeze2 = _interopRequireDefault(deepFreeze);



var _validateIsString2 = _interopRequireDefault(validateIsString);



var _validateIsBoolean2 = _interopRequireDefault(validateIsBoolean);



var _validateIsFunction2 = _interopRequireDefault(validateIsFunction);



var _validateIsNotUndefined2 = _interopRequireDefault(validateIsNotUndefined);



var _validateExclusiveKeys2 = _interopRequireDefault(validateExclusiveKeys);



var _validateIsObject2 = _interopRequireDefault(validateIsObject);



var _allOfValidator2 = _interopRequireDefault(allOfValidator);



var _validateIsArrayOf2 = _interopRequireDefault(validateIsArrayOf);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var FIELD_NAMES = exports.FIELD_NAMES = (0, utils.freeze)({
  FIELDS: 'fields',
  FIELDS_VALIDATOR: 'fieldsValidator',
  NAME: 'name',
  VALIDATOR: 'validator',
  TRANSFORMER: 'transformer',
  IS_REQUIRED: 'isRequired',
  DEFAULT_VALUE: 'defaultValue',
  VALUE: 'value',
  CHILDREN: 'children'
});

var FIELDS = FIELD_NAMES.FIELDS,
    FIELDS_VALIDATOR = FIELD_NAMES.FIELDS_VALIDATOR,
    NAME = FIELD_NAMES.NAME,
    VALIDATOR = FIELD_NAMES.VALIDATOR,
    TRANSFORMER = FIELD_NAMES.TRANSFORMER,
    IS_REQUIRED = FIELD_NAMES.IS_REQUIRED,
    DEFAULT_VALUE = FIELD_NAMES.DEFAULT_VALUE,
    VALUE = FIELD_NAMES.VALUE,
    CHILDREN = FIELD_NAMES.CHILDREN;


var nameField = (_nameField = {}, _defineProperty(_nameField, NAME, NAME), _defineProperty(_nameField, VALIDATOR, _validateIsString2.default), _defineProperty(_nameField, IS_REQUIRED, true), _nameField);

var validatorField = (_validatorField = {}, _defineProperty(_validatorField, NAME, VALIDATOR), _defineProperty(_validatorField, VALIDATOR, _validateIsFunction2.default), _defineProperty(_validatorField, IS_REQUIRED, true), _validatorField);

var transformerField = (_transformerField = {}, _defineProperty(_transformerField, NAME, TRANSFORMER), _defineProperty(_transformerField, VALIDATOR, _validateIsFunction2.default), _transformerField);

var defaultValueField = (_defaultValueField = {}, _defineProperty(_defaultValueField, NAME, DEFAULT_VALUE), _defineProperty(_defaultValueField, VALIDATOR, _validateIsNotUndefined2.default), _defaultValueField);

var isRequiredField = (_isRequiredField = {}, _defineProperty(_isRequiredField, NAME, IS_REQUIRED), _defineProperty(_isRequiredField, VALIDATOR, _validateIsBoolean2.default), _defineProperty(_isRequiredField, DEFAULT_VALUE, false), _isRequiredField);

var valueField = (_valueField = {}, _defineProperty(_valueField, NAME, VALUE), _defineProperty(_valueField, VALIDATOR, _validateIsObject2.default), _valueField);

var childrenField = (_childrenField = {}, _defineProperty(_childrenField, NAME, CHILDREN), _defineProperty(_childrenField, VALIDATOR, _validateIsObject2.default), _childrenField);

var fields = [nameField, validatorField, transformerField, defaultValueField, isRequiredField, valueField, childrenField];

// -----------------------------------------------------------------------------

var fieldsValidatorField = (_fieldsValidatorField = {}, _defineProperty(_fieldsValidatorField, NAME, FIELDS_VALIDATOR), _defineProperty(_fieldsValidatorField, VALIDATOR, _validateIsFunction2.default), _fieldsValidatorField);

var fieldsField = (_fieldsField = {}, _defineProperty(_fieldsField, NAME, FIELDS), _defineProperty(_fieldsField, VALIDATOR, (0, _validateIsArrayOf2.default)(_validateIsObject2.default)), _defineProperty(_fieldsField, CHILDREN, {
  fieldsValidator: (0, _allOfValidator2.default)([(0, _validateExclusiveKeys2.default)([IS_REQUIRED, DEFAULT_VALUE]), (0, _validateExclusiveKeys2.default)([VALUE, CHILDREN])]),
  fields: fields
}), _fieldsField);

var constraintRoot = _defineProperty({}, FIELDS, [fieldsValidatorField, fieldsField]);

// Set up a pointer pack to the rootmost object
childrenField.value = constraintRoot;
valueField.value = constraintRoot;

// eslint-disable-next-line import/prefer-default-export
exports.default = (0, _deepFreeze2.default)(constraintRoot);
});

unwrapExports(constraints);
var constraints_1 = constraints.FIELD_NAMES;

var utils$4 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceFieldsWithValidationValues = exports.constraintsForFieldsWithPropValue = exports.constraintsForFieldsWithPropChildren = exports.constraintsForFieldsWithProp = exports.defaultsMap = exports.transformersMap = exports.validatorsMap = exports.requiredKeys = exports.hasIsRequired = exports.propEqName = exports.pluckName = exports.propName = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();







var propName = exports.propName = (0, _ramda__default.prop)(constraints.FIELD_NAMES.NAME);
var pluckName = exports.pluckName = (0, _ramda__default.pluck)(constraints.FIELD_NAMES.NAME);
var propEqName = exports.propEqName = (0, _ramda__default.propEq)(constraints.FIELD_NAMES.NAME);
var hasIsRequired = exports.hasIsRequired = (0, _ramda__default.has)(constraints.FIELD_NAMES.IS_REQUIRED);

var hasIsRequiredKey = (0, _ramda__default.both)(hasIsRequired, (0, _ramda__default.compose)(_ramdaAdjunct.isTruthy, (0, _ramda__default.propSatisfies)(_ramdaAdjunct.isTruthy, constraints.FIELD_NAMES.IS_REQUIRED)));

var requiredKeys = exports.requiredKeys = (0, _ramda__default.compose)((0, _ramda__default.map)(propName), (0, _ramda__default.filter)(hasIsRequiredKey));

var validatorsMap = exports.validatorsMap = (0, _ramda__default.reduce)(function (acc, _ref) {
  var name = _ref.name,
      validator = _ref.validator;
  return (0, _ramda__default.assoc)(name, validator, acc);
}, {});

var transformersMap = exports.transformersMap = (0, _ramda__default.reduce)(function (acc, _ref2) {
  var name = _ref2.name,
      transformer = _ref2.transformer;
  return (0, _ramdaAdjunct.isNotUndefined)(transformer) ? (0, _ramda__default.assoc)(name, transformer, acc) : acc;
}, {});

var defaultsMap = exports.defaultsMap = (0, _ramda__default.reduce)(function (acc, _ref3) {
  var name = _ref3.name,
      defaultValue = _ref3.defaultValue;
  return (0, _ramdaAdjunct.isNotUndefined)(defaultValue) ? (0, _ramda__default.assoc)(name, defaultValue, acc) : acc;
}, {});

//
var constraintsForFieldsWithProp = exports.constraintsForFieldsWithProp = function constraintsForFieldsWithProp(name) {
  return function (constraints$$1) {
    return function (acc, _ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          fieldName = _ref5[0],
          fieldValue = _ref5[1];

      var childConstraints = (0, _ramda__default.prop)(name, (0, _ramda__default.find)(propEqName(fieldName), constraints$$1));

      if ((0, _ramdaAdjunct.isNotUndefined)(childConstraints) && (0, _ramdaAdjunct.isNotEmpty)(childConstraints) && (0, _ramdaAdjunct.isNotEmpty)(fieldValue)) {
        return (0, _ramda__default.append)([fieldName, fieldValue, childConstraints], acc);
      }
      return acc;
    };
  };
};

var constraintsForFieldsWithPropChildren = exports.constraintsForFieldsWithPropChildren = function constraintsForFieldsWithPropChildren(constraints$$1) {
  return function (o) {
    return (0, _ramda__default.reduce)(constraintsForFieldsWithProp(constraints.FIELD_NAMES.CHILDREN)(constraints$$1), [], (0, _ramda__default.toPairs)(o));
  };
};

var constraintsForFieldsWithPropValue = exports.constraintsForFieldsWithPropValue = function constraintsForFieldsWithPropValue(constraints$$1) {
  return function (o) {
    return (0, _ramda__default.reduce)(constraintsForFieldsWithProp(constraints.FIELD_NAMES.VALUE)(constraints$$1), [], (0, _ramda__default.toPairs)(o));
  };
};

var replaceFieldsWithValidationValues = exports.replaceFieldsWithValidationValues = function replaceFieldsWithValidationValues(fieldsToValidationsMap, o) {
  return (0, _ramda__default.reduce)(function (acc, _ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        fieldName = _ref7[0],
        validation = _ref7[1];

    return (0, _ramda__default.assoc)(fieldName, validation.value, o);
  }, o, (0, _ramda__default.toPairs)(fieldsToValidationsMap));
};
});

unwrapExports(utils$4);
var utils_1$2 = utils$4.replaceFieldsWithValidationValues;
var utils_2$1 = utils$4.constraintsForFieldsWithPropValue;
var utils_3$1 = utils$4.constraintsForFieldsWithPropChildren;
var utils_4$1 = utils$4.constraintsForFieldsWithProp;
var utils_5$1 = utils$4.defaultsMap;
var utils_6$1 = utils$4.transformersMap;
var utils_7$1 = utils$4.validatorsMap;
var utils_8$1 = utils$4.requiredKeys;
var utils_9$1 = utils$4.hasIsRequired;
var utils_10$1 = utils$4.propEqName;
var utils_11$1 = utils$4.pluckName;
var utils_12$1 = utils$4.propName;

var validateObjectKeysWithConstraints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _untilFailureValidator2 = _interopRequireDefault(untilFailureValidator);



var _validateWhitelistedKeys2 = _interopRequireDefault(validateWhitelistedKeys);



var _validateRequiredKeys2 = _interopRequireDefault(validateRequiredKeys);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _ramda__default.curry)(function (fieldsValidator, constraints) {
  var validators = (0, _ramda__default.juxt)([(0, _ramda__default.compose)(_validateWhitelistedKeys2.default, utils$4.pluckName), (0, _ramda__default.compose)(_validateRequiredKeys2.default, utils$4.requiredKeys)])(constraints);
  if (fieldsValidator) {
    validators = (0, _ramda__default.prepend)(fieldsValidator, validators);
  }
  return (0, _untilFailureValidator2.default)(validators);
});
});

unwrapExports(validateObjectKeysWithConstraints);

var applyDefaultsWithConstraints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();









var Success = folktale.validation.Success;


var applyDefaults = function applyDefaults(defaults) {
  return (0, _ramda__default.compose)(Success, (0, _ramda__default.reduce)(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        defaultValue = _ref2[1];

    return (0, _ramda__default.unless)((0, _ramda__default.has)(name), (0, _ramda__default.assoc)(name, defaultValue))(acc);
  }, _ramda__default.__, (0, _ramda__default.toPairs)(defaults)));
};

exports.default = function (constraints) {
  return (0, _ramda__default.ifElse)(_ramdaAdjunct.isNotEmpty, applyDefaults, (0, _ramda__default.always)(Success))((0, utils$4.defaultsMap)(constraints));
};
});

unwrapExports(applyDefaultsWithConstraints);

var transformValuesWithConstraints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();









var Success = folktale.validation.Success;


var transformValues = function transformValues(transformers) {
  return (0, _ramda__default.compose)(Success, (0, _ramda__default.reduce)(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        transformer = _ref2[1];

    return (0, _ramda__default.ifElse)(_ramdaAdjunct.isUndefined, (0, _ramda__default.always)(acc), (0, _ramda__default.compose)((0, _ramda__default.assoc)(name, _ramda__default.__, acc), transformer))((0, _ramda__default.prop)(name, acc));
  }, _ramda__default.__, (0, _ramda__default.toPairs)(transformers)));
};

exports.default = function (constraints) {
  return (0, _ramda__default.ifElse)(_ramdaAdjunct.isNotEmpty, transformValues, (0, _ramda__default.always)(Success))((0, utils$4.transformersMap)(constraints));
};
});

unwrapExports(transformValuesWithConstraints);

var validateFieldsWithValue = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();









var collect = folktale.validation.collect,
    _Success = folktale.validation.Success;


var validateValues = (0, _ramda__default.reduce)(function (acc, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      fieldName = _ref2[0],
      fieldValue = _ref2[1],
      childConstraints = _ref2[2];

  return (0, _ramda__default.assoc)(fieldName, (0, validateObjectWithConstraints_1.validateObject)(fieldName, childConstraints, fieldValue), acc);
}, {});

exports.default = function (constraints) {
  return function (o) {
    var fieldsWithPropConstraints = (0, utils$4.constraintsForFieldsWithPropValue)(constraints)(o);

    var childValidations = validateValues(fieldsWithPropConstraints);
    if ((0, _ramda__default.isEmpty)(childValidations)) {
      return _Success(o);
    }
    return collect((0, _ramda__default.values)(childValidations)).matchWith({
      Success: function Success(_) {
        return _Success((0, utils$4.replaceFieldsWithValidationValues)(childValidations, o));
      },
      Failure: _ramda__default.identity
    });
  };
};
});

unwrapExports(validateFieldsWithValue);

var validateFieldsWithChildren = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
// import prettyjson from 'prettyjson';












var collect = folktale.validation.collect,
    Success = folktale.validation.Success;

// -----------------------------------------------------------------------------
// Replace Field Values
// -----------------------------------------------------------------------------

var replaceChildrenOfArrayField = function replaceChildrenOfArrayField(o, validations) {
  var i = -1;
  return (0, utils.reduceObjIndexed)(
  // eslint-disable-next-line no-unused-vars, no-return-assign
  function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        validation = _ref2[1];

    return (0, _ramda__default.update)(i += 1, validation.value, acc);
  }, o, validations);
};

var replaceChildrenOfArrayFields = function replaceChildrenOfArrayFields(fieldToValidationsMap, o) {
  var result = (0, utils.reduceObjIndexed)(function (acc, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        fieldName = _ref4[0],
        validations = _ref4[1];

    var x = (0, _ramda__default.assoc)(fieldName, replaceChildrenOfArrayField((0, _ramda__default.prop)(fieldName, acc), validations), acc);
    return x;
  }, o, fieldToValidationsMap);
  return result;
};

// -----------------------------------------------------------------------------
// Validate Field Values
// -----------------------------------------------------------------------------

var validateChildrenOfArrayField = function validateChildrenOfArrayField(fieldName, fieldValue, childConstraints) {
  return (0, _ramda__default.reduce)(function (acc, child) {
    return (0, _ramda__default.isEmpty)(child) ? acc : (0, _ramda__default.append)((0, validateObjectWithConstraints_1.validateObject)(fieldName, childConstraints, child), acc);
  }, [], fieldValue);
};

var validateChildrenOfArrayFields = (0, _ramda__default.reduce)(function (acc, _ref5) {
  var _ref6 = _slicedToArray(_ref5, 3),
      fieldName = _ref6[0],
      fieldValue = _ref6[1],
      childConstraints = _ref6[2];

  var childValidations = validateChildrenOfArrayField(fieldName, fieldValue, childConstraints);
  return (0, _ramda__default.isEmpty)(childValidations) ? acc : (0, _ramda__default.assoc)(fieldName, childValidations, acc);
}, {});

// -----------------------------------------------------------------------------
// Process Fields that have children - that have a value that is an array
// -----------------------------------------------------------------------------

var collectAllValidationsFromChildren = (0, _ramda__default.compose)(
// eslint-disable-next-line no-unused-vars
(0, _ramda__default.reduce)(function (acc, _ref7) {
  var _ref8 = _slicedToArray(_ref7, 2),
      key = _ref8[0],
      value = _ref8[1];

  var its = (0, _ramda__default.reduce)(function (acc2, v) {
    return (0, _ramda__default.append)(v, acc2);
  }, [], value);
  return (0, _ramda__default.concat)(its, acc);
}, []), _ramda__default.toPairs);

exports.default = function (constraints) {
  return function (o) {
    var fieldToValidationsMap = (0, _ramda__default.compose)(validateChildrenOfArrayFields, (0, utils$4.constraintsForFieldsWithPropChildren)(constraints))(o);

    if ((0, _ramda__default.isEmpty)(fieldToValidationsMap)) {
      return Success(o);
    }

    var allValidations = collectAllValidationsFromChildren(fieldToValidationsMap);

    return collect(allValidations).matchWith({
      Success: (0, _ramda__default.always)(Success(replaceChildrenOfArrayFields(fieldToValidationsMap, o))),
      Failure: _ramda__default.identity
    });
  };
};
});

unwrapExports(validateFieldsWithChildren);

var validateConstraints = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});





var _constraints2 = _interopRequireDefault(constraints);



var _validateObjectWithConstraints2 = _interopRequireDefault(validateObjectWithConstraints_1);



var _wrapFailureMessageWith2 = _interopRequireDefault(wrapFailureMessageWith);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Success = folktale.validation.Success;


var constraintErrorMessageWrapper = (0, _wrapFailureMessageWith2.default)(messages.constraintValidatorErrorMessage);

exports.default = function (o) {
  var result = (0, _validateObjectWithConstraints2.default)(_constraints2.default)(o);

  return result.matchWith({
    Success: function Success(_) {
      return _Success(o);
    },
    Failure: constraintErrorMessageWrapper
  });
};
});

unwrapExports(validateConstraints);

var validateObjectWithConstraints_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateObject = undefined;







var _untilFailureValidator2 = _interopRequireDefault(untilFailureValidator);



var _validateObjectKeysWithConstraints2 = _interopRequireDefault(validateObjectKeysWithConstraints);



var _validateObjectValues2 = _interopRequireDefault(validateObjectValues);



var _applyDefaultsWithConstraints2 = _interopRequireDefault(applyDefaultsWithConstraints);



var _transformValuesWithConstraints2 = _interopRequireDefault(transformValuesWithConstraints);





var _constraints2 = _interopRequireDefault(constraints);



var _validateIsObject2 = _interopRequireDefault(validateIsObject);



var _wrapFailureMessageWith2 = _interopRequireDefault(wrapFailureMessageWith);





var _validateFieldsWithValue2 = _interopRequireDefault(validateFieldsWithValue);





var _validateFieldsWithChildren2 = _interopRequireDefault(validateFieldsWithChildren);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Failure = folktale.validation.Failure;


var objectErrorMessageWrapper = function objectErrorMessageWrapper(fieldName) {
  return (0, _wrapFailureMessageWith2.default)((0, messages.objectValidatorErrorMessage)(fieldName));
};

var constraintsAreOwnConstraints = (0, _ramda__default.equals)(_constraints2.default);

var validateObject = exports.validateObject = (0, _ramda__default.curry)(function (fieldName, constraints$$1, o) {
  var result = (0, _untilFailureValidator2.default)([
  // Validate this object's keys
  (0, _validateObjectKeysWithConstraints2.default)(constraints$$1.fieldsValidator, constraints$$1.fields),
  // Validate this object's values
  (0, _validateObjectValues2.default)((0, utils$4.validatorsMap)(constraints$$1.fields)), (0, _applyDefaultsWithConstraints2.default)(constraints$$1.fields), (0, _transformValuesWithConstraints2.default)(constraints$$1.fields),
  // Validate nested objects
  (0, _validateFieldsWithValue2.default)(constraints$$1.fields), (0, _validateFieldsWithChildren2.default)(constraints$$1.fields)])(o);
  return result.orElse(function (v) {
    return objectErrorMessageWrapper(fieldName)(Failure(v));
  });
});

var validateObjectWithConstraints = function validateObjectWithConstraints(constraints$$1) {
  return function (o) {
    // Work around cyclical dependency between this file and constraints using
    // a late import.
    // eslint-disable-next-line global-require
    var validateConstraints$$1 = validateConstraints.default;

    var objectValidation = (0, _validateIsObject2.default)(o);

    if (Failure.hasInstance(objectValidation)) {
      return objectErrorMessageWrapper(_const.ROOT_FIELD)(objectValidation);
    }

    // Avoid recursion if we try and validate CONSTRAINTS with itself
    return constraintsAreOwnConstraints(constraints$$1) ? validateObject(_const.ROOT_FIELD, constraints$$1, o) : validateConstraints$$1(constraints$$1).matchWith({
      Success: function Success(_) {
        return validateObject(_const.ROOT_FIELD, constraints$$1, o);
      },
      Failure: _ramda__default.identity
    });
  };
};

exports.default = validateObjectWithConstraints;
});

unwrapExports(validateObjectWithConstraints_1);
var validateObjectWithConstraints_2 = validateObjectWithConstraints_1.validateObject;

var lib = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", {
  value: true
});



Object.defineProperty(exports, 'withField', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(withField).default;
  }
});



Object.defineProperty(exports, 'anyOfValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(anyOfValidator).default;
  }
});



Object.defineProperty(exports, 'allOfValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(allOfValidator).default;
  }
});



Object.defineProperty(exports, 'orValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(orValidator).default;
  }
});



Object.defineProperty(exports, 'andValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(andValidator).default;
  }
});



Object.defineProperty(exports, 'numberWithUnitValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(numberWithUnitValidator).default;
  }
});



Object.defineProperty(exports, 'predicateValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(predicateValidator).default;
  }
});



Object.defineProperty(exports, 'untilFailureValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(untilFailureValidator).default;
  }
});



Object.defineProperty(exports, 'typeValidator', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(typeValidator).default;
  }
});



Object.defineProperty(exports, 'validateIsFunction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsFunction).default;
  }
});



Object.defineProperty(exports, 'validateIsBoolean', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsBoolean).default;
  }
});



Object.defineProperty(exports, 'validateIsString', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsString).default;
  }
});



Object.defineProperty(exports, 'validateIsObject', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsObject).default;
  }
});



Object.defineProperty(exports, 'validateIsArray', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsArray).default;
  }
});



Object.defineProperty(exports, 'validateIsArrayOf', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsArrayOf).default;
  }
});



Object.defineProperty(exports, 'validateArrayElements', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateArrayElements).default;
  }
});



Object.defineProperty(exports, 'validateIsUndefined', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsUndefined).default;
  }
});



Object.defineProperty(exports, 'validateIsNotUndefined', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsNotUndefined).default;
  }
});



Object.defineProperty(exports, 'validateIsValidNumber', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsValidNumber).default;
  }
});



Object.defineProperty(exports, 'validateIsWhitelistedString', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsWhitelistedString).default;
  }
});



Object.defineProperty(exports, 'validateWhitelistedKeys', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateWhitelistedKeys).default;
  }
});



Object.defineProperty(exports, 'validateRequiredKeys', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateRequiredKeys).default;
  }
});



Object.defineProperty(exports, 'validateObjectValues', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateObjectValues).default;
  }
});



Object.defineProperty(exports, 'validateIsNotEmpty', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateIsNotEmpty).default;
  }
});



Object.defineProperty(exports, 'validateLengthGreaterThan', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateLengthGreaterThan).default;
  }
});



Object.defineProperty(exports, 'validateLengthLessThan', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateLengthLessThan).default;
  }
});



Object.defineProperty(exports, 'validateLengthBetween', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateLengthBetween).default;
  }
});



Object.defineProperty(exports, 'validateObjectWithConstraints', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateObjectWithConstraints_1).default;
  }
});



Object.defineProperty(exports, 'validateObjectKeysWithConstraints', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(validateObjectKeysWithConstraints).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});

unwrapExports(lib);
var lib_1 = lib.validateIsObject;
var lib_2 = lib.validateObjectWithConstraints;
var lib_3 = lib.validateIsArrayOf;
var lib_4 = lib.validateIsString;
var lib_5 = lib.validateIsValidNumber;
var lib_6 = lib.andValidator;
var lib_7 = lib.validateIsArray;
var lib_8 = lib.validateIsNotEmpty;
var lib_9 = lib.validateIsWhitelistedString;
var lib_10 = lib.orValidator;

var VALID_STYLES = Object.freeze({
  normal: 'normal',
  italic: 'italic',
  oblique: 'oblique'
});

var VALID_STRING_WEIGHTS = Object.freeze({
  normal: 'normal',
  bold: 'bold'
});

var VALID_NUMERIC_WEIGHTS = Object.freeze([100, 200, 300, 400, 500, 600, 700, 800, 900]);

var VALID_STYLE_VALUES = _ramda.values(VALID_STYLES);
var VALID_WEIGHT_VALUES = _ramda.concat(_ramda.values(VALID_STRING_WEIGHTS), VALID_NUMERIC_WEIGHTS);

var FIELD_NAMES = Object.freeze({
  FONTS: 'fonts',
  FAMILY: 'family',
  FALLBACKS: 'fallbacks',
  BASELINE_OFFSET: 'baselineOffset',
  WEIGHTS: 'weights',
  NAME: 'name',
  WEIGHT: 'weight',
  STYLES: 'styles',
  STYLE: 'style'
});

var STYLES = Object.freeze({
  FONT_FAMILY: 'fontFamily',
  FONT_WEIGHT: 'fontWeight',
  FONT_STYLE: 'fontStyle'
});

var ERROR_PREFIX = '[cssapi-fonts]';
var CONFIGURE_PREFIX = 'configure()';
var API_FONT_PREFIX = 'font()';
var API_OFFSET_PREFIX = 'offset()';

// -----------------------------------------------------------------------------
// Logging
// -----------------------------------------------------------------------------

var log = _ramda.curry(function (loggingFunction, prefix) {
  return _ramda.tap(_ramda.compose(loggingFunction, _ramda.join(': '), _ramda.flip(_ramda.append)([prefix]), JSON.stringify));
});

// eslint-disable-next-line no-console
var logToConsole = log(console.log);

// -----------------------------------------------------------------------------
// Predicates
// -----------------------------------------------------------------------------

var isZero = _ramda.equals(0);
var isNotZero = _ramda.complement(isZero);

var isValidFontWeight = _ramda.flip(_ramda.contains)(VALID_WEIGHT_VALUES);
var isValidFontStyle = _ramda.flip(_ramda.contains)(VALID_STYLE_VALUES);

var isEmptyArray = _ramda.both(isArray, _ramda.isEmpty);
var isEmptyString = _ramda.both(isString, _ramda.isEmpty);

// -----------------------------------------------------------------------------
// Lenses
// -----------------------------------------------------------------------------

var propValue = _ramda.prop('value');


// -----------------------------------------------------------------------------
// Lists
// -----------------------------------------------------------------------------

var contained = _ramda.flip(_ramda.contains);
var appendTo = _ramda.flip(_ramda.append);

// -----------------------------------------------------------------------------
// Strings
// -----------------------------------------------------------------------------

var quote = function quote(value) {
  return '\'' + value + '\'';
};

var joinDefined = function joinDefined(string) {
  return function (a) {
    var remaining = _ramda.reject(_ramda.anyPass([isEmptyString, isEmptyArray, isUndefined]))(a);
    var result = _ramda.join(string, remaining);
    return result;
  };
};

var joinWithComma = joinDefined(', ');

var joinWithSpace = joinDefined(' ');

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

var replaceValidationPrefix = _ramda.replace('Object Invalid: Object included invalid values(s)');

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

var throwError = function throwError(message) {
  throw new Error(joinWithSpace([ERROR_PREFIX, message]));
};

var throwPrefixedError = function throwPrefixedError(prefix) {
  return _ramda.compose(throwError, joinWithSpace, appendTo([prefix]));
};

// -----------------------------------------------------------------------------
// Prefixed Errors
// -----------------------------------------------------------------------------

var throwConfigureError = throwPrefixedError(CONFIGURE_PREFIX);
var throwAPIFontError = throwPrefixedError(API_FONT_PREFIX);
var throwAPIOffsetError = throwPrefixedError(API_OFFSET_PREFIX);

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

var invalidConfigMessage = function invalidConfigMessage(validationErrors) {
  return 'The config object was invalid: ' + joinWithComma(validationErrors);
};

var invalidAPIMessage = joinWithComma;

var noFontFamilyMessage = function noFontFamilyMessage(name) {
  return 'There is no font family named ' + quote(name) + ' configured';
};

var noWeightForFontFamilyMessage = function noWeightForFontFamilyMessage(name, weight) {
  return 'There is no weight ' + quote(weight) + ' for font family named ' + quote(name) + ' configured';
};

var noStyleForWeightForFontFamilyMessage = function noStyleForWeightForFontFamilyMessage(name, weight, style) {
  return 'There is no style ' + quote(style) + ' for weight ' + quote(weight) + ' for font family named ' + quote(name) + ' configured';
};

var CONFIG = {
  fields: [{
    name: 'fonts',
    isRequired: true,
    validator: lib_3(lib_1),
    children: {
      fields: [{
        name: 'family',
        isRequired: true,
        validator: lib_4
      }, {
        name: 'fallbacks',
        validator: lib_3(lib_4),
        defaultValue: []
      }, {
        name: 'baselineOffset',
        validator: lib_5,
        defaultValue: 0
      }, {
        name: 'weights',
        validator: lib_6(lib_7, lib_8),
        isRequired: true,
        children: {
          fields: [{
            name: 'name',
            validator: lib_4
          }, {
            name: 'weight',
            isRequired: true,
            validator: lib_9(VALID_WEIGHT_VALUES)
          }, {
            name: 'styles',
            isRequired: true,
            validator: lib_3(lib_1),
            children: {
              fields: [{
                name: 'name',
                validator: lib_4
              }, {
                name: 'style',
                isRequired: true,
                validator: lib_9(VALID_STYLE_VALUES)
              }]
            }
          }]
        }
      }]
    }
  }]
};

var API_FONT = {
  fields: [{
    name: 'family',
    validator: lib_4
  }, {
    name: 'weight',
    validator: lib_10(lib_4, lib_5)
  }, {
    name: 'style',
    validator: lib_4
  }]
};

var API_OFFSET = {
  fields: [{
    name: 'family',
    validator: lib_4
  }]
};

var validateConfig = lib_2(CONFIG);

var Failure$4 = folktale_1.Failure;


var replaceMessagePrefix = replaceValidationPrefix('You supplied invalid Arguments');

var replaceKey = _ramda.replace(/Key /g, 'Argument ');

var validateAPIArgs = (function (o) {
  return lib_2(API_FONT)(o).orElse(_ramda.compose(Failure$4, _ramda.of, replaceMessagePrefix, replaceKey, _ramda.head));
});

var Failure$5 = folktale_1.Failure;


var replaceMessagePrefix$1 = replaceValidationPrefix('You supplied invalid Arguments');

var replaceKey$1 = _ramda.replace(/Key /g, 'Argument ');

var validateAPIOffsetArgs = (function (o) {
  return lib_2(API_OFFSET)(o).orElse(_ramda.compose(Failure$5, _ramda.of, replaceMessagePrefix$1, replaceKey$1, _ramda.head));
});

var defineProperty$2 = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var propFamily = _ramda.prop(FIELD_NAMES.FAMILY);
var propWeight = _ramda.prop(FIELD_NAMES.WEIGHT);
var propBaselineOffset = _ramda.prop(FIELD_NAMES.BASELINE_OFFSET);
var propStyle = _ramda.prop(FIELD_NAMES.STYLE);
var lFamily = _ramda.lensProp(FIELD_NAMES.FAMILY);
var lWeights = _ramda.lensProp(FIELD_NAMES.WEIGHTS);
var lWeight = _ramda.lensProp(FIELD_NAMES.WEIGHT);
var lStyles = _ramda.lensProp(FIELD_NAMES.STYLES);
var lStyle = _ramda.lensProp(FIELD_NAMES.STYLE);
var lFallbacks = _ramda.lensProp(FIELD_NAMES.FALLBACKS);
var lEqualsFamily = lensEq(lFamily);
var lEqualsWeight = lensEq(lWeight);
var lEqualsStyle = lensEq(lStyle);

var api = (function (config) {
  var fonts = config.fonts;

  var findFont = _ramda.flip(_ramda.find)(fonts);
  var findFontFamily = _ramda.compose(findFont, lEqualsFamily);

  // ---------------------------------------------------------------------------
  // font()
  // ---------------------------------------------------------------------------

  var font = function font(family, weight, style) {
    var _ref;

    validateAPIArgs({ family: family, weight: weight, style: style }).orElse(_ramda.compose(throwAPIFontError, invalidAPIMessage));

    // Family
    var fontFamily = findFontFamily(family); // Check that name is valid
    _ramda.when(isUndefined, function (_) {
      return throwAPIFontError(noFontFamilyMessage(family));
    })(fontFamily);

    // Weights
    var fontWeights = _ramda.view(lWeights, fontFamily);
    var fontWeight = _ramda.find(lEqualsWeight(weight), fontWeights);
    _ramda.when(isUndefined, function (_) {
      return throwAPIFontError(noWeightForFontFamilyMessage(family, weight));
    })(fontWeight);

    // Styles
    var fontStyles = _ramda.view(lStyles, fontWeight);
    var fontStyle = _ramda.find(lEqualsStyle(style), fontStyles);
    _ramda.when(isUndefined, function (_) {
      return throwAPIFontError(noStyleForWeightForFontFamilyMessage(family, weight, style));
    })(fontStyle);

    return _ref = {}, defineProperty$2(_ref, STYLES.FONT_FAMILY, joinWithComma([propFamily(fontFamily), joinWithComma(_ramda.view(lFallbacks, fontFamily))])), defineProperty$2(_ref, STYLES.FONT_WEIGHT, propWeight(fontWeight)), defineProperty$2(_ref, STYLES.FONT_STYLE, propStyle(fontStyle)), _ref;
  };

  // ---------------------------------------------------------------------------
  // offset()
  // ---------------------------------------------------------------------------

  var offset = function offset(family) {
    validateAPIOffsetArgs({ family: family }).orElse(_ramda.compose(throwAPIOffsetError, invalidAPIMessage));

    var fontFamily = findFontFamily(family); // Check that name is valid

    _ramda.when(isUndefined, function (_) {
      return throwAPIOffsetError(noFontFamilyMessage(family));
    })(fontFamily);
    return propBaselineOffset(fontFamily);
  };

  return {
    font: font,
    offset: offset
  };
});

var throwOrBuildApi = function throwOrBuildApi(config) {
  return validateConfig(config).matchWith({
    Success: _ramda.compose(api, propValue),
    Failure: _ramda.compose(throwConfigureError, invalidConfigMessage, propValue)
  });
};

var configure = function configure(config) {
  return lib_1(config).matchWith({
    Success: _ramda.compose(throwOrBuildApi, propValue),
    Failure: _ramda.compose(throwConfigureError, invalidConfigMessage, propValue)
  });
};

var fonts$1 = {
  configure: configure
};

return fonts$1;

})));
