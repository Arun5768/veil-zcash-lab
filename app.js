var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex2) {
      if (typeof hex2 === "number") {
        hex2 = hex2.toString();
      }
      if (typeof hex2 !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex2.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex2);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render2(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render2(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text2, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text2;
          text2 = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text2;
            text2 = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text2 = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text2;
          text2 = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text2, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text2, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/app.js
var import_qrcode = __toESM(require_browser(), 1);

// node_modules/@scure/base/index.js
var freeze = (fn) => Object.freeze(fn());
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
function abytes(b) {
  if (!isBytes(b))
    throw new TypeError("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new TypeError("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new TypeError(`${label}: string expected`);
  return true;
}
function anumber(n, title = "number") {
  if (typeof n !== "number")
    throw new TypeError(`${title}: expected number, got ${typeof n}`);
  if (!Number.isSafeInteger(n))
    throw new RangeError(`${title}: expected safe integer, got ${n}`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new TypeError(`${label}: array of numbers expected`);
}
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode = args.map((x) => x.decode).reduce(wrap, id);
  return { encode, decode };
}
var powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++)
    res.push(2 ** i);
  return res;
})();
function u8ToNumArr(u8, len = u8.length) {
  const res = new Array(len);
  for (let i = 0; i < len; i++)
    res[i] = u8[i];
  return res;
}
var asciiDecoder = /* @__PURE__ */ (() => {
  try {
    const decoder = new TextDecoder();
    return decoder.decode(Uint8Array.of(65, 48, 43, 127)) === "A0+\x7F" ? decoder : void 0;
  } catch (e) {
    return void 0;
  }
})();
var B2S_CHUNK = 8192;
function charcodesToString(codes) {
  const len = codes.length;
  if (asciiDecoder !== void 0 && len >= 12)
    return asciiDecoder.decode(codes);
  if (len <= B2S_CHUNK)
    return String.fromCharCode.apply(null, codes);
  let res = "";
  for (let i = 0; i < len; i += B2S_CHUNK)
    res += String.fromCharCode.apply(null, codes.subarray(i, i + B2S_CHUNK));
  return res;
}
function radix2(bits) {
  anumber(bits);
  if (bits <= 0 || bits > 8)
    throw new RangeError("radix2: bits should be in (0..8]");
  const mask = powers[bits] - 1;
  return {
    encode: (bytes) => {
      abytes(bytes);
      const len = bytes.length;
      const res = new Uint8Array(Math.ceil(len * 8 / bits));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; ) {
        if (i + 2 < len) {
          carry = carry << 24 | bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
          pos += 24;
          i += 3;
        } else {
          carry = (carry << 8 | bytes[i]) & 65535;
          pos += 8;
          i++;
        }
        for (; ; ) {
          pos -= bits;
          res[j++] = carry >> pos & mask;
          if (pos < bits)
            break;
        }
      }
      if (pos > 0)
        res[j] = carry << bits - pos & mask;
      return res;
    },
    decode: (digits) => {
      const len = digits.length;
      const res = new Uint8Array(Math.floor(len * bits / 8));
      let carry = 0;
      let pos = 0;
      let j = 0;
      for (let i = 0; i < len; i++) {
        carry = (carry << bits | digits[i]) & 65535;
        pos += bits;
        for (; pos >= 8; pos -= 8)
          res[j++] = carry >> pos - 8 & 255;
      }
      carry = carry << 8 - pos & 255;
      if (pos >= bits)
        throw new Error("Excess padding");
      if (carry > 0)
        throw new Error(`Non-zero padding: ${carry}`);
      return res;
    }
  };
}
function alphabet(letters, aliases) {
  const len = letters.length;
  if (len > 128)
    throw new Error("alphabet: max 128 letters");
  const encTable = new Uint8Array(len);
  const decTable = new Int8Array(128).fill(-1);
  for (let i = 0; i < len; i++) {
    const code = letters.charCodeAt(i);
    if (letters.codePointAt(i) !== code || code > 127)
      throw new Error("alphabet: single-char ASCII letters only");
    encTable[i] = code;
    decTable[code] = i;
  }
  if (aliases !== void 0) {
    for (const alias of Object.keys(aliases)) {
      const code = alias.charCodeAt(0);
      const target = decTable[aliases[alias].charCodeAt(0)];
      if (alias.length !== 1 || code > 127 || target === void 0 || target === -1)
        throw new Error(`alphabet: invalid alias ${alias}`);
      decTable[code] = target;
    }
  }
  return {
    encode: (digits) => {
      const codes = new Uint8Array(digits.length);
      for (let i = 0; i < digits.length; i++) {
        const d = digits[i];
        const code = encTable[d];
        if (code === void 0)
          throw new Error(`alphabet.encode: invalid digit ${d}`);
        codes[i] = code;
      }
      return charcodesToString(codes);
    },
    decode: (input) => {
      astr("decode", input);
      const slen = input.length;
      const digits = new Uint8Array(slen);
      for (let i = 0; i < slen; i++) {
        const code = input.charCodeAt(i);
        const digit = code < 128 ? decTable[code] : -1;
        if (digit === -1)
          throw new Error(`Unknown letter "${input[i]}". Allowed: ${letters}`);
        digits[i] = digit;
      }
      return digits;
    }
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function(...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {
    }
  };
}
function checksum(len, fn) {
  anumber(len);
  if (len <= 0)
    throw new RangeError(`checksum length must be positive: ${len}`);
  afn(fn);
  const _fn = fn;
  return {
    encode(data) {
      abytes(data);
      const sum = _fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      abytes(data);
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = _fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var base64urlnopad = /* @__PURE__ */ freeze(() => chain(radix2(6), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_")));
var B58_GROUP = 656356768;
var RADIX_BASE_N_MAX_LENGTH = 65536;
var BASE_N_MAX_BYTES = 2048;
var BASE_N_MAX_CHARS = 4096;
var radixBaseN = (BASE, GROUP) => ({
  encode: (bytes) => {
    abytes(bytes);
    const blen = bytes.length;
    if (blen === 0)
      return new Uint8Array(0);
    if (blen >= RADIX_BASE_N_MAX_LENGTH)
      throw new Error("invalid length");
    let zeros = 0;
    while (zeros < blen - 1 && bytes[zeros] === 0)
      zeros++;
    const nlimbs = Math.ceil(blen / 2);
    const limbs = new Uint16Array(nlimbs);
    const odd = blen & 1;
    if (odd)
      limbs[0] = bytes[0];
    for (let i = odd, j2 = odd; i < blen; i += 2, j2++)
      limbs[j2] = bytes[i] << 8 | bytes[i + 1];
    const groups = [];
    let pos = 0;
    while (pos < nlimbs) {
      let carry = 0;
      for (let i = pos; i < nlimbs; i++) {
        const cur = carry * 65536 + limbs[i];
        const q = Math.floor(cur / GROUP);
        carry = cur - q * GROUP;
        limbs[i] = q;
        if (q === 0 && i === pos)
          pos++;
      }
      groups.push(carry);
    }
    const top = groups.length - 1;
    let sig = top * 5;
    for (let v = groups[top]; ; v = Math.floor(v / BASE)) {
      sig++;
      if (v < BASE)
        break;
    }
    const res = new Uint8Array(zeros + sig);
    let j = res.length - 1;
    for (let g = 0; g < top; g++) {
      let v = groups[g];
      for (let k = 0; k < 5; k++) {
        res[j--] = v % BASE;
        v = Math.floor(v / BASE);
      }
    }
    for (let v = groups[top]; j >= zeros; v = Math.floor(v / BASE))
      res[j--] = v % BASE;
    return res;
  },
  decode: (digits) => {
    abytes(digits);
    const dlen = digits.length;
    if (dlen === 0)
      return new Uint8Array(0);
    if (dlen >= RADIX_BASE_N_MAX_LENGTH)
      throw new Error("invalid length");
    let zeros = 0;
    while (zeros < dlen - 1 && digits[zeros] === 0)
      zeros++;
    const limbs = new Uint16Array(Math.ceil(dlen * 6 / 16) + 1);
    let used = 0;
    let i = 0;
    let group = dlen % 5 || 5;
    while (i < dlen) {
      let gval = 0;
      let factor = 1;
      for (const end = i + group; i < end; i++) {
        const d = digits[i];
        if (d >= BASE)
          throw new Error(`invalid integer: ${d}`);
        gval = gval * BASE + d;
        factor *= BASE;
      }
      group = 5;
      let carry = gval;
      for (let k = 0; k < used; k++) {
        const cur = limbs[k] * factor + carry;
        carry = Math.floor(cur / 65536);
        limbs[k] = cur - carry * 65536;
      }
      for (; carry > 0; carry = Math.floor(carry / 65536))
        limbs[used++] = carry % 65536;
    }
    const valueBytes = used === 0 ? 1 : used * 2 - (limbs[used - 1] < 256 ? 1 : 0);
    const res = new Uint8Array(zeros + valueBytes);
    let j = res.length - 1;
    for (let k = 0; k < used; k++) {
      const limb = limbs[k];
      res[j--] = limb & 255;
      if (j >= zeros)
        res[j--] = limb >> 8;
    }
    return res;
  }
});
var genBaseN = (radix, abc) => {
  const letters = alphabet(abc);
  return {
    encode(bytes) {
      abytes(bytes);
      if (bytes.length > BASE_N_MAX_BYTES)
        throw new Error("invalid length");
      return letters.encode(radix.encode(bytes));
    },
    decode(str) {
      astr("baseN.decode", str);
      if (str.length > BASE_N_MAX_CHARS)
        throw new Error("invalid length");
      return radix.decode(letters.decode(str));
    }
  };
};
var radix58 = /* @__PURE__ */ radixBaseN(58, B58_GROUP);
var genBase58 = (abc) => genBaseN(radix58, abc);
var base58 = /* @__PURE__ */ freeze(() => genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"));
var createBase58check = (sha2562) => {
  afn(sha2562);
  const _sha256 = sha2562;
  return chain(checksum(4, (data) => _sha256(_sha256(data))), base58);
};
var base58check = createBase58check;
var BECH_ALPHABET = /* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l");
var BECH_UPPERCASE_PRINTABLE = /^[\x21-\x60\x7b-\x7e]+$/;
function assertBech32Printable(label, value) {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`${label}: printable ASCII expected`);
  }
}
function wordsToU8(words) {
  const len = words.length;
  const res = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const w = words[i];
    if (w < 0 || w >= 32)
      throw new Error(`alphabet.encode: invalid digit ${w}`);
    res[i] = w;
  }
  return res;
}
var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1)
      chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126)
      throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++)
    chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
  for (let v of words)
    chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++)
    chk = bech32Polymod(chk);
  chk ^= encodingConst;
  const sum = new Uint8Array(6);
  for (let i = 0; i < 6; i++)
    sum[i] = chk >>> 5 * (5 - i) & 31;
  return BECH_ALPHABET.encode(sum);
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const toWords = (from) => {
    abytes(from);
    const len = from.length;
    const res = new Array(Math.ceil(len * 8 / 5));
    let carry = 0;
    let pos = 0;
    let j = 0;
    for (let i = 0; i < len; i++) {
      carry = carry << 8 | from[i];
      pos += 8;
      for (; pos >= 5; pos -= 5)
        res[j++] = carry >> pos - 5 & 31;
    }
    if (pos > 0)
      res[j] = carry << 5 - pos & 31;
    return res;
  };
  const fromWords = (to) => {
    anumArr("radix2.decode", to);
    const len = to.length;
    const digits = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      const w = to[i];
      if (w < 0 || w >= 32)
        throw new Error(`convertRadix2: invalid word=${w}`);
      digits[i] = w;
    }
    return _words.decode(digits);
  };
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (limit !== false)
      anumber(limit, "limit");
    if (isBytes(words))
      words = u8ToNumArr(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0)
      throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    assertBech32Printable("bech32.encode prefix", prefix);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(wordsToU8(words))}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    if (limit !== false)
      anumber(limit, "limit");
    const slen = str.length;
    if (slen < 8 || limit !== false && slen > limit)
      throw new TypeError(`invalid string length ${slen}, expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered) {
      if (!BECH_UPPERCASE_PRINTABLE.test(str)) {
        assertBech32Printable("bech32.decode input", str);
        throw new Error(`mixed-case string not allowed`);
      }
    }
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`invalid separator "1"`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6)
      throw new Error("invalid data length");
    const digits = BECH_ALPHABET.decode(data);
    const words = u8ToNumArr(digits, digits.length - 6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum))
      throw new Error(`Invalid checksum in ${str}`);
    return { prefix, words };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str, limit = 90) {
    const { prefix, words } = decode(str, limit);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode(prefix, toWords(bytes));
  }
  return {
    encode,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
var bech32 = /* @__PURE__ */ freeze(() => genBech32("bech32"));
var bech32m = /* @__PURE__ */ freeze(() => genBech32("bech32m"));

// node_modules/@noble/hashes/_u64.js
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE2) {
  const h = fromNumH(n);
  const l = fromNumL(n);
  view.setUint32(byteOffset, isLE2 ? l : h, isLE2);
  view.setUint32(byteOffset + 4, isLE2 ? h : l, isLE2);
}
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;

// node_modules/@noble/hashes/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle = (title) => title ? `"${title}" ` : "";
function anumber2(n, title = "") {
  if (typeof n !== "number")
    throw new TypeError(atitle(title) + "expected number, got " + typeof n);
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
  return n;
}
function abytes2(value, length, title = "") {
  if (isBytes2(value) && (length === void 0 || value.length === length))
    return value;
  if (length !== void 0)
    anumber2(length, "length");
  const bytes = isBytes2(value);
  const ofLen = length !== void 0 ? ` of length ${length}` : "";
  const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
  const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
  if (!bytes)
    throw new TypeError(message);
  throw new RangeError(message);
}
function copyBytes(bytes) {
  return Uint8Array.from(abytes2(bytes));
}
var aobject = (value, label) => {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
var aopts = (value, label) => {
  aobject(value, label);
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null)
    throw new TypeError(`"${label}" expected plain object`);
  if (Object.hasOwn(value, "__proto__"))
    throw new TypeError(`"${label}.__proto__" is not allowed`);
};
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("hash was destroyed");
  if (checkFinished && instance.finished)
    throw new Error("digest() was already called");
}
function aoutput(out, instance) {
  abytes2(out, void 0, "output");
  const min = instance.outputLen;
  if (!(out.length >= min)) {
    throw new RangeError('"output" expected length >= ' + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
var swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n) >>> 0;
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
var swap32IfBE = isLE ? (u) => u : byteSwap32;
function checkOpts(defaults, opts, title = "opts") {
  aopts(defaults, "defaults");
  if (opts !== void 0)
    aopts(opts, title);
  const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
  return merged;
}
function createHasher(hashCons, info = {}) {
  if (typeof hashCons !== "function")
    throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
  info = checkOpts({}, info, "info");
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.canXOF = tmp.canXOF;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
var oidNist = (suffix) => ({
  // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
  // Larger suffix values would need base-128 OID encoding and a different length byte.
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
});

// node_modules/@noble/hashes/_md.js
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class {
  blockLen;
  outputLen;
  canXOF = false;
  padOffset;
  isLE;
  // For partial updates less than block size
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE2) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes2(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    let processed = false;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        processed = true;
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
        processed = true;
      }
    }
    this.length += data.length;
    if (processed)
      this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    buffer.fill(0, pos);
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      buffer.fill(0);
    }
    setU64FromNum(view, blockLen - 8, this.length * 8, isLE2);
    this.process(view, 0);
    this.roundClean();
    const oview = out === buffer ? view : createView(out);
    const len = this.outputLen;
    const outLen = len / 4;
    const state2 = this.get();
    if (len % 4 || outLen > state2.length)
      throw new Error("invalid outputLen");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state2[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneIntoMeta(to) {
    const { buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (pos)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);

// node_modules/@noble/hashes/sha2.js
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA2_32B = class extends HashMD {
  // We cannot use array here since array allows indexing by variable
  // which means optimizer/compiler cannot use registers.
  // Numeric initializers matter: starting the fields as `undefined` changes
  // V8's field representation and makes sha256 3x slower (measured).
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  E = 0;
  F = 0;
  G = 0;
  H = 0;
  constructor(outputLen, IV) {
    super(64, outputLen, 8, false);
    this.A = IV[0] | 0;
    this.B = IV[1] | 0;
    this.C = IV[2] | 0;
    this.D = IV[3] | 0;
    this.E = IV[4] | 0;
    this.F = IV[5] | 0;
    this.G = IV[6] | 0;
    this.H = IV[7] | 0;
  }
  get() {
    const { A, B, C, D, E, F, G: G2, H: H2 } = this;
    return [A, B, C, D, E, F, G2, H2];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G2, H2) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G2 | 0;
    this.H = H2 | 0;
  }
  _cloneInto(to) {
    (to ||= new this.constructor()).set(...this.get());
    return this._cloneIntoMeta(to);
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C, D, E, F, G: G2, H: H2 } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H2 + sigma1 + Chi(E, F, G2) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H2 = G2;
      G2 = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G2 = G2 + this.G | 0;
    H2 = H2 + this.H | 0;
    this.set(A, B, C, D, E, F, G2, H2);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.destroyed = true;
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var _SHA256 = class extends SHA2_32B {
  constructor() {
    super(32, SHA256_IV);
  }
};
var sha256 = /* @__PURE__ */ createHasher(
  () => new _SHA256(),
  /* @__PURE__ */ oidNist(1)
);

// node_modules/@noble/hashes/_blake.js
var BSIGMA = /* @__PURE__ */ Uint8Array.from([
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9,
  12,
  5,
  1,
  15,
  14,
  13,
  4,
  10,
  0,
  7,
  6,
  3,
  9,
  2,
  8,
  11,
  13,
  11,
  7,
  14,
  12,
  1,
  3,
  9,
  5,
  0,
  15,
  4,
  8,
  6,
  2,
  10,
  6,
  15,
  14,
  9,
  11,
  3,
  0,
  8,
  12,
  2,
  13,
  7,
  1,
  4,
  10,
  5,
  10,
  2,
  8,
  4,
  7,
  6,
  1,
  5,
  15,
  11,
  9,
  14,
  3,
  12,
  13,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  // Blake1, unused in others
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9
]);

// node_modules/@noble/hashes/blake2.js
var B2B_IV = /* @__PURE__ */ Uint32Array.from([
  4089235720,
  1779033703,
  2227873595,
  3144134277,
  4271175723,
  1013904242,
  1595750129,
  2773480762,
  2917565137,
  1359893119,
  725511199,
  2600822924,
  4215389547,
  528734635,
  327033209,
  1541459225
]);
var BBUF = /* @__PURE__ */ new Uint32Array(32);
function G1b(a, b, c, d, msg, x) {
  const Xl = msg[x], Xh = msg[x + 1];
  let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
  let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
  let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
  let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
  const ll = add3L(Al, Bl, Xl);
  Ah = add3H(ll, Ah, Bh, Xh);
  Al = ll | 0;
  let xh = Dh ^ Ah, xl = Dl ^ Al;
  Dh = rotr32H(xh, xl);
  Dl = rotr32L(xh, xl);
  ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
  xh = Bh ^ Ch;
  xl = Bl ^ Cl;
  Bh = rotrSH(xh, xl, 24);
  Bl = rotrSL(xh, xl, 24);
  BBUF[2 * a] = Al;
  BBUF[2 * a + 1] = Ah;
  BBUF[2 * b] = Bl;
  BBUF[2 * b + 1] = Bh;
  BBUF[2 * c] = Cl;
  BBUF[2 * c + 1] = Ch;
  BBUF[2 * d] = Dl;
  BBUF[2 * d + 1] = Dh;
}
function G2b(a, b, c, d, msg, x) {
  const Xl = msg[x], Xh = msg[x + 1];
  let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
  let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
  let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
  let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
  const ll = add3L(Al, Bl, Xl);
  Ah = add3H(ll, Ah, Bh, Xh);
  Al = ll | 0;
  let xh = Dh ^ Ah, xl = Dl ^ Al;
  Dh = rotrSH(xh, xl, 16);
  Dl = rotrSL(xh, xl, 16);
  ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
  xh = Bh ^ Ch;
  xl = Bl ^ Cl;
  Bh = rotrBH(xh, xl, 63);
  Bl = rotrBL(xh, xl, 63);
  BBUF[2 * a] = Al;
  BBUF[2 * a + 1] = Ah;
  BBUF[2 * b] = Bl;
  BBUF[2 * b + 1] = Bh;
  BBUF[2 * c] = Cl;
  BBUF[2 * c + 1] = Ch;
  BBUF[2 * d] = Dl;
  BBUF[2 * d + 1] = Dh;
}
function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
  anumber2(keyLen);
  if (outputLen <= 0 || outputLen > keyLen)
    throw new Error('"dkLen" must be 1..' + keyLen + ", got " + outputLen);
  const { key, salt, personalization } = opts;
  if (key !== void 0 && (key.length < 1 || key.length > keyLen))
    throw new Error('"key" expected to be undefined or of length=1..' + keyLen);
  if (salt !== void 0)
    abytes2(salt, saltLen, "salt");
  if (personalization !== void 0)
    abytes2(personalization, persLen, "personalization");
}
var _BLAKE2 = class {
  buffer;
  buffer32;
  finished = false;
  destroyed = false;
  length = 0;
  pos = 0;
  blockLen;
  outputLen;
  canXOF = false;
  constructor(blockLen, outputLen) {
    anumber2(blockLen);
    anumber2(outputLen);
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.buffer = new Uint8Array(blockLen);
    this.buffer32 = u32(this.buffer);
  }
  update(data) {
    aexists(this);
    abytes2(data);
    const { blockLen, buffer, buffer32 } = this;
    const len = data.length;
    const offset = data.byteOffset;
    const buf = data.buffer;
    for (let pos = 0; pos < len; ) {
      if (this.pos === blockLen) {
        swap32IfBE(buffer32);
        this.compress(buffer32, 0, false);
        swap32IfBE(buffer32);
        this.pos = 0;
      }
      const take = Math.min(blockLen - this.pos, len - pos);
      const dataOffset = offset + pos;
      if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
        const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
        swap32IfBE(data32);
        for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
          this.length += blockLen;
          this.compress(data32, pos32, false);
        }
        swap32IfBE(data32);
        continue;
      }
      buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      this.length += take;
      pos += take;
    }
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    if (out.byteOffset & 3)
      throw new RangeError('"output" expected 4-byte aligned byteOffset, got ' + out.byteOffset);
    const { pos, buffer32 } = this;
    this.finished = true;
    this.buffer.fill(0, pos);
    swap32IfBE(buffer32);
    this.compress(buffer32, 0, true);
    swap32IfBE(buffer32);
    const state2 = this.get();
    const out32 = out === this.buffer ? buffer32 : u32(out);
    const full = Math.floor(this.outputLen / 4);
    for (let i = 0; i < full; i++)
      out32[i] = swap8IfBE(state2[i]);
    const tail = this.outputLen % 4;
    if (!tail)
      return;
    const off = full * 4;
    const word = state2[full];
    for (let i = 0; i < tail; i++)
      out[off + i] = word >>> 8 * i;
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    const { buffer, length, finished, destroyed, outputLen, pos } = this;
    to ||= new this.constructor({ dkLen: outputLen });
    to.set(...this.get());
    to.buffer.set(buffer);
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    to.outputLen = outputLen;
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var _BLAKE2b = class extends _BLAKE2 {
  // Same IV words as SHA-512 / BLAKE2b, encoded as LE u32 low/high halves.
  v0l = B2B_IV[0] | 0;
  v0h = B2B_IV[1] | 0;
  v1l = B2B_IV[2] | 0;
  v1h = B2B_IV[3] | 0;
  v2l = B2B_IV[4] | 0;
  v2h = B2B_IV[5] | 0;
  v3l = B2B_IV[6] | 0;
  v3h = B2B_IV[7] | 0;
  v4l = B2B_IV[8] | 0;
  v4h = B2B_IV[9] | 0;
  v5l = B2B_IV[10] | 0;
  v5h = B2B_IV[11] | 0;
  v6l = B2B_IV[12] | 0;
  v6h = B2B_IV[13] | 0;
  v7l = B2B_IV[14] | 0;
  v7h = B2B_IV[15] | 0;
  constructor(opts = {}) {
    opts = checkOpts({}, opts);
    const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
    super(128, olen);
    checkBlake2Opts(olen, opts, 64, 16, 16);
    let { key, personalization, salt } = opts;
    let keyLength = 0;
    if (key !== void 0) {
      abytes2(key, void 0, "key");
      keyLength = key.length;
    }
    this.v0l ^= this.outputLen | keyLength << 8 | 1 << 16 | 1 << 24;
    if (salt !== void 0) {
      abytes2(salt, void 0, "salt");
      const slt = u32(copyBytes(salt));
      this.v4l ^= swap8IfBE(slt[0]);
      this.v4h ^= swap8IfBE(slt[1]);
      this.v5l ^= swap8IfBE(slt[2]);
      this.v5h ^= swap8IfBE(slt[3]);
    }
    if (personalization !== void 0) {
      abytes2(personalization, void 0, "personalization");
      const pers = u32(copyBytes(personalization));
      this.v6l ^= swap8IfBE(pers[0]);
      this.v6h ^= swap8IfBE(pers[1]);
      this.v7l ^= swap8IfBE(pers[2]);
      this.v7h ^= swap8IfBE(pers[3]);
    }
    if (key !== void 0) {
      const tmp = new Uint8Array(this.blockLen);
      tmp.set(key);
      this.update(tmp);
      clean(tmp);
    }
  }
  // prettier-ignore
  get() {
    let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
    return [v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h];
  }
  // prettier-ignore
  set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
    this.v0l = v0l | 0;
    this.v0h = v0h | 0;
    this.v1l = v1l | 0;
    this.v1h = v1h | 0;
    this.v2l = v2l | 0;
    this.v2h = v2h | 0;
    this.v3l = v3l | 0;
    this.v3h = v3h | 0;
    this.v4l = v4l | 0;
    this.v4h = v4h | 0;
    this.v5l = v5l | 0;
    this.v5h = v5h | 0;
    this.v6l = v6l | 0;
    this.v6h = v6h | 0;
    this.v7l = v7l | 0;
    this.v7h = v7h | 0;
  }
  compress(msg, offset, isLast) {
    const { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
    {
      BBUF[0] = v0l;
      BBUF[1] = v0h;
      BBUF[2] = v1l;
      BBUF[3] = v1h;
      BBUF[4] = v2l;
      BBUF[5] = v2h;
      BBUF[6] = v3l;
      BBUF[7] = v3h;
      BBUF[8] = v4l;
      BBUF[9] = v4h;
      BBUF[10] = v5l;
      BBUF[11] = v5h;
      BBUF[12] = v6l;
      BBUF[13] = v6h;
      BBUF[14] = v7l;
      BBUF[15] = v7h;
    }
    BBUF.set(B2B_IV, 16);
    const l = fromNumL(this.length);
    const h = fromNumH(this.length);
    BBUF[24] = B2B_IV[8] ^ l;
    BBUF[25] = B2B_IV[9] ^ h;
    if (isLast) {
      BBUF[28] = ~BBUF[28];
      BBUF[29] = ~BBUF[29];
    }
    let j = 0;
    const s = BSIGMA;
    for (let i = 0; i < 12; i++) {
      G1b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
      G2b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
      G1b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
      G2b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
      G1b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
      G2b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
      G1b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
      G2b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
      G1b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
      G2b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
      G1b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
      G2b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
      G1b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
      G2b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
      G1b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
      G2b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
    }
    this.v0l ^= BBUF[0] ^ BBUF[16];
    this.v0h ^= BBUF[1] ^ BBUF[17];
    this.v1l ^= BBUF[2] ^ BBUF[18];
    this.v1h ^= BBUF[3] ^ BBUF[19];
    this.v2l ^= BBUF[4] ^ BBUF[20];
    this.v2h ^= BBUF[5] ^ BBUF[21];
    this.v3l ^= BBUF[6] ^ BBUF[22];
    this.v3h ^= BBUF[7] ^ BBUF[23];
    this.v4l ^= BBUF[8] ^ BBUF[24];
    this.v4h ^= BBUF[9] ^ BBUF[25];
    this.v5l ^= BBUF[10] ^ BBUF[26];
    this.v5h ^= BBUF[11] ^ BBUF[27];
    this.v6l ^= BBUF[12] ^ BBUF[28];
    this.v6h ^= BBUF[13] ^ BBUF[29];
    this.v7l ^= BBUF[14] ^ BBUF[30];
    this.v7h ^= BBUF[15] ^ BBUF[31];
    clean(BBUF);
  }
  destroy() {
    this.destroyed = true;
    clean(this.buffer32);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
var blake2b = /* @__PURE__ */ createHasher((opts) => new _BLAKE2b(opts));

// src/core.js
var utf8 = new TextEncoder();
var text = new TextDecoder("utf-8", { fatal: true });
var fail = (m) => {
  throw new Error(m);
};
var hex = (b) => Array.from(b, (v) => v.toString(16).padStart(2, "0")).join("");
var unhex = (s) => Uint8Array.from(s.match(/../g) || [], (x) => parseInt(x, 16));
var concat = (...xs) => Uint8Array.from(xs.flatMap((x) => Array.from(x)));
var xor = (a, b) => a.map((v, i) => v ^ b[i]);
function H(i, m, n) {
  return blake2b(m, { dkLen: n, personalization: concat(utf8.encode("UA_F4Jumble_H"), [i, 0, 0]) });
}
function G(i, m, n) {
  const out = new Uint8Array(n);
  for (let j = 0; j < Math.ceil(n / 64); j++) {
    const block = blake2b(m, { dkLen: 64, personalization: concat(utf8.encode("UA_F4Jumble_G"), [i, j & 255, j >> 8]) });
    out.set(block.slice(0, Math.min(64, n - j * 64)), j * 64);
  }
  return out;
}
function f4jumble(bytes, inverse = false) {
  if (bytes.length < 38 || bytes.length > 4096) fail("F4Jumble input outside this prototype\u2019s 38\u20134096-byte limit.");
  const l = Math.min(64, Math.floor(bytes.length / 2));
  const a = bytes.slice(0, l), b = bytes.slice(l);
  if (inverse) {
    const y2 = xor(a, H(1, b, l));
    const x2 = xor(b, G(1, y2, b.length));
    const aa = xor(y2, H(0, x2, l));
    return concat(aa, xor(x2, G(0, aa, b.length)));
  }
  const x = xor(b, G(0, a, b.length));
  const y = xor(a, H(0, x, l));
  const d = xor(x, G(1, y, b.length));
  return concat(xor(y, H(1, d, l)), d);
}
var types = { 0: { name: "P2PKH", bytes: 20, shielded: false }, 1: { name: "P2SH", bytes: 20, shielded: false }, 2: { name: "Sapling", bytes: 43, shielded: true }, 3: { name: "Orchard", bytes: 43, shielded: true } };
function compact(bytes, state2) {
  let n = bytes[state2.i++];
  if (n === void 0) fail("Truncated CompactSize value.");
  if (n < 253) return n;
  const size = n === 253 ? 2 : n === 254 ? 4 : 8;
  if (state2.i + size > bytes.length) fail("Truncated CompactSize value.");
  let value = 0n;
  for (let k = 0; k < size; k++) value |= BigInt(bytes[state2.i++]) << BigInt(8 * k);
  if (value < (size === 2 ? 253n : size === 4 ? 65536n : 4294967296n)) fail("Non-canonical CompactSize value.");
  if (value > 0x2000000n) fail("Type or length exceeds the ZIP-316 bound.");
  return Number(value);
}
function decodeAddress(address, expected = "any") {
  if (typeof address !== "string" || !address || address.length > 7e3) fail("Enter a public address within the 7,000-character limit.");
  if (/\s/.test(address)) fail("Address contains whitespace.");
  if (/^(secret|uview|uivk|uvf|uvi|zxview|zviews)/i.test(address)) fail("Keys are not accepted. Use a public payment address only.");
  if (/^(zu|tu|zutest|tutest)1/i.test(address)) fail("Revision 2 Unified Addresses are not supported by Veil 0.1. Do not treat this as an invalid address.");
  let kind, network2, receivers;
  const low = address.toLowerCase();
  if (/^u(test)?1/.test(low)) {
    let dec;
    try {
      dec = bech32m.decode(address, 12e3);
    } catch {
      fail("Unified Address Bech32m checksum or encoding failed.");
    }
    network2 = dec.prefix === "u" ? "mainnet" : dec.prefix === "utest" ? "testnet" : fail("Unsupported Unified Address network.");
    let bytes;
    try {
      bytes = bech32m.fromWords(dec.words);
    } catch {
      fail("Non-canonical Unified Address bit padding.");
    }
    bytes = f4jumble(bytes, true);
    const padding = new Uint8Array(16);
    padding.set(utf8.encode(dec.prefix));
    if (hex(bytes.slice(-16)) !== hex(padding)) fail("Unified Address network padding mismatch.");
    const payload = bytes.slice(0, -16), state2 = { i: 0 };
    receivers = [];
    let previous = -1;
    while (state2.i < payload.length) {
      const type = compact(payload, state2), len = compact(payload, state2);
      if (type <= previous) fail("Receivers must be unique and ordered by typecode.");
      previous = type;
      if (state2.i + len > payload.length) fail("Truncated receiver data.");
      const def = types[type];
      if (def && len !== def.bytes) fail(`${def.name} receiver has the wrong length.`);
      receivers.push({ type, name: def?.name || `Unknown type ${type}`, shielded: def?.shielded ?? null, bytes: len, hex: hex(payload.slice(state2.i, state2.i + len)) });
      state2.i += len;
    }
    if (receivers.some((r) => r.type === 0) && receivers.some((r) => r.type === 1)) fail("A Unified Address cannot contain both P2PKH and P2SH receivers.");
    if (!receivers.some((r) => r.type >= 2)) fail("Revision 0 requires a non-transparent receiver.");
    kind = "Unified Address (revision 0)";
  } else if (/^(zs|ztestsapling)1/.test(low)) {
    let dec;
    try {
      dec = bech32.decode(address, 200);
    } catch {
      fail("Sapling Bech32 checksum or encoding failed.");
    }
    network2 = dec.prefix === "zs" ? "mainnet" : dec.prefix === "ztestsapling" ? "testnet" : fail("Unsupported Sapling network.");
    const bytes = bech32.fromWords(dec.words);
    if (bytes.length !== 43) fail("Sapling addresses must contain 43 bytes.");
    kind = "Sapling address";
    receivers = [{ type: 2, name: "Sapling", shielded: true, bytes: 43, hex: hex(bytes) }];
  } else {
    let bytes;
    try {
      bytes = base58check(sha256).decode(address);
    } catch {
      fail("Address checksum failed or address family is unsupported.");
    }
    if (bytes.length !== 22) fail("Only transparent, Sapling and revision-0 Unified payment addresses are supported.");
    const prefix = hex(bytes.slice(0, 2)), def = { "1cb8": ["mainnet", 0], "1cbd": ["mainnet", 1], "1d25": ["testnet", 0], "1cba": ["testnet", 1] }[prefix];
    if (!def) fail("Unsupported address prefix; Sprout addresses are not accepted.");
    [network2] = def;
    const type = def[1];
    kind = "Transparent address";
    receivers = [{ type, ...types[type], hex: hex(bytes.slice(2)) }];
  }
  if (expected !== "any" && network2 !== expected) fail(`Network mismatch: expected ${expected}, received ${network2}.`);
  return { address, kind, network: network2, receivers, encodingVerified: true, ownershipVerified: false, curvePointsVerified: false, warnings: receivers.some((r) => r.shielded === null) ? ["Unknown receiver types are exposed for inspection but never selected by Veil."] : [] };
}
function parseAmount(value) {
  if (!/^[0-9]+(?:\.[0-9]{1,8})?$/.test(value)) fail("Amount must be a non-negative decimal with at most 8 places.");
  const [whole, fraction = ""] = value.split(".");
  if (whole.length > 16) fail("Amount exceeds the ZEC supply limit.");
  const amount = BigInt(whole) * 100000000n + BigInt(fraction.padEnd(8, "0"));
  if (amount > 2100000000000000n) fail("Amount exceeds 21 million ZEC.");
  return amount.toString();
}
function memoInfo(s) {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) fail("Memo must be unpadded base64url.");
  let bytes;
  try {
    bytes = base64urlnopad.decode(s);
  } catch {
    fail("Invalid memo base64url encoding.");
  }
  ;
  if (base64urlnopad.encode(bytes) !== s) fail("Memo has non-canonical padding bits.");
  if (bytes.length > 512) fail("Memo exceeds 512 bytes.");
  let value;
  try {
    value = text.decode(bytes);
  } catch {
    value = null;
  }
  return { bytes: bytes.length, text: value, encoding: "base64url", hex: hex(bytes) };
}
var encodeMemo = (s) => base64urlnopad.encode(utf8.encode(s));
function decodeQuery(s) {
  if (!/^(?:[A-Za-z0-9\-._~!$'()*+,;:@]|%[0-9a-fA-F]{2})*$/.test(s)) fail("Label/message contains invalid URI characters; percent-encode spaces and Unicode.");
  try {
    return decodeURIComponent(s);
  } catch {
    fail("Invalid UTF-8 percent encoding.");
  }
}
function parseRequest(input, expected = "any") {
  if (typeof input !== "string" || !input.trim()) fail("Paste an address or payment request first.");
  const value = input.trim();
  if (value.length > 32768) fail("Request exceeds the 32 KB prototype limit.");
  if (!/^zcash:/i.test(value)) {
    const a = decodeAddress(value, expected);
    return { format: "address", network: a.network, recipients: [{ index: 0, ...a, amount: null, zatoshis: null }], warnings: [...a.warnings], settlementVerified: false };
  }
  const body = value.slice(6);
  if (body.startsWith("//") || body.includes("#")) fail("ZIP-321 requests cannot contain // or a fragment.");
  const q = body.indexOf("?");
  const path = q < 0 ? body : body.slice(0, q), query = q < 0 ? "" : body.slice(q + 1);
  if (query.includes("?")) fail("Unexpected question mark in query.");
  const groups = /* @__PURE__ */ new Map(), warnings = [];
  function group(i) {
    if (!groups.has(i)) groups.set(i, {});
    return groups.get(i);
  }
  if (path) group(0).address = path;
  for (const part of query ? query.split("&") : []) {
    if (!part) fail("Empty request parameter.");
    const p = part.indexOf("=");
    if (p < 0) fail("Each parameter requires a value.");
    const key = part.slice(0, p), v = part.slice(p + 1), match = /^([a-zA-Z][a-zA-Z0-9+-]*)(?:\.([1-9][0-9]{0,3}))?$/.exec(key);
    if (!match) fail("Invalid parameter name or recipient index (use .1 to .9999).");
    const name = match[1], i = Number(match[2] || 0);
    if (name.startsWith("req-")) fail(name === "req-asset" ? "Custom-asset requests are not supported by Veil 0.1." : "Unknown required parameter: " + name);
    if (!["address", "amount", "memo", "label", "message"].includes(name)) {
      decodeQuery(v);
      warnings.push(`Ignored optional parameter: ${key}`);
      continue;
    }
    const g = group(i);
    if (Object.hasOwn(g, name)) fail(`Duplicate parameter: ${key}`);
    g[name] = v;
  }
  if (!groups.size) fail("Request contains no recipient.");
  if (groups.size > 32) fail("This prototype supports at most 32 recipients.");
  const recipients = [...groups].sort((a, b) => a[0] - b[0]).map(([index, g]) => {
    if (!g.address) fail(`Recipient ${index} has no address.`);
    const a = decodeAddress(g.address, expected);
    const amount = g.amount ?? null, zatoshis = amount === null ? null : parseAmount(amount);
    const memo = g.memo === void 0 ? null : memoInfo(g.memo);
    if (memo && !a.receivers.some((r) => r.shielded)) fail("Memo cannot be attached to a transparent-only recipient.");
    return { index, ...a, amount, zatoshis, memo, label: g.label === void 0 ? "" : decodeQuery(g.label), message: g.message === void 0 ? "" : decodeQuery(g.message) };
  });
  if (new Set(recipients.map((r) => r.network)).size !== 1) fail("A payment request cannot mix mainnet and testnet recipients.");
  for (const r of recipients) {
    warnings.push(...r.warnings);
    if (r.zatoshis === null) warnings.push(`Recipient ${r.index}: amount is unspecified; the wallet would need user input.`);
    if (r.zatoshis === "0") warnings.push(`Recipient ${r.index}: zero-amount request.`);
    if (r.receivers.every((x) => x.shielded === false)) warnings.push(`Recipient ${r.index}: transparent-only destination; not a shielded payment.`);
  }
  return { format: "ZIP-321 (ZEC subset)", network: recipients[0].network, recipients, warnings, settlementVerified: false };
}
function composeRequest(rows, network2 = "testnet") {
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > 32) fail("Provide 1\u201332 recipients.");
  const parts = [];
  rows.forEach((r, i) => {
    const suffix = i ? "." + i : "";
    parts.push(`address${suffix}=${r.address.trim()}`);
    if (r.amount !== "") parts.push(`amount${suffix}=${r.amount}`);
    if (r.label) parts.push(`label${suffix}=${encodeURIComponent(r.label)}`);
    if (r.memo) parts.push(`memo${suffix}=${encodeMemo(r.memo)}`);
  });
  const uri = "zcash:?" + parts.join("&");
  return { uri, result: parseRequest(uri, network2) };
}
function selectReceiver(address, capabilities = [3, 2, 0, 1], strict = true) {
  const info = typeof address === "string" ? decodeAddress(address) : address;
  const selected = [3, 2, 0, 1].map((type) => info.receivers.find((r) => r.type === type)).find((r) => r && capabilities.includes(r.type) && (!strict || r.shielded));
  return { selected: selected || null, blocked: !selected, reason: selected ? `${selected.name} is the highest-priority compatible ${selected.shielded ? "shielded" : "transparent"} receiver.` : strict ? "No compatible shielded receiver. Stop instead of falling back to transparent." : "No compatible supported receiver. Stop.", simulated: true };
}
function safeInspect(value, network2) {
  try {
    return { ok: true, ...parseRequest(value, network2) };
  } catch (error) {
    return { ok: false, error: error.message, settlementVerified: false };
  }
}

// src/fixtures/official.json
var official_default = {
  source: "https://github.com/zcash/zcash-test-vectors",
  commit: "78321beacb0e0477e33cd002b56585a107c2708c",
  unified: [
    {
      id: 0,
      address: "u1l8xunezsvhq8fgzfl7404m450nwnd76zshscn6nfys7vyz2ywyh4cc5daaq0c7q2su5lqfh23sp7fkf3kt27ve5948mzpfdvckzaect2jtte308mkwlycj2u0eac077wu70vqcetkxf",
      receivers: [
        {
          type: 0,
          hex: "7bb83570b8fae146e03c5331a020b1e0892f631d"
        },
        {
          type: 2,
          hex: "d8ef8293d26de832e7193f296ba1922d90f122c6135bc231eebd91efdb03b1a8606771cd4fd6480574d43e"
        }
      ]
    },
    {
      id: 1,
      address: "u1fl5mprj0t9p4jg92hjjy8q5myvwc60c9wv0xachauqpn3c3k4xwzlaueafq27dcg7tzzzaz5jl8tyj93wgs983y0jq0qfhzu6n4r8rakpv5f4gg2lrw4z6pyqqcrcqx04d38yunc6je",
      receivers: [
        {
          type: 0,
          hex: "a7244a362f49f29644a955cf0039b88a61657861"
        },
        {
          type: 2,
          hex: "435b0bbc95b5b7d52531a3944f2b85603ee22aaf850963bc156eb561edf2cbe7cf0e770e393ae5d7049026"
        }
      ]
    },
    {
      id: 2,
      address: "u1qxqf8ctkxlsdh7xdcgkdtyw4mku7dxma8tsz45xd6ttgs322gdk7kazg3sdn52z7na3tzcrzf7lt3xrdtfp9d4pccderalchvvxk8hghduxrky5guzqlw65fmgp6x7aj4k8v5jkgwuw",
      receivers: [
        {
          type: 0,
          hex: "e256dcb03e05dde7c91212b47a7461311c415059"
        },
        {
          type: 2,
          hex: "69a25a38699708e5f6e76e54e6a7a2ab84dcf288df0d1f2563670168d6c44ace0ef11155c60d5c225e9dec"
        }
      ]
    },
    {
      id: 3,
      address: "u1pg2aaph7jp8rpf6yhsza25722sg5fcn3vaca6ze27hqjw7jvvhhuxkpcg0ge9xh6drsgdkda8qjq5chpehkcpxf87rnjryjqwymdheptpvnljqqrjqzjwkc2ma6hcq666kgwfytxwac8eyex6ndgr6ezte66706e3vaqrd25dzvzkc69kw0jgywtd0cmq52q5lkw6uh7hyvzjse8ksx",
      receivers: [
        {
          type: 0,
          hex: "cad268758c5e71493066446b98e71df9d1d6a5ca"
        },
        {
          type: 2,
          hex: "9f6e0bf90a18fc0b9b83ae9f23ad4358648638482b5def8975635b66fd8a708335f9235a3186ec0f033f84"
        },
        {
          type: 3,
          hex: "cecbe5e689a453a3fe10ccf7617e6c1fb382819d7fc9200a1f42092ac84a30378f8c1fb90dff71a6d5042d"
        }
      ]
    },
    {
      id: 4,
      address: "u19mzuf4l37ny393m59v4mxx4t3uyxkh7qpqjdfvlfk9f504cv9w4fpl7cql0kqvssz8jay8mgl8lnrtvg6yzh9pranjj963acc3h2z2qt7007du0lsmdf862dyy40c3wmt0kq35k5z836tfljgzsqtdsccchayfjpygqzkx24l77ga3ngfgskqddyepz8we7ny4ggmt7q48cgvgu57mz",
      receivers: [
        {
          type: 0,
          hex: "8d653347a0fd3cd0842a790a5eaf89d8e3854659"
        },
        {
          type: 2,
          hex: "e1adf156a07d56bcac91bdb2f7bb3ea7c44569dcfee54273c09e8065807b6823faa94a77219554d0f6e017"
        },
        {
          type: 3,
          hex: "24f8a60cbd97e012618d56054ad39241411a28fdd50ee35efa91152f60d5fa21172e5d458ddbcb6b709896"
        }
      ]
    },
    {
      id: 5,
      address: "u1mtxw5nras5glkxz093282sv3n2h8qs7cpxcmmaxj96vtzjzl6rmdaxs4e9es7mxwmd0h3k5wz3ce4ll5g4jz2pn9su4pufq74pxhp4t235n6j7aed3hh8ss7pf3sekf7apsf6vtg84ue5zcq2k9q3xv5yth3q50fu4czdm8sn8q4de3m5k76g2vwwyjsf50hqfxgmwxqxu0rsy22ktw",
      receivers: [
        {
          type: 0,
          hex: "e511f439b5f96cf824cd5e0e6b2eb8ee1bc83cb7"
        },
        {
          type: 2,
          hex: "60ba572f8e379312d86897025decdd64b4b95e2c4afa9d13726b8cc393edb4988c51b976028f890f108bd2"
        },
        {
          type: 3,
          hex: "1f24294ed1b405c7b3b1c3f13db5b9b27b5d0f2aca9d589a69e5be00eb978621e6776e87ea326d47a34c1a"
        }
      ]
    },
    {
      id: 6,
      address: "u1ay3aawlldjrmxqnjf5medr5ma6p3acnet464ht8lmwplq5cd3ugytcmlf96rrmtgwldc75x94qn4n8pgen36y8tywlq6yjk7lkf3fa8wzjrav8z2xpxqnrnmjxh8tmz6jhfh425t7f3vy6p4pd3zmqayq49efl2c4xydc0gszg660q9p",
      receivers: [
        {
          type: 2,
          hex: "88533c398a49c2513dc85162bf220abaf47dc983f14e908ddaaa7322dba16531bc62efe750fe575c8d149b"
        },
        {
          type: 3,
          hex: "953f3c78d103c32b60559299462ebb27348964b892acad10482fe502c99f0d524959ba7be4f188e3a27138"
        }
      ]
    },
    {
      id: 7,
      address: "u19a4vmx7ysmtavmnaz4d2dgl9pyshexw35rl5ezg5dkkxktg08p42lng7kf9hqtn2fhr63qzyhe8gtnvgtfl9yvne46x6zfzwgedx7c0chnrxty0k5r5qqph8k02zs8e3keul9vj8myju7rvqgjaysa9kt0fucxpzuky6kf0pjgy0a6hx",
      receivers: [
        {
          type: 2,
          hex: "616fe1a9d887148d6ca10f48ccd92d0dcad24f7c4c9d73ee8122b1766459b04dac4dc07e80edb9d229bbbc"
        },
        {
          type: 3,
          hex: "cc802699330bc4748e34dd598c7124e72299e6a6d5bcc32e90409c8024868b2705aadfab6068d458f69b0c"
        }
      ]
    },
    {
      id: 8,
      address: "u13p2teem3xlvy4kwlke24hng5el2z6mn4ftj8xarwn8fy7dqt0flgcfpaxe6sk5cwawwh4tynzu7z2uschaf8tfa3tp2xgt8g4kx5lahhglcjm26jnvw7am6ld33708g0kv35pq83eg6gj82a0aau80enrhywpgr4v4m4vve7tg8vd4hz",
      receivers: [
        {
          type: 2,
          hex: "9304f6e3c889829a0a48f2ebdc0803bbbd393ebf4264e45cb7db793e9376fa85ddf31f5024e0bf796672be"
        },
        {
          type: 3,
          hex: "3ed501c9c63abaf4d0136821f9647e764555a47033ad91d734df12d046c969751330bbf493a241ec4b88bc"
        }
      ]
    },
    {
      id: 9,
      address: "u1snf9yr883aj2hm8pksp9aymnqdwzy42rpzuffevj35hhxeckays5pcpeq7vy2mtgzlcuc4mnh9443qnuyje0yx6h59angywka4v2ap6kchh2j96ezf9w0c0auyz3wwts2lx5gmk2sk9",
      receivers: [
        {
          type: 0,
          hex: "871a089d446268aa7ac03d2a6f60ae70808f3974"
        },
        {
          type: 3,
          hex: "31844683a07bf8e30057902b0d23e2b2ce9cad0b22190238ca4f329da92c7979052b00f735cb210671bdb0"
        }
      ]
    },
    {
      id: 10,
      address: "u1szwcx2zdxalyp7cfqwrptv95rnpyajejs6jmwacz4cgm2g3vzdxl5perhpg3nyhnuplvptdr4g63gupdfj5zal9v35s3e6adqsckv68hyrclan3gxaj6mz8aejzsnhqjyn32jcpnpra",
      receivers: [
        {
          type: 0,
          hex: "7cb07c31b58040ac7cc12bfaaa138cfbefb38457"
        },
        {
          type: 3,
          hex: "05683c0303858388a785b4cf15d41ac69e1d435b0ad23838e18d62f7ec41c37fc86af71dffd94dfff6b207"
        }
      ]
    },
    {
      id: 11,
      address: "u1glq6lzrxc7n7r4c922qht20zmpxyl0asfuldrjcaddagfspxpc3040fdfwdf5crw4j6j6wkx4r038s0w24w7enpyfmmdfu9t9p2amxazgvasms8l03l3j5yhrrfqy6xzue5uggef4p8",
      receivers: [
        {
          type: 0,
          hex: "3e02e08b5965fce9c20ce6de6f9407674d01ba02"
        },
        {
          type: 3,
          hex: "551a16fb00d5482a2ab25182560661cfd74a60fe77a0f1c9347f16ba5249889f3ae346ed6938c30abfaf80"
        }
      ]
    },
    {
      id: 12,
      address: "u1tqhg04ppjt6vlf2uvkygt07sqzgpclxdpn7j7ydkcr0e8ym68wn592z7uqudktrwn4u3q57flp8hw3d0wd9t0rm0e6m8eys27evfawh6zhha6eulzj86uz89swu7gtk0vcknd3dauhc96twhx20xxsp93dxahqlt7z5p04ldgy2y2lp0",
      receivers: [
        {
          type: 2,
          hex: "6493348e8aee112a87f5fa65e1c57065aad369401e05d0daa96e0bcd89e67bf19beb3ac74d599d94585a68"
        },
        {
          type: 3,
          hex: "165082de84f2ad7204426ffafd6b6c7de9cab6d25c13846a1786715268c415948db788f4a5e0daa03d699e"
        }
      ]
    },
    {
      id: 13,
      address: "u1zm98xj3ncc79sx8jxhcscptxav0p4wam8mlkf4lp69rhramz7v6fsndwxcd4qtmzkefwcwn5rgd8uztvdrvfqv32jk3xx6wlt7gae9fhs7xh48d3kn9fe92xtcff8hu0zgegmgr95qtxayjylfdct96eg2f2r06drf6sj800mcsns3n0",
      receivers: [
        {
          type: 2,
          hex: "65b6b03f7b27189cc0ed54bcf6bd938e39bfd1bf66b8a038c0a967fbc50e48c18da3de20d671858b8f7fbf"
        },
        {
          type: 3,
          hex: "c906109b51e2b37bf8b67761bfa917dc5059c357b7dc8107672b66189a0d15bc496d84ef9114c68c99c911"
        }
      ]
    },
    {
      id: 14,
      address: "u1hfgf2s4pghqteculnmq2rcnvyesml74zqfp5yfhxhwewx62q75qhgmwreg5qht7c5vu3fxefunjrarrfhmcuw2z4ndx0qx7u74gkw2n7v0ypvd4mxgzlenvs7lkurdj09zuhz6pmtuzs4m42sx92axuuru4dmgu46a920x5kuye6gxvs",
      receivers: [
        {
          type: 2,
          hex: "e987a4f50c94ba88e048638ecec706ef8a162674c9bef8caedfdf4b2131b451559090488ffe29ec02abac1"
        },
        {
          type: 3,
          hex: "7cd065b0ab297fb7fd701291d03589031fe3aadf1177902e5bcb65b5ba0aa2a0b73f09734f0b867b29763d"
        }
      ]
    },
    {
      id: 15,
      address: "u17cfcut587e3kszg8vud0z5a8lj9gyypyvtt5xn4hfc4p3kv4e0jfr2pzzxhywlkhsjldtmkvupwr7mkjvruz8gnxk7a64x777p4l3u7vpm6zsdsx88ef90x5q5sqx57fq8vtj5vk3hx",
      receivers: [
        {
          type: 0,
          hex: "40c44030e468b7091e9bb33ba0abdc63986f3c36"
        },
        {
          type: 3,
          hex: "ea9df83fbee07d6f7895ebb2ea41ec7c4ba682b863e069b4a438e31c9571c83126c305d75456412aeaef1b"
        }
      ]
    },
    {
      id: 16,
      address: "u1z6qgxh0wyw0ptgwwgsr5uv05n3xm3z8yrdr06k7q6fj9ypyjcj2hxwfmktv4a7ejaqphcgkddhsvrs93skzl3frm8e48at6huayg7k67e3c50ykpdnhva2jfh5dfcvy6nvttqwgz5a7",
      receivers: [
        {
          type: 0,
          hex: "937e71f9b2b6440a05ee1475bcc487e08a4f5801"
        },
        {
          type: 3,
          hex: "fd3e7eccdb1a91f2c4498bb7eb61cba83eca499cfde9c5ce3e3241873bad2e423abe91dece0a6930e8901d"
        }
      ]
    },
    {
      id: 17,
      address: "u1g6jcyfwqd9yx8pdg4yvf0nsr5j7k5gmx83shh8v0v3w256umheen026x66f4608w2vydyasphgp80j9avq9h56dx73gg2559l5lj707v4458a0ucyhfxcjcccfx9z9upmcf3c6hg9k8",
      receivers: [
        {
          type: 0,
          hex: "b34866819053983231c48fd8a2706cecff29ba99"
        },
        {
          type: 3,
          hex: "5ef3c8b2bf2a8b0e60a6254f312229b4124d4787e7dada5d81e16b51211707871bede32811a35f4094ae8b"
        }
      ]
    },
    {
      id: 18,
      address: "u1en8ysypun4gdkdnu8zqqg6k73ankr9ffwfzg08wtzg9z939w0wupewemfrc8a630e8gc4uqucym0l4v44fszy3et4veyypt3jsyp0whfpfsn2lw30kj8nepe6wvvasf00wklh85u9v8glqndupmamk9z2ja9sanf70pp4yxvkt3dmyzxa0kkhv2c9pxmkghrxqk0590azvya3nzrtevj449nu3laskrhf7c7nj9cyw7ty38mccg4znrr876guu6pzndx7ngwzhmlsn8d89saf5araaacrhr9958xr6z23mj4qtzzn98whdpu8u7n8fhf5d2vypljda62q73du44sf0e0kxmq3gvgkta0qqgq9w6r403gc5jz2any02etmwlttkv84hgh95czhdf2jugk3u36ke0kchcthg240",
      receivers: [
        {
          type: 0,
          hex: "06974d8bcd8ba8ef89ce36a653d93868251c2e3d"
        },
        {
          type: 3,
          hex: "3c40246912b6efefab9a55244ac2c174e1a9f8c0bc0fd526933963c6ecb9b84ec8b0f6b40dc858fa23c72b"
        },
        {
          type: 65532,
          hex: "d56a1d62f5a8d7551db5fd9313e8c7203d996af7d477083756d59af80d06a745f44ab023752cb5b406ed8985e18130ab33362697b0e4e4c763ccb8f676495c222f7fba1e31defa3d5a57efc2e1e9b01a035587d5fb1a38e01d94903d3c3e0ad3360c1d3710acd20b183e31d49f25c9a138f49b1a537edcf04be34a9851a7af9db6990ed83dd64af3597c04323ea51b0052ad8084a8b9da948d320dadd64f5431e61ddf658d24ae67c22c8d13"
        }
      ]
    },
    {
      id: 19,
      address: "u1a7gz63aey4tnj4klwauth00vnkmltwafwzk9nld2ys7yz3yjzjcdp47crc37zc4g9aq4athg9zh8r792e44kd6g2f4drhsl5ph4ja8pe4gcc9yjyf3rn7pej808hcy6xh0x6y8khmzljehjlwqq4h2czp35vu3l7aa7rpw5vcng9gswwlaqn5ptes592wejx7f49rxsvmzeqjekjtyfevehanvyksa8gtkpk75yrqnam26hzuxrtm6agaluy4hv0ha4sg6h22394m0x5th6r8uj7svzlklaja852vv9ud5gznu2sqyrsqveqjmfk9rcs59sprjj8nrt2nke862xlhvjq9y9zswen27eqj5slg52q2zch59uzwaeat8jw6z6092uu8yqqnnj7h0yguhypgd8y2wu9ftgg38ym3",
      receivers: [
        {
          type: 0,
          hex: "cdd4b2be1b57f24c85fc1e43c77bb2da2d2646f1"
        },
        {
          type: 3,
          hex: "fc235122892d611e52ee5b447a77ec5a296213948fb56d721f66f264e32e7d0ce5473005fc4c0bcf421e8f"
        },
        {
          type: 65532,
          hex: "09131fc00fe7f235734276d38d47f1e191e00c7a1d48af046827591e9733a97fa6b679f3dc601d008285edcbdae69ce8fc1be4aac00ff2711ebd931de518856878f73476f21a482ec9378365c8f7393c94e2885315eb4671098b79535e790fe53e29fef2b3766697ac32b4f473f468a008e72389fc03880d780cb07fcfaabe3f1a84b27db59a4a153d882d2b2103596555ed9494c6ac893c49723833ec8926c1039586a7afcf4a0d9c731e98"
        }
      ]
    },
    {
      id: 20,
      address: "u1ln90fvpdtyjapnsqpa2xjsarmhu3k2qvdr6uc6upurnuvzh382jzmfyw40yu8avd2lj7arvq57n0qmryy0flp7tm0fw05h366587mzzwwrls85da6l2sr7tuazmv5s02avxaxrl4j7pau0u9xyp470y9hkca5m9g4735208w6957p82lxajzq4l2pqkam86y6jfx8cd8ecw2e05qnh0qq95dr09sgz9hqmflzac7hsxj47yvjd69ej06ewdg97wsu2x9wg3ahfh6s4nvk65elwcu5wl092ta38028p4lc2d6l7ea63s6uh4ek0ry9lg50acxuw2sdv02jh90tzh783d59gneu8ue3wqefjmtndyquwq9kkxaedhtqh2yyjew93ua38vp8uchug0q7kg7qvp4l65t9yqaz2w2p",
      receivers: [
        {
          type: 0,
          hex: "9f98c3116cb2f4e6f4c814148c81e379a538ced3"
        },
        {
          type: 3,
          hex: "2526ec6552f3e0175c922f019077146b5193e880461c3e1daca4778cde010ed5875f16b743ef86ac648b3d"
        },
        {
          type: 65532,
          hex: "5d99589c8bb838e8aaf745533ed9e8ae3a1cd074a51a20da8aba18d1dbebbc862ded42435e92476930d069896cff30eb414f727b89e001afa2fb8dc3436d75a4a6f26572504b192232ecb9f0c02411e52596bc5e90457e745939ffedbd12863ce71a02af117d417adb3d15cc54dcb1fce467500c6b8fb86b12b56da9c382857deecc40a98d5f2935395ee4762dd21afdbb5d47fa9a6dd984d567db2857b927b7fae2db587105415d4642789d"
        }
      ]
    },
    {
      id: 21,
      address: "u1sem2gcey0emntrvxyjv8hyhq0w5fr4sxaj3cppgrfqgg6laydh8m78gy2cw2p54zzak3alnnsx4xjuhazpkrfcd90wl0c7ldj6y095hh5j6j2evry9vg5jqp4dyqpwqeryu7pes4sxyyyqwn6egs5daxk4473v9xpgzrwv5n0tvs93nlj4xpphq4vs2w8um9ph7zkte08t7fa509mnrt9apuhr22xq34mp2svjnq6rvfn0hg6lkehxtlj39vgjxjlkjfhx8rw2f02ckq8k5szcxsnhkgr2cqlmf2udl2gqdqr5t6",
      receivers: [
        {
          type: 2,
          hex: "da2672c010f7364df6fad49dd39be0e4d4be73c45e239448fcc385cc68094bf36ddbc4ec0219b567955556"
        },
        {
          type: 65533,
          hex: "d17d19f3355bcf73cecb8cb8a5da01307152f13936a270572670dc82d39026c6cb4cd4b0f7f5aa2a4f5a5341ec5dd715406f2fdd2afa733f5f641c8c21862a1bafce2609d9eecfa158cfb5cd79f88008e315dc7d8388e76c1782fd2795d18a763624c25fa959cc97489ce75745824b77868c53239cfbdf73ca"
        }
      ]
    },
    {
      id: 22,
      address: "u10j2s9sy4dmuakf57z58jc5t8yuswega82jpd2hk3q62l6fsphwyjxvmvfwy8skvvvea6dnkl8l9zpjf3m27qsav9y9nlj59hagmjf5xh0xxyqr8lymnmtjn6gzgrn04dr5s0k9k9wuxc2udzjh4llv47zm6jn6ff0j65s54h3m6p0n9ajswrqzpvy8eh4d5pvypyc6rp5m07uwmjp4sr0upca5hl7gr4pxg45m7vlnx5r7va4n6mfyr98twvjrhcyalwhddelnnjrkhcj0wcp5eyas2c2kcadrxyzw28vvv47q74",
      receivers: [
        {
          type: 2,
          hex: "9b728ad6f50371e961236630b3c8cdd8149ca22cdb87a62cc0ba3e3cfd2b0adcc82930e447f8dcf54b450b"
        },
        {
          type: 65533,
          hex: "ec65604037314faaceb56218c6bd30f8374ac13386793f21a9fb80ad03bc0cda4a44946c00e1b1a1df0e5b87b5bece477a709649e950060591394812951e1fe3895b8cc3d14d2cf6556df6ed4b4ddd3d9a69f53357d7767f4f5ccbdbc596631277f8fecd08cb056b95e3025b9792fff7f244fc716269b926d6"
        }
      ]
    },
    {
      id: 23,
      address: "u1mtnedjgkz5ln6zzs7nrcyt8mertjundexqdxx52n2x4ww3v52s0akf3qy6sqlze3nexcjsxtcajglxcdwg47dsrrva6g5t4nf8u3sjchhkmsqghelysrn0cl52c2m8uuv3nyfdv258jjqnvd4lgqtugc8aqvpmt05c49qv2yqlhxvnq9phdamm4xv89cc7tzvzgmwltxxdsvme44dgzt8prkcwcsma8cdr76m8n0xwj02tpr9086a237xakkdf8fumsj8u4r6qlf0d59x0mw83ar36vrcr94zsherapa0566vd22",
      receivers: [
        {
          type: 2,
          hex: "9dd77ff5af4c80c25114e83758cbe1b535cfe9413017994163a12b0de522cdd1b5d4be299c0788ccb1541e"
        },
        {
          type: 65533,
          hex: "2e9596fa825c6bf21aff9e68625a192440ea06828123d97884806f15fa08da52754a1095e3ff1abd5ce4fddfccfc3a6128aef784a64610a89d1a7099216d0814d3a2d452431c32d411ac1cce82ad0229407bbc48985675e3f874a4533f1d63a84dfa3e0f460fe2f57e34fbc75423c3737f5b2a0615f5722db0"
        }
      ]
    },
    {
      id: 24,
      address: "u1n9znrl4zyuvds24rcapzglzapqdlax4r8rgkvek0y0xlzfjfvn7zexelrafkchea24w030cr9jqsel7t8lvveaq7m7w4z0khmrlzc6748w9ldlccy02scd5xngtcv2yy4ctnyu9zn5m",
      receivers: [
        {
          type: 0,
          hex: "65704e3ab767ca578e5b092fb47604f659475bae"
        },
        {
          type: 3,
          hex: "5f09a9807a56323b263b05df368dc28391b21a64a0e1b40f9a6803b7e68f3905923f35cb01f119b223f493"
        }
      ]
    },
    {
      id: 25,
      address: "u19f2knszheph2dt8lrnwqeeq9krnw39pgz8syqv028ghtg7kjz6xvu23suv5hmdmj7e6fjuu6060y34fdw8ccjlp8gsqp0usyhrgw3reqfveet7hh2pqcjafysqqv2l3felj7sl7a7ym",
      receivers: [
        {
          type: 0,
          hex: "ef85a6553d89f153b37afcab928eb2bb5fb337db"
        },
        {
          type: 3,
          hex: "21006cfbb3db4f4bb63111ef63f7f80056f31b344d06aca5b7fa0740c660c8b2dc3bd234f4c18ae9eaf811"
        }
      ]
    },
    {
      id: 26,
      address: "u160suxvjkgt22zcp7f9xw5f0axdu7rxdt5ktyexpn4cq70w4at2f74390mns7uksfenrdmcjjzqalyfky6tq05jv8mnamrkyxn9dcxe35z4x6m35cczmjcj55g0fc6a2thz03sjfywxa",
      receivers: [
        {
          type: 0,
          hex: "f96a00ef8b2233236967a6a43f07ec6074f7fdc5"
        },
        {
          type: 3,
          hex: "04915d2bebce11111ce195226cde8440263c50204b2272ac8a96b38dbd70db8969ec9b6c87cd15d9d76512"
        }
      ]
    },
    {
      id: 27,
      address: "u1ddnjsdcpm36r6aq79n3s68shjweksnmwtdltrh046s8m6xcws9ygyawalxx8n6hg6vegk0wh8zjnafxgh6msppjsljvyt0ynece3lvm0",
      receivers: [
        {
          type: 3,
          hex: "e340636542ece1c81285ed4eab448adbb5a8c0f4d386eeff337e88e6915f6c3ec1b6ea835a88d56612d2bd"
        }
      ]
    },
    {
      id: 28,
      address: "u1nztelxna9h7w0vtpd2xjhxt4lpu8s9cmdl8n8vcr7actf2ny45nd07cy8cyuhuvw3axcp545y0ktq9cezuzx84jyhex8dk4tdvwhu4dl",
      receivers: [
        {
          type: 3,
          hex: "3fadf8edb20a3301e8260aa311f4cbd54d7d6a76baac88c244b0b121c6dc22a8bcce15898e267829fc1e01"
        }
      ]
    },
    {
      id: 29,
      address: "u1trxzh330wl8wkh92uwv508z0qfx270ruuar8fxeng7arry5d73q9ve6gfud36s9nc4qj3uvn082l9srrfayjhnf20mmunywtvqzgc90c",
      receivers: [
        {
          type: 3,
          hex: "987fd74a2256c596a66f83eaff7bb026286e972be56d3b50e3459747dfba53ffa0f24732b4aa6cd437a317"
        }
      ]
    },
    {
      id: 30,
      address: "u1xdrenc94696j8clxa2xnkdg8xd5t3y8s24urctyxu87vggv0u46qr4lkpnh7gqqdev9wwugt6xkv8c8du8ufhfl8nfjnzusf6cw20wpm85hlshmnmj2lkyhka9rua7qw7kr0xeajk7y2rlsuwl6z6l5l3wq3v6rrqt9e8zy7sc7pww45jznrj4xy6h9rp4kjy5xtl5upr30u4cyk58kv3t80k3p8w97k3e345h7avmjylxakx6sgyk5ss8th5kqay50ewav62eeep7tghzejaflsdstpwz55haex398jqpq27007me2",
      receivers: [
        {
          type: 2,
          hex: "99ae333db1074fca1a6a94bed3ea548c1db2512dfbe75af9e84c162260b4813bb6bdb4443969daa5713ff1"
        },
        {
          type: 3,
          hex: "cdf7fed0d0822fd849cffb20a4d5ee701ad8141e66d81ddfabf87875117c05092240603c546b8dc187cd8c"
        },
        {
          type: 65532,
          hex: "657b43ee8da645443814cc7329f3e9b4e54c236c29af3923101756d9fa4bd0f7d2ddaacb6b0f86a2658e0a07a05ac5b950051cd24c47a88d13d659ba2a46ca1830816d09cd7646f76f716abec5de"
        }
      ]
    },
    {
      id: 31,
      address: "u1y647tzm2ms4stj8skfswfljmvatmhwqzjzl2uq5v3a78ys2mls2g9thdap4yfmr9tw6y5h9gnehzhpddyl43enmhd6xv2udcttqmas35l62jt2yar33jwr5eulchzxg3d8upf2raqcx3jup8s3dep6an5n5xh9ngdjfp4hjv8fwfhh34kvglsug57zf0duypq6ugmysw0mnhdg5fz9sndputdc7pdssg6k3ks76wrrnuu5najqxj8xchp5xv5ahfh3f2szrfl5cm6mslq2f69ja9r54plen209xwpdpwsvm6zep4gwl",
      receivers: [
        {
          type: 2,
          hex: "52d58f91376aa980f2b9a6283ff357e84246d6942352184886449ffea8fad7e7ca5b490d090a96e0323392"
        },
        {
          type: 3,
          hex: "e4e01051b99c08506834971f80dadec44a4da13ecdcba617f77fc48d25324f57cb1d4d7424705d573cd682"
        },
        {
          type: 65532,
          hex: "07fe9b523410806ea6f288f8736c23357c85f45791e1708029d9824d90704607f387a03e49bf9836574431345a7877efaa8a08e73081ef8d62cb780ab6883a50a0d470190dfba10a857f82842d38"
        }
      ]
    },
    {
      id: 32,
      address: "u1m5jvynaxyrtk27mt23q0j4r8uf5dzzhlwf6qd4s7pfdclqnmgkaf82kqrch0p44kd97f9pmwnk6q3rnjnzvlwv2ll289ahzlee4zcnual03ntelg2q2wxlqc6ueav935j4j2rzv2gxcdh6lk67quzxnxt5ay9xh0qjc9575dptfs9luhhr0m9wms2taq2vnrryjdj3ht5cktwathcerl9kw25y89f3hffyr65rnfw0jk2ka7703m8wym0c04u6r0xgagpn7xzfaxttrwgftmztzln6y2qcdglk3u28dgrswywqne28g",
      receivers: [
        {
          type: 2,
          hex: "7a53f581d15985d0aafe134adb9540ffd19d965a43977ed4cb552cac5740a907ea24a9152b52268fe8cc3f"
        },
        {
          type: 3,
          hex: "b5a053ec1ab0623ce04f350cbb26031338dea9074551433adeb1bf3cb67c1e93982f42de822ebe4299692a"
        },
        {
          type: 65532,
          hex: "25b3d6da0573d316eb160dc0b716c48fbd467f75b780149ae8808f4e68f50c0536acddf6f1aeab016b6bc1ec144b4e553acfd670f77e755fc88e0677e31ba459b44e307768958fe3789d41c2b1ff"
        }
      ]
    },
    {
      id: 33,
      address: "u1tqx832p4wsfe9pd67ggm3qsmfuvdhqvw2259y7uwug7y0lpeu87fmgpqh3zmamex3fzs0d4ct4hhsg2csj5z0q5f3f7n656ap8e4nlng9c4440rz9s7ekxanfw6g84f7vu82fumtmlz3vstl2a9ufa0970k4knsz2wpsjt2xycqeay76pt4fx3ak9y7mps2q6qe2n2h7wkakxr7xu6vd36zhhzgln7ttmrzc0f9ye3jmyu2pp8l8rect87lfxj2fgckcwz3svdx70a947fz04kgu7e907enzrk676zdkdmuyw2kyrclkmj62kmyy2rjetpus7knmxfuu7z0m63uwfhdynhuu3yrjqu5y089v8zwnh60mw5ngc0kszdjmc339fk9mjn396m5ekv7h7td7fa0u9097xph3y5vth9af4sw6ykxdms84wr544mxxqtmgj027d9e8rnlrazge0kwyydyhder3chwhmaqjk9skuxgxzternw4xx962qed",
      receivers: [
        {
          type: 0,
          hex: "294dbb37edd92ce046e266e22b0ed530a44b79c7"
        },
        {
          type: 3,
          hex: "24fd59f32b2d39dde66e46c39206a31bc04fa5c6847976ea6bbd3163ee14f58f584acc131479ea558d3f84"
        },
        {
          type: 65531,
          hex: "2fe806b94569cd4059f396bf29b99d0a40e5e1711ca944f72d436a102fca4b97693da0b086fe9d2e7162470d02e0f05d4bec9512bfb3f38327296efaa74328b118c27402c70c3a90b49ad4bbc68e37c0aa7d9b3fe17799d73b841e751713a02943905aae0803fd69442eb7681ec2a05600054e92eed555028f21b6a155268a2dd6640a69301a52a38d4d9f9f957ae35af7167118141ce4c9be0a6a492fe79f1581a155fa3a2b9dafd82e650b386ad3a08cb6b83131ac300b0846354a7eef9c410e4b62c47c5426907dfc6685c5c99b7141ac626ab4761fd3f41e728e1a28f89db89f"
        }
      ]
    },
    {
      id: 34,
      address: "u1adph5ua2pv8ghr7utshst0fm0ad7tj32y09t2nhxn2ccwm6hengck3w2vy34tvhqay7rlw8vcfh63f85lh7lz63l0c5vja49tu8vcxvx30re085n8jt5hcqh4g4ec77czl4c8nspqps2ac2g5kxhl4j5g6mz3vsvxrg74e8p9s8hhqu8u3gldhxvrxg2htykqc7ceh930f3edxsg49nctv2e36cne6qpkvxzfymh2el2eguw6kg7zvdu620rgk4cwyvt9hz7zpjk9wskjdpk6p3cpyx3yuf5lk46nx2fyqjca3vtz8d9df3tpmg74d90uv7pp09apfa5ep374clznmh2ne5suxtzk22cp7mvu9gtswpvx9wfst63s73yjwqu9cjenwntdsep0uqz2hgnh4xpq0rlllwgv8z70ke6z5zkwnjmlrzt6nsvhac4zz245rp3rkj9lmj8tvpfmd0zawy08dv3hqxxf8cr06x90amtgkh2ura0yyfwucu",
      receivers: [
        {
          type: 0,
          hex: "6462c9a3003e4d0e0ab764860d8b71f8a36a23ff"
        },
        {
          type: 3,
          hex: "933bf1eb8fc99c38251bd42bb2e7e4afe526352a9b024f8d671b4d337277194b52338a91ce472503a48a00"
        },
        {
          type: 65531,
          hex: "fdeca364dd2f0f0739f0534556483199c71f189341ac9b78a269164206a0ea1ce73bfb2a942e7370b247c046f8e75ef8e3f8bd821cf577491864e20e6d08fd2e32b555c92c661f19588b72a89599710a88061253ca285b6304b37da2b5294f5cb354a894322848ccbdc7c2545b7da568afac87ffa005c312241c2d57f4b45d6419f0d2e2c5af33ae243785b325cdab95404fc7aed70525cddb41872cfcc214b13232edc78609753dbff930eb0dc156612b9cb434bc4b693392deb87c530435312edcedc6a961133338d786c4a3e103f60110a16b1337129704bf4754ff6ba9fbe659"
        }
      ]
    },
    {
      id: 35,
      address: "u12acx92vw49jek4lwwnjtzm0cssn2wxfneu7ryj4amd8kvnhahdrq0htsnrwhqvl92yg92yut5jvgygk0rqfs4lgthtycsewc4t57jyjn9p2g6ffxek9rdg48xe5kr37hxxh86zxh2ef0u2lu22n25xaf3a45as6mtxxlqe37r75mndzu9z2fe4h77m35c5mrzf4uqru3fjs39ednvw9ay8nf9r8g9jx8rgj50mj098exdyq803hmqsek3dwlnz4g5whc88mkvvjnfmjldjs9hm8rx89ctn5wxcc2e05rcz7m955zc7trfm07gr7ankf96jxwwfcqppmdefj8gc6508gep8ndrml34rdpk9tpvwzgdcv7lk2d70uh5jqacrpk6zsety33qcc554r3cls4ajktg03d9fye6exk8gnve562yadzsfmfh9d7v6ctl5ufm9ewpr6se25c47huk4fh2hakkwerkdd2yy3093snsgree5lt6smejfvse8v",
      receivers: [
        {
          type: 0,
          hex: "d5bca9e4e50be0c16bdfed7e5aca20ad43a23f20"
        },
        {
          type: 3,
          hex: "5ef2817381571b0e85215959f1fad87bf99bfb0799d81b2824fe4cc10f07776bbe7305e7c4c3933be4270f"
        },
        {
          type: 65531,
          hex: "51e610620f71cda8fc877625f2c5bb04cbe1228b1e886f4050afd8fe94e97d2e9e85c6bb748c0042d3249abb1342bb0eebf62058bf3de080d94611a3750915b5dc6c0b3899d41222bace760ee9c8818ded599e34c56d7372af1eb86852f2a732104bdb750739de6c2c6e0f9eb7cb17f1942bfc9f4fd6ebb6b4cdd4da2bca26fac4578e9f543405acc7d86ff59158bd0cba3aef6f4a8472d144d99f8b8d1dedaa9077d4f01d4bb27bbe31d88fbefac3dcd4797563a26b1d61fcd9a464ab21ed550fe6fa09695ba0b2f10eea6468cc6e20a66f826e3d14c5006f0563887f5e1289be1b"
        }
      ]
    },
    {
      id: 36,
      address: "u1uehkuaq6rpfgt4ed5zpvhczg9apgpmyk5eq9qg23j8w7jxkhdnqzacte6gu8zgzfzgxy48ryzus3wnkhfxrxmlhs34xde3f34uxcnv3y6dsgj288vu56xs9f6ghvqsgkhuwtz4kkfxj8pa27v5p3ttlst340zvwx9nj6s0zw8p3wwk3zh37dwc7znqz52gj2fpaapzxzyagah0aeyxwa9fxxvyyj6w989v96ymsgf7s8s6ej9346p60fcjzzynvf9rmxevumdvt8l9mvhdfz4u5j4h7e0zjr2sde7fu7z9s02447qg6qzllm22egnx6ej6qczkkk2ygvpy08un9ggp853sddp6vskrlar6sygxec5f6c2t2eu9zmc728esy4sj9z853gxuplr6hw7lpcwzk20d85vuflnhlfv8nr3020r0v9z83ryudsyjv66rttxq2cscqlrdxakrmpjptzcf",
      receivers: [
        {
          type: 3,
          hex: "6ed96d65379d5ece656901f5cb20cf554ce18600d4a1edcf6812f4459d7ff73cf2b88cd8476b75e8c08d28"
        },
        {
          type: 65535,
          hex: "34d6e84bf59c1e04619a7c23a996941d889e4622a9b9b1d59d5e319094318cd405ba27b7e2c084762d31453ec4549a4d97729d033460fcf89d6494f2ffd789e98082ea5ce9534b3acd60fe49e37e4f666931677319ed89f85588741b3128901a93bd78e4be0225a9e2692c77c969ed0176bdf9555948cbd5a332d045de6ba6bf4490adfe7444cd467a09075417fcc0062e49f008c51ad4227439c1b4476ccd8e97862dab7be1e8d399c05ef27c6e22ee273e15786e394c8f1be31682a30147963ac8da8d41d804258426a3f70289b8ad19d8de13be4eebe3bd4c8a6f55d6e0c373"
        }
      ]
    },
    {
      id: 37,
      address: "u1m76hh3wch9vwctg92h0jjt8zu6dry4zl97q9q94huutng5sxyhlzgfj64jqnvla2vqrqe0ndt67td2kejv6zlcw9zeurexxs67l7y67p7mww2j2uvfsp6uynct2apcr0m9xrmswtktmgs3x2glvndrqazy0gyrp30j328h4m5gkju9rl3pfrtjn9tm8v0rzr6t8gkklqfxgwk976dvv4kh7hl5utp9gjryu8wwu80h733ss5cjwpeewdgd3l8h46c0c7hxz4c6daws3vurq2fj9h0hpjnycup9tu8nfahvqjxewyhyuzynnjxa7jrvw2ekdytqs7sn02gqx4vxtkjzfrcy67lkmr6p5kalj0g8apazeyzqw3ywppy9482wj8k4tm06573nr3h78ecq9n260g7c0hm5jm3ffa4g2vk0edpdsnemksdegxgt9s7h8v8pjmcp23rnahmzf8pxdtdt",
      receivers: [
        {
          type: 3,
          hex: "b6f481042a780462ffa96f81e1288978e5f05c791587de7e957729bcac6eb95892532b0fe13e9c7eef6a24"
        },
        {
          type: 65535,
          hex: "d456851879f5fbc282db9e134806bff71e11bc33ab75dd6ca067fb73a043b646a7cf39cab4928386786d2f24141ee120fdc34d6764eafc66880ee0204f53cc1167ed20b43a52dea3ca7cff8ef35cd8e6d7c111a68ef44bcd0c1513ad47ca61c659cc5d325b440f6b9f59aff66879bb6688fd2859362b182f207b3175961f6411a493bffd048e7d0d87d82fe6f990a2b0a25f5aa0111a6e68f37bf6f3ac2d26b84686e569d58d99c1383597fad81193c4c1b16e6a90e2d507cdfe6fbdaa86163e9cf5de3100fbca7e8da047b090db9f37952fbfee76af61668190bd52ed490e677b"
        }
      ]
    },
    {
      id: 38,
      address: "u1c2tpmmdl49pdcfntc2e2gjaxmj2a0ackydlj9aeuqlet4erjdn2edwvtx6vd8nrkxjnvgckn4j3nx48p2gep5x23akrl2cv7u2un4vmjed9hav39taqgzyp602m3tpcv3uzdsjdyl8wxrjycx5aus8ypq2xja8yw0cf045n0zvwt3ajtgs2xyzjl6cq2245avkm26qjv72ta65h04etlp4ntdq87eu9efjx5v6gjsfvwrdt99m4lpu9j52t0h8yvpnzukuzdt89e3pg9cmderzh7tnahmw0rfyc37aqmd6dh24fnxmxagsj4mtz8jv3c3ch20xu4k6whwfsaf2sra4ktgdej9p6kqz05ae3vl3f93xsfx05xpaf884h56epcetx627jttgx2499vc0uzxl83hcdt92z4hy5la40ervrpha4kn3kxxwrngdj76u6mrfcmt4737czn08vd60k5gj",
      receivers: [
        {
          type: 3,
          hex: "a8e557a58a1908eb8a1bb078b77a95c032fe0a0069ce8c89d3e7705a48d2c08f7b604e5af0218d8cc9c8b8"
        },
        {
          type: 65535,
          hex: "515d014384af07219c7c0ee7fc7bfc79f325644e4df4c0d7db08e9f0bd024943c705abff8994bfa605cfbc7ed746a7d3f7c37d9e8bdc433b7d79e08a12f738a8f0dbddfef2f2657ef3e47d1b0fd11e6a13311fb799c79c641d9da43b33e7ad012e28255398789262275f1175be8462c01491c4d842406d0ec4282c9526174a09878fe8fdde33a29604e5e5e7b2a025d6650b97dbb52befb59b1d30a57433b0a351474444099daa371046613260cf3354cfcdada663ece824ffd7e44393886a86165ddddf2b4c41773554c86995269408b11e6737a4c447586f69173446d8e48bf8"
        }
      ]
    },
    {
      id: 39,
      address: "u1dqavtnjvu42hlsjw6sc2mxajqlyt03zg8l4luykz9fnchunq74nqxhfp58h5n5xfpyqhheax8thta8lfkjgp8wqwsavc0g4mgu4du02c",
      receivers: [
        {
          type: 3,
          hex: "5178924f7067eac261044ca27ba3cf52f798486973af0795e61587aa1b1ecad333dc520497edc61df88980"
        }
      ]
    },
    {
      id: 40,
      address: "u1q8g29qhrktunc24lud3fgk007u7ya8q5g8vy9awadxtl7wu5vjllr4mmdfwk0zdh8zqxgl93sthzumeanzzkdqmqdft6ryhwtvqyqt3e",
      receivers: [
        {
          type: 3,
          hex: "907639193311a847366c1a43ebaadd935a53180fd3e1219c07c8205f45077bc1768abdcf2425a4a13c4aba"
        }
      ]
    },
    {
      id: 41,
      address: "u13j3q8q8f9hx2nx0w9l52dqksy4png7fgm0lqjh8ahn9enyvz5z9xnwzdcdjmpf756s2y88rnyr9px4f4k9w03sl6fr4vwsqcvg8ggfjx",
      receivers: [
        {
          type: 3,
          hex: "2809ddfc7db70c660a6c3fc7560c7add1c7889d9b277cb92d14cb40d2de00aae31670b753a42bdcdc3c220"
        }
      ]
    },
    {
      id: 42,
      address: "u1ukslldhknrzmvpdmn03u03edgfy976w3muurfs9asvh3n9uh9h6sgle6m7yjgf3wafxtvke08u735v4nd3kjqnyulw7cvxh6ke357knyjudgqtes6kcw7y28e6kewr03pjah5mh26na",
      receivers: [
        {
          type: 0,
          hex: "e8225b817cdcfd01307c66ca35188e9b1ac238ca"
        },
        {
          type: 3,
          hex: "b208c9235c8d40e49b76100b2d010f3783f12c66e7d3beb117b2c96321b7f6562adb4efc144e39d909e728"
        }
      ]
    },
    {
      id: 43,
      address: "u1a0dnfvgdp4khm5yk79ltkkvp8jjmjykjy38cdue8ktl8askwenl4lzfyu0p7end0guyu6up57wylzns0tpr99wz5z8edh5u0m4yzuusysr3d2xczwkp82atq3vfw45u2yvtau852lnw",
      receivers: [
        {
          type: 0,
          hex: "3869048bd22a3c3e6bc884333b0a71b05f7f4125"
        },
        {
          type: 3,
          hex: "332f451dc6f7da17fe5ff4077d3d5db79a036e712df558853d4a854ac4f6e51474cf75f38fa97c22b4cf09"
        }
      ]
    },
    {
      id: 44,
      address: "u1a84vn0qes8q3jhk7zxs2whd2p922far8kztqdapergs5ej8rarn53v5ddnd6t7e3l5efhaefrhkptatnzq565nrpvf7kn2787gdvervmk08azp4qgehaew2zplkxkkyu36l3v7drg2v",
      receivers: [
        {
          type: 0,
          hex: "59e919ce60110f97707c5c232b7d4db19e32c3ed"
        },
        {
          type: 3,
          hex: "3b68c29b4a138b289fea8b6795e64759a7cd7c0aaf4bb98ed3079959b0bba9b761704b6cfc1465ad74bb05"
        }
      ]
    },
    {
      id: 45,
      address: "u187vrwl4ampyxd5m6aj38n4ndkmj8v6gs97hkt23aps3sn5k89a0gk2smluexgdprcrtm56ezc5c7tjwlrnnl79tjtrxmqd42c5mpyz7g",
      receivers: [
        {
          type: 2,
          hex: "eee19641bc6b802f353eb793f728b17a277ef0358696a24a7122bc56537b229647f3810d27ce45227c6f39"
        }
      ]
    },
    {
      id: 46,
      address: "u1xd83nhheggwe78x3lvcygdl8cmwz3gfxnr02sytkxvfpwdep9dzl7vte48zhkx39s705yqp20rw4l835fhg3ylkde44l7glt3cyps5wk",
      receivers: [
        {
          type: 2,
          hex: "50ca46f825f7f423007aa4147169b529f07f1c8ed634fafc8145a4813177dd1257ee8d8fc5f44e9b564f6a"
        }
      ]
    },
    {
      id: 47,
      address: "u1w7x9ttwvk30grems6ae3rhgs6xytrrueaklyc5t509fpux7043fzla70jehhxyn4mg9d3ym095s3wghl9trvvdmu56yn74ajqy38ufjg",
      receivers: [
        {
          type: 2,
          hex: "c412c8ff78f28d9b3391f4ab15d06acf46ac052821ee096a51524813f2adf9a4065cc6c45feba2c052df9e"
        }
      ]
    },
    {
      id: 48,
      address: "u1smpx6drvevct3dyrer7esjlct99lf4nxdeltdetyxjdrmtqag7q7mkrd8rxlvj9e5vy0qy24fhvvvrj7agfdgxapefxe72xl8vuu9ds5yfq0p86r3y0jw4suurzjz5s6lzrxkfft4am",
      receivers: [
        {
          type: 0,
          hex: "f441228ee26a3a7d0d00e4d65ba49e3aa4877eb8"
        },
        {
          type: 3,
          hex: "2598d84dffb34f5908b90732490f3881399150d4c694fce9bf30d1560b2c56f09829fe123b9add20e5d71c"
        }
      ]
    },
    {
      id: 49,
      address: "u1ymxkv9nks7tuzjt265fg8vctdq5nxqw4l0q2xj2ya5dkt660rrzkg032v5duhgeqae6cnh9tzxry4dspv8yvtq5lem9gujysaz64034mavd8p0ejqhnvp2jg34nt24y2c2whclxxk94",
      receivers: [
        {
          type: 0,
          hex: "9f1f8526792b04efdda3b38981867397ac11e3c0"
        },
        {
          type: 3,
          hex: "c1150ae8529e667015c462f91fb26e9124095aebd6e72fca95a2fe17ae53e8cb101eda84d9fb4d336ee103"
        }
      ]
    },
    {
      id: 50,
      address: "u14j8rtl62a70skh0nhzv7tasxsa69axm0vlac37ye3mcgfpjk6k9ury7hlmet0grhvhedtfj27xmsygp06pcm932f8sc33u5uwps57d89667kyhwmj8pucp5r8cel2lhuaxmx5ftm2nt",
      receivers: [
        {
          type: 0,
          hex: "6149d0373c63fddd4fca3b9f5407ad22abda0df2"
        },
        {
          type: 3,
          hex: "e961944a708a15c9c62734c34510bb5e2cd740abdeb488e4142b5d402b0295bec67922f1e71ab7fbd0a2ae"
        }
      ]
    },
    {
      id: 51,
      address: "u1xjkw3lwwf9crx8cz050gdwfejufzhcusc37ged99w8fyj7tyx3e7hgmauyuv538dak2sepq6wjv4tyyjnhcef02dr682y5dsuzuftsx83lrvfc6dxd0kk260m4p3c9ka96vf3z9u6axvsj47mfd6kszy39e5gma28yg88yp92kxjt8ah0x329j4gxjdfyn0n2wp3urwrxxz6z0ynx82",
      receivers: [
        {
          type: 0,
          hex: "0eb9651c003776ab5d1e93c2779d10a0bdc3bb77"
        },
        {
          type: 2,
          hex: "d3a803803feee7a032a24adfaa8f6a94cecb9671c1333d0d5d1a3d79d82bc310727c665364d71022559c50"
        },
        {
          type: 3,
          hex: "7c98b8f613f9ff02746bea2a167cfd1bd3a1862af9631bf61d9d604e0824e2cb8467a1e549db87a76e7a8a"
        }
      ]
    },
    {
      id: 52,
      address: "u1p4c4u3uz2vtkedv78d4phjav86exankz0x9wmrmz8q4mxqaf43gwd0qt486jk5jvpvyccc6lyy2vaq3ht8ngnw4vusryxd9erhhl2uy5x6x4huyfdymwxj7dkyyeut8ld36kxwu3v5wjg7jwp9kr8ul7u3xdakfunvmwq0rkv6y4k0ngm2n24x763uurfmrr685welsefyys2xwp8ug",
      receivers: [
        {
          type: 0,
          hex: "69f48a4974e80758ed435592a1dd4e4b38826cbc"
        },
        {
          type: 2,
          hex: "25c25d58c50533dfb55d29f9a8864f58f02ea4fed44369352c43538cdf9545b905bb2ef0961bd2daf25883"
        },
        {
          type: 3,
          hex: "8a1bff2a9d921e1153b3cb264bc05185a9811de911d53467935434d6537d306752d02054fe5a170464259d"
        }
      ]
    },
    {
      id: 53,
      address: "u1ap7zakdnuefrgdglr334cw62hnqjkhr65t7tketyym0amkhdvyedpucuyxwu9z2te5vp0jf75jgsm36d7r09h6z3qe5rkgd8y28er6fz8z5rckspevxnx4y9wfk49njpcujh5gle7mfan90m9tt9a2gltyh8hx27cwt7h6u8ndmzhtk8qrq8hjytnakjqm0n658llh4z0277cyl2rcu",
      receivers: [
        {
          type: 0,
          hex: "f1bc3d7261bf77fe808e2b7178981c7cfe5570fd"
        },
        {
          type: 2,
          hex: "54b7fc0c85d378f375be48218a85424bb9e7a304830e9eb7255a12a09c961cca1f629b867e13242ed90d92"
        },
        {
          type: 3,
          hex: "14adca6f616abcbe5bc850cc617dcf999517a9a790292fec6bc0761eaa790333e7d06d016de05bca7c6712"
        }
      ]
    },
    {
      id: 54,
      address: "u1udmzarqn6y9026whk083lm5vs8pv282egeln6xg0n2a3w4klkpn6208h68ntuus7gp54d937u4f724v2xgdx6qeu74j45vxfn822xty2yyx6u0ecakj8r9uu3r2jqafj64w7updkhtq",
      receivers: [
        {
          type: 0,
          hex: "407158fc804361fcb965dfa4882f0f1df5a49f47"
        },
        {
          type: 3,
          hex: "a80405d5568ab8ab8f8546163d951ab297fd5e6f43e7fcebcb664feacfab5afd80aaf7f354c07a9901788c"
        }
      ]
    },
    {
      id: 55,
      address: "u1fyvdgdehrx3gvjx5f2ez2lkcm0lcrfxg8hksdmg3g8zujfz8xk2kyhu4dafs99y96sq2t5c3d3zsxhhnlfmj6trmttg5awtwczz8g8xjr7u30hxc4nkyfyefyl4xt3dxdjevsnrkqdg",
      receivers: [
        {
          type: 0,
          hex: "f597980d65ca2ecd0fab5354e66ba9d4cd50f463"
        },
        {
          type: 3,
          hex: "33112cb923b3197a38c7a6eb50a837b0a44952fe31e528a1512994fcfa2b5f87b9c86ed9234426d3bbb526"
        }
      ]
    },
    {
      id: 56,
      address: "u1kfzux4hf9favh8jmssqa2h04k87advldqz5ze7a8t4un3nkegklhz3ewzk6lmqg0uy7matdway9vn2q8q9rxp0fjwuewpcjtwrwavxjdsfxdvsk5nkx4q35atp0tfepfdsapqkk4en5",
      receivers: [
        {
          type: 0,
          hex: "3e7f16836d93b5417445ad0fc9f7ba023617e2b3"
        },
        {
          type: 3,
          hex: "0dacf7b768abb04a02b2e30bf31440300b64275f3677d02e52ba0f4ce779cafee8ceea69acf2e1f0fee926"
        }
      ]
    },
    {
      id: 57,
      address: "u1hrwrtyl3m8m2c6vkhu8wng43j5yvwweg37n2qstsqwc9dfw4vhs69m09064522758p44pfz42gu6hydjxua0wt0ge907sgrxkc9mft4gyfjevkhsyl4d8lnzgyd90arhx4t6v20zlfz",
      receivers: [
        {
          type: 0,
          hex: "29b06b228eb6b70fda051ff9e01bcb271b51c683"
        },
        {
          type: 2,
          hex: "8660070e3757ff6507060791fd694f6a631b8495a2b74ffa39236cf653caea5575b86af3200b010e513bab"
        }
      ]
    },
    {
      id: 58,
      address: "u1rf4n5f682jspygln8r5pjwh6fmta7xz6n9x868f5wgc9prxsqkrh8jkpmn7wfnag56ml7czw68dv96299ft6s98p05u4jvdx3elyr83jqnzr603vw8yarptpg5pj73zlea0sksuje3r",
      receivers: [
        {
          type: 0,
          hex: "29099a651d5561f800e58f3e33c27f078a98581f"
        },
        {
          type: 2,
          hex: "6d75a1a948a4e730db3b4b816dbc7d80b4eb1bc68de9ac87b0cd1f1b3e6068e677888e105ac727c0d14b49"
        }
      ]
    },
    {
      id: 59,
      address: "u1l6exm3zmfsr74sqvlwgc0zf7mydwf6z5r79amka84kfwzwef3wxs0yupl2lwhws85vdmqet3rtz795gpnm4h0jjfv4hanwqta0ezlxqe4p578a4aq09s93xhhtf3xhtrlh575qrsf5g",
      receivers: [
        {
          type: 0,
          hex: "475494432c3437d50ef23623cb67670fef27d8f5"
        },
        {
          type: 2,
          hex: "38b14b44ed6f4a3ae8c5c3923e5770b786f9b41d46c65a149b13910f4a0a64e83bb9bc98e80d9576fbf76e"
        }
      ]
    }
  ],
  jumble: [
    {
      id: 0,
      normal: "5d7a8f739a2d9e945b0ce152a8049e294c4d6e66b164939daffa2ef6ee6921481cdd86b3cc4318d9614fc820905d042b",
      jumbled: "0304d029141b995da5387c125970673504d6c764d91ea6c082123770c7139ccd88ee27368cd0c0921a0444c8e5858d22"
    },
    {
      id: 1,
      normal: "b1ef9ca3f24988c7b3534201cfb1cd8dbf69b8250c18ef41294ca97993db546c1fe01f7e9c8e36d6a5e29d4e30a73594bf5098421c69378af1e40f64e125946f",
      jumbled: "5271fa3321f3adbcfb075196883d542b438ec6339176537daf859841fe6a56222bff76d1662b5509a9e1079e446eeedd2e683c31aae3ee1851d7954328526be1"
    },
    {
      id: 2,
      normal: "62c2fa7b2fecbcb64b6968912a6381ce3dc166d56a1d62f5a8d7551db5fd9313e8c7203d996af7d477083756d59af80d06a745f44ab023752cb5b406ed8985e18130ab33362697b0e4e4c763ccb8f676495c222f7fba1e31defa3d5a57efc2e1e9b01a035587d5fb1a38e01d94903d3c3e0ad3360c1d3710acd20b183e31d49f",
      jumbled: "498cf1b1ba6f4577effe64151d67469adc30acc325e326207e7d78487085b4162669f82f02f9774c0cc26ae6e1a76f1e266c6a9a8a2f4ffe8d2d676b1ed71cc47195a3f19208998f7d8cdfc0b74d2a96364d733a62b4273c77d9828aa1fa061588a7c4c88dd3d3dde02239557acfaad35c55854f4541e1a1b3bc8c17076e7316"
    },
    {
      id: 3,
      normal: "25c9a138f49b1a537edcf04be34a9851a7af9db6990ed83dd64af3597c04323ea51b0052ad8084a8b9da948d320dadd64f5431e61ddf658d24ae67c22c8d1309131fc00fe7f235734276d38d47f1e191e00c7a1d48af046827591e9733a97fa6b679f3dc601d008285edcbdae69ce8fc1be4aac00ff2711ebd931de518856878f7",
      jumbled: "7508a3a146714f229db91b543e240633ed57853f6451c9db6d64c6e86af1b88b28704f608582c53c51ce7d5b8548827a971d2b98d41b7f6258655902440cd66ee11e84dbfac7d2a43696fd0468810a3d9637c3fa58e7d2d341ef250fa09b9fb71a78a41d389370138a55ea58fcde779d714a04e0d30e61dc2d8be0da61cd684509"
    },
    {
      id: 4,
      normal: "3476f21a482ec9378365c8f7393c94e2885315eb4671098b79535e790fe53e29fef2b3766697ac32b4f473f468a008e72389fc03880d780cb07fcfaabe3f1a84b27db59a4a153d882d2b2103596555ed9494c6ac893c49723833ec8926c1039586a7afcf4a0d9c731e985d99589c8bb838e8aaf745533ed9e8ae3a1cd074a51a20da8aba18d1dbebbc862ded42435e92476930d069896cff30eb414f727b89e001afa2fb8dc3436d75a4a6f26572504b192232ecb9f0c02411e52596bc5e9045",
      jumbled: "5139912fe8b95492c12731995a0f4478dbeb81ec36653a21bc80d673f3c6a0feef70b6c566f9d34bb726c098648382d105afb19b2b8486b73cbd47a17a0d2d1fd593b14bb9826c5d114b850c6f0cf3083a6f61e38e42713a37ef7997ebd2b376c8a410d797b3932e5a6e39e726b2894ce79604b4ae3c00acaea3be2c1dfe697fa644755102cf9ad78794d0594585494fe38ab56fa6ef3271a68a33481015adf3944c115311421a7dc3ce73ef2abf47e18a6aca7f9dd25a85ce8dbd6f1ad89c8d"
    },
    {
      id: 5,
      normal: "7e745939ffedbd12863ce71a02af117d417adb3d15cc54dcb1fce467500c6b8fb86b12b56da9c382857deecc40a98d5f2935395ee4762dd21afdbb5d47fa9a6dd984d567db2857b927b7fae2db587105415d4642789d38f50b8dbcc129cab3d17d19f3355bcf73cecb8cb8a5da01307152f13936a270572670dc82d39026c6cb4cd4b0f7f5aa2a4f5a5341ec5dd715406f2fdd2afa733f5f641c8c21862a1bafce2609d9eecfa158cfb5cd79f88008e315dc7d8388e76c1782fd2795d18a763624",
      jumbled: "1a52585e652da6ea46994954905cb79f55fca58171a4d7f773a57d23ed9ddec0c745ef0f4588fa7b2b68d69cdd25e5eb0e08c20523a3957171f1730ab0636faee75da2dc9e89562f0653d4e9422179286ae8305f01371f47ab16eed692c3895ce2fd655e4b19651c35d83c81894f687055b581114440646508e39a49b0d5a99004560af7367cc2738344d4e797a995ed66df72228e3d3746674337104700144c73b6db27d238c9e1770662feb0957d5028b5086f3839aacf275022dd7e7e983b6d"
    }
  ]
};

// src/suite.js
var SAPLING = "ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez";
var TRANSPARENT = "tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU";
var UA = official_default.unified.find((v) => v.receivers.some((r) => r.type === 3) && v.receivers.some((r) => r.type === 2) && v.receivers.some((r) => r.type === 0)).address;
var EXAMPLE = `zcash:${SAPLING}?amount=1&memo=VGhpcyBpcyBhIHNpbXBsZSBtZW1vLg&message=Thank%20you%20for%20your%20purchase`;
var MULTI = `zcash:?address=${TRANSPARENT}&amount=123.456&address.1=${SAPLING}&amount.1=0.789&memo.1=VGhpcyBpcyBhIHVuaWNvZGUgbWVtbyDinKjwn6aE8J-PhvCfjok`;
var same = (a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) throw Error("Result differs from expected value.");
};
var rejects = (fn, part) => {
  let error;
  try {
    fn();
  } catch (e) {
    error = e;
  }
  if (!error) throw Error("Expected rejection, but input was accepted.");
  if (part && !error.message.includes(part)) throw Error("Rejected for an unexpected reason: " + error.message);
};
var cases = [];
var add2 = (name, group, run) => cases.push({ name, group, run });
for (const v of official_default.unified) add2(`Unified Address reference #${v.id + 1}`, "Official ZIP-316 fixture", () => same(decodeAddress(v.address).receivers.map((r) => ({ type: r.type, hex: r.hex })), v.receivers));
for (const v of official_default.jumble) {
  add2(`F4Jumble forward #${v.id + 1}`, "Official F4Jumble fixture", () => same(hex(f4jumble(unhex(v.normal))), v.jumbled));
  add2(`F4Jumble inverse #${v.id + 1}`, "Official F4Jumble fixture", () => same(hex(f4jumble(unhex(v.jumbled), true)), v.normal));
}
add2("ZIP-321 published single-recipient example", "Specification example", () => {
  const r = parseRequest(EXAMPLE, "testnet");
  same(r.recipients[0].zatoshis, "100000000");
  same(r.recipients[0].memo.text, "This is a simple memo.");
});
add2("ZIP-321 published multi-recipient example", "Specification example", () => {
  const r = parseRequest(MULTI, "testnet");
  same(r.recipients.length, 2);
  same(r.recipients[1].zatoshis, "78900000");
});
add2("Exact zatoshi arithmetic", "Boundary", () => same(parseAmount("0.00000001"), "1"));
add2("Maximum ZEC amount", "Boundary", () => same(parseAmount("21000000"), "2100000000000000"));
add2("Percent-decoded label keeps plus literal", "Boundary", () => same(parseRequest(`zcash:${SAPLING}?label=A+B%20C`).recipients[0].label, "A+B C"));
add2("Unknown optional parameter warns", "Boundary", () => same(parseRequest(`zcash:${SAPLING}?future=1`).warnings.some((x) => x.includes("Ignored")), true));
add2("Unspecified amount stays unspecified", "Boundary", () => same(parseRequest(`zcash:${SAPLING}`).recipients[0].amount, null));
add2("512-byte memo accepted", "Boundary", () => same(parseRequest(`zcash:${SAPLING}?memo=${encodeMemo("x".repeat(512))}`).recipients[0].memo.bytes, 512));
add2("UTF-8 composition roundtrip", "Composition", () => {
  const r = composeRequest([{ address: SAPLING, amount: "0.01234567", label: "Bhopal + lab", memo: "\u0928\u092E\u0938\u094D\u0924\u0947 / test only" }]);
  same(r.result.recipients[0].memo.text, "\u0928\u092E\u0938\u094D\u0924\u0947 / test only");
  same(r.result.recipients[0].label, "Bhopal + lab");
});
add2("Multi-recipient composition roundtrip", "Composition", () => same(composeRequest([{ address: SAPLING, amount: "1", label: "A", memo: "" }, { address: TRANSPARENT, amount: "2", label: "B", memo: "" }]).result.recipients.length, 2));
add2("Orchard preferred when supported", "Receiver policy", () => same(selectReceiver(UA, [3, 2, 0]).selected.type, 3));
add2("Sapling selected when Orchard unsupported", "Receiver policy", () => same(selectReceiver(UA, [2, 0]).selected.type, 2));
add2("Strict policy blocks transparent fallback", "Receiver policy", () => same(selectReceiver(UA, [0], true).blocked, true));
add2("Explicit opt-in permits transparent fallback", "Receiver policy", () => same(selectReceiver(UA, [0], false).selected.type, 0));
var bad = [
  ["Checksum mutation", () => decodeAddress(UA.slice(0, -1) + (UA.endsWith("q") ? "p" : "q")), "checksum"],
  ["Mixed-case Unified Address", () => decodeAddress(UA.slice(0, 3).toUpperCase() + UA.slice(3)), "checksum"],
  ["Network mismatch", () => decodeAddress(SAPLING, "mainnet"), "Network mismatch"],
  ["Unsupported revision 2", () => decodeAddress("zu1unsupported"), "Revision 2"],
  ["Viewing key rejected", () => decodeAddress("uview1example"), "Keys are not accepted"],
  ["Empty request", () => parseRequest("zcash:"), "no recipient"],
  ["URL-style slashes rejected", () => parseRequest("zcash://" + SAPLING), "//"],
  ["Fragment rejected", () => parseRequest("zcash:" + SAPLING + "#memo"), "fragment"],
  ["Negative amount", () => parseAmount("-1"), "non-negative"],
  ["Exponent amount", () => parseAmount("1e2"), "decimal"],
  ["Excess precision", () => parseAmount("0.000000001"), "8 places"],
  ["Supply bound", () => parseAmount("21000000.00000001"), "21 million"],
  ["Duplicate amount", () => parseRequest(`zcash:${SAPLING}?amount=1&amount=2`), "Duplicate"],
  ["Duplicate path/query address", () => parseRequest(`zcash:${SAPLING}?address=${SAPLING}`), "Duplicate"],
  ["Recipient index .0", () => parseRequest(`zcash:?address.0=${SAPLING}`), "index"],
  ["Recipient index leading zero", () => parseRequest(`zcash:?address.01=${SAPLING}`), "index"],
  ["Recipient without address", () => parseRequest(`zcash:${SAPLING}?amount.1=1`), "no address"],
  ["Mixed network recipients", () => parseRequest(`zcash:?address=${SAPLING}&address.1=${UA}`), "mix mainnet"],
  ["Unknown required parameter", () => parseRequest(`zcash:${SAPLING}?req-future=1`), "Unknown required"],
  ["Custom asset not silently ignored", () => parseRequest(`zcash:${UA}?req-asset=x`), "Custom-asset"],
  ["Memo forbidden for transparent", () => parseRequest(`zcash:${TRANSPARENT}?memo=eA`), "transparent-only"],
  ["Padded memo forbidden", () => parseRequest(`zcash:${SAPLING}?memo=eA==`), "unpadded"],
  ["Non-canonical memo bits", () => parseRequest(`zcash:${SAPLING}?memo=eB`), "encoding"],
  ["513-byte memo rejected", () => parseRequest(`zcash:${SAPLING}?memo=${encodeMemo("x".repeat(513))}`), "512"],
  ["Raw spaces rejected", () => parseRequest(`zcash:${SAPLING}?label=hello world`), "percent-encode"],
  ["Broken percent encoding", () => parseRequest(`zcash:${SAPLING}?label=%XX`), "invalid URI"],
  ["Invalid UTF-8 rejected", () => parseRequest(`zcash:${SAPLING}?label=%FF`), "UTF-8"],
  ["Percent-encoded amount forbidden", () => parseRequest(`zcash:${SAPLING}?amount=%31`), "decimal"],
  ["Trailing empty parameter", () => parseRequest(`zcash:${SAPLING}?amount=1&`), "Empty request"],
  ["Resource limit enforced", () => parseRequest("x".repeat(32769)), "32 KB"]
];
for (const [name, fn, part] of bad) add2(name, "Negative case", () => rejects(fn, part));
function runSuite() {
  const start = performance.now();
  const results2 = cases.map((t) => {
    try {
      t.run();
      return { name: t.name, group: t.group, passed: true };
    } catch (e) {
      return { name: t.name, group: t.group, passed: false, error: e.message };
    }
  });
  return { project: "Veil", version: "0.1.0", generatedAt: (/* @__PURE__ */ new Date()).toISOString(), fixtureSource: official_default.source, fixtureCommit: official_default.commit, total: results2.length, passed: results2.filter((r) => r.passed).length, failed: results2.filter((r) => !r.passed).length, durationMs: Math.round(performance.now() - start), scope: "Local encoding and ZEC payment-request tests. No chain, ownership, curve validity, wallet interoperability or settlement verification.", results: results2 };
}

// src/app.js
var nav = [["inspect", "Request inspector", "\u2315"], ["compose", "Request studio", "\u25A4"], ["receivers", "Receiver paths", "\u2442"], ["tests", "Proof lab", "\u2713"], ["about", "Method & limits", "\u24D8"]];
var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var $ = (s) => document.querySelector(s);
var state = { input: EXAMPLE, network: "testnet", result: safeInspect(EXAMPLE, "testnet"), report: null, filter: "all", rows: [{ address: SAPLING, amount: "0.01", label: "Workshop demo", memo: "Test request - no payment" }], composeNetwork: "testnet", composed: null, composeError: "", receiverInput: UA, capabilities: [3, 2, 0, 1], strict: true };
var head = (n, title, desc, extra = "") => `<div class="pagehead"><div><div class="eyebrow">${n}</div><h1>${title}</h1><p class="subtext">${desc}</p></div>${extra}</div>`;
var option = (v, label, selected) => `<option value="${v}"${v === selected ? " selected" : ""}>${label}</option>`;
var network = (id, value, any = true) => `<label class="field">Expected network<select id="${id}">${any ? option("any", "Detect network", value) : ""}${option("testnet", "Testnet \xB7 practice only", value)}${option("mainnet", "Mainnet \xB7 inspect only", value)}</select></label>`;
var panel = (title, body, tag = "") => `<section class="panel"><div class="panelhead"><h2>${title}</h2>${tag ? `<span class="tag">${tag}</span>` : ""}</div><div class="panelbody">${body}</div></section>`;
var check = (title, body, status = "") => `<div class="check"><span class="checkicon ${status}">${status === "bad" ? "\xD7" : status === "warn" ? "!" : "\u2713"}</span><div><b>${esc(title)}</b><p>${esc(body)}</p></div></div>`;
var stat = (n, title, desc) => `<div class="stat"><strong>${n}</strong><label><b>${title}</b>${desc}</label></div>`;
function results(r) {
  if (!r) return '<div class="reportempty">Run an inspection to see the result.</div>';
  if (!r.ok) return `<div class="resulttop"><div class="eyebrow">Inspection stopped</div><h2>Resolve before continuing.</h2><p>No payment or wallet action has been taken.</p></div><div class="panelbody">${check("Cannot verify this request", r.error, "bad")}<p class="smallnote sectionspace">Unsupported features are not the same as invalid addresses. Read the reason before changing a request.</p></div>`;
  return `<div class="resulttop"><div class="eyebrow">${esc(r.network)} / ${r.recipients.length} recipient${r.recipients.length > 1 ? "s" : ""}</div><h2>Encoding checks passed.</h2><p>This is not ownership, wallet support or settlement verification.</p></div><div class="panelbody checks">${check("Checksums & structure", "Supported address encodings decoded successfully.")}${check("Exact amounts", r.recipients.map((x) => x.zatoshis === null ? "Amount not specified" : `${x.zatoshis} zatoshis`).join(" \xB7 "))}${check("Receiver visibility", r.recipients.map((x) => x.receivers.map((y) => y.name).join(" + ")).join(" / "))}${r.warnings.map((w) => check("Review this condition", w, "warn")).join("")}${check("Funds and ownership are not checked", "No chain connection. Control of any address is not established.", "warn")}</div>`;
}
function recipientTable(r) {
  if (!r?.ok) return "";
  return panel("Decoded request", `<div class="tablewrap"><table><thead><tr><th>Recipient</th><th>Destination</th><th>Amount / memo</th></tr></thead><tbody>${r.recipients.map((x) => `<tr><td><span class="badge neutral">#${x.index}</span><p>${esc(x.label || "No label")}</p></td><td><strong>${esc(x.kind)}</strong><p class="smallnote mono addressline">${esc(x.address)}</p>${x.receivers.map((y) => `<span class="badge ${y.shielded ? "" : "warn"}">${esc(y.name)}</span> `).join("")}</td><td>${x.amount === null ? "Unspecified" : `${esc(x.amount)} ZEC`}<p class="smallnote">${x.memo ? `${x.memo.bytes} memo bytes${x.memo.text !== null ? " \xB7 " + esc(x.memo.text) : " \xB7 binary"}` : "No memo"}</p>${x.message ? `<p class="smallnote">Message: ${esc(x.message)}</p>` : ""}</td></tr>`).join("")}</tbody></table></div>`, "LOCAL RESULT");
}
function inspectPage() {
  return head("01 / Payment request diagnostics", "Before a request becomes a payment.", "Inspect a Zcash address or payment URI. Find compatibility issues before a wallet ever opens.") + `<div class="stats">${stat("321", "Payment requests", "ZIP-321 \xB7 ZEC subset")}${stat("316", "Unified Addresses", "Revision 0 \xB7 receiver decoding")}${stat("0", "Input network requests", "Local processing \xB7 no storage")}</div><div class="workspace">${panel("Your request", `<div class="pills"><button class="pill" data-sample="single">Sapling request</button><button class="pill" data-sample="multi">Multiple recipients</button><button class="pill" data-sample="ua">Unified Address</button><button class="pill" data-sample="broken">Broken checksum</button></div><label class="field">Address or zcash: URI<textarea id="request" aria-label="Address or payment request" spellcheck="false" maxlength="32768">${esc(state.input)}</textarea></label>${network("network", state.network)}<div class="actions"><button id="inspect" class="btn primary">Inspect request \u2197</button><button id="export-inspection" class="btn" ${state.result?.ok ? "" : "disabled"}>Export report</button><button id="clear" class="btn ghost">Clear</button></div><p class="hint">Never paste keys or seed phrases. Samples are public test vectors. Never send funds to them.</p>`, "OFFLINE")}<section class="panel" aria-live="polite">${results(state.result)}</section></div><div class="wide">${recipientTable(state.result)}</div><div class="bottomgrid">${panel("Three separate questions", `<div class="trace"><div class="tracebox"><strong>01</strong>Encoding</div><i class="connector"></i><div class="tracebox"><strong>02</strong>Receiver policy</div><i class="connector"></i><div class="tracebox"><strong>03</strong>Settlement</div></div><p class="smallnote">This lab checks the first, rehearses the second, and never claims the third.</p>`)}${panel("Built for the workshop desk", `<p class="smallnote">Reproduce a malformed request, see the exact failure, change it, and export a diagnostic report for review. No wallet setup required.</p><a class="btn ghost" href="#tests">Explore the reference tests \u2192</a>`)}</div>`;
}
function composePage() {
  return head("02 / Request studio", "Build the request. Inspect the assumptions.", "Compose ZEC recipients, exact amounts and UTF-8 memos. No payment is initiated.") + `<div class="banner">Testing tool only. Default addresses are published test vectors, not addresses you control. QR codes describe requests, never payment receipts.</div><div class="workspace">${panel("Recipient workspace", `${network("compose-network", state.composeNetwork, false)}${state.rows.map((r, i) => `<fieldset class="recipient-form"><legend>Recipient ${i + 1}</legend><label class="field">Public address<textarea data-row="${i}" data-key="address" aria-label="Recipient ${i + 1} address" spellcheck="false">${esc(r.address)}</textarea></label><div class="fieldrow"><label class="field">Amount in ZEC<input data-row="${i}" data-key="amount" aria-label="Recipient ${i + 1} amount" inputmode="decimal" value="${esc(r.amount)}" placeholder="Optional"></label><label class="field">Display label<input data-row="${i}" data-key="label" aria-label="Recipient ${i + 1} label" maxlength="250" value="${esc(r.label)}"></label></div><label class="field">Text memo \xB7 shielded only<input data-row="${i}" data-key="memo" aria-label="Recipient ${i + 1} memo" value="${esc(r.memo)}"><span class="hint">512 UTF-8 bytes maximum. Do not include private information in a shareable request.</span></label>${state.rows.length > 1 ? `<button class="pill" data-remove="${i}">Remove recipient ${i + 1}</button>` : ""}</fieldset>`).join("")}<div class="actions"><button class="btn" id="add-recipient" ${state.rows.length >= 8 ? "disabled" : ""}>+ Add recipient</button><button class="btn primary" id="generate">Generate request</button></div><p class="hint">Studio limit: 8 recipients. Parser limit: 32.</p>`, "ZEC ONLY")}<section class="panel"><div class="resulttop"><div class="eyebrow">Output / Not a transaction</div><h2>A portable payment request.</h2><p>Inspect locally. Copy intentionally. Review memo text before sharing.</p></div><div class="panelbody" aria-live="polite">${state.composeError ? check("Request not generated", state.composeError, "bad") : state.composed ? `<span class="badge">${esc(state.composed.result.network)} \xB7 encoding checked</span><img id="qr" class="qr" alt="QR code of the generated test request" hidden><p id="qr-note" class="smallnote"></p><label class="field">Generated URI<textarea readonly aria-label="Generated URI">${esc(state.composed.uri)}</textarea></label><div class="actions"><button class="btn primary" id="copy-uri">Copy URI</button><button class="btn" id="export-uri">Download request</button><button class="btn" id="send-inspector">Inspect this</button></div><p class="footnote">Anyone can create a request. A URI does not prove that a person owns the destination.</p>` : `<div class="reportempty">Add recipients, then generate.<br>Your QR and portable URI will appear here.</div>`}</div></section></div>`;
}
function receiverPage() {
  let data, error;
  try {
    data = decodeAddress(state.receiverInput);
  } catch (e) {
    error = e.message;
  }
  const selected = data ? selectReceiver(data, state.capabilities, state.strict) : null;
  return head("03 / Receiver policy rehearsal", "One address. Different possible paths.", "Change a hypothetical sender\u2019s capabilities. This is a policy simulation, not a wallet compatibility test.") + `<div class="workspace">${panel("Address & sender capabilities", `<label class="field">Public address<textarea id="receiver-input" aria-label="Receiver address" spellcheck="false">${esc(state.receiverInput)}</textarea></label><div class="pills"><button class="pill" id="receiver-ua">Three-receiver example</button><button class="pill" id="receiver-t">Transparent example</button></div><h3>Hypothetical sender supports</h3>${[[3, "Orchard"], [2, "Sapling"], [0, "Transparent (P2PKH / P2SH)"]].map(([type, name]) => `<label class="toggle"><input type="checkbox" data-capability="${type}" ${state.capabilities.includes(type) ? "checked" : ""}>${name}</label>`).join("")}<hr><label class="toggle"><input type="checkbox" id="strict" ${state.strict ? "checked" : ""}>Require a shielded receiver</label><button id="receiver-run" class="btn primary">Rehearse receiver choice</button><p class="hint">Priority: Orchard \u2192 Sapling \u2192 transparent. Unknown types are never selected.</p>`, "SIMULATION")}<section class="panel"><div class="resulttop"><div class="eyebrow">${error ? "Cannot decode" : selected.blocked ? "Policy blocked" : "Hypothetical route"}</div><h2>${error ? "Check the address." : selected.blocked ? "Stop. Do not downgrade." : esc(selected.selected.name) + " selected."}</h2><p>${esc(error || selected.reason)}</p></div><div class="panelbody">${data ? data.receivers.map((r) => `<div class="receiver"><div class="receiver-head"><strong>${esc(r.name)}</strong><span class="badge ${selected.selected?.type === r.type ? "" : "neutral"}">${selected.selected?.type === r.type ? "SELECTED" : "AVAILABLE"}</span></div><p>Type ${r.type} \xB7 ${r.bytes} bytes \xB7 ${r.shielded === null ? "Unknown privacy semantics" : r.shielded ? "Shielded-capable" : "Transparent receiver"}</p><details><summary>Public receiver bytes</summary><code class="code">${esc(r.hex)}</code></details></div>`).join("") : ""}<p class="smallnote">A shielded-capable destination does not prove the whole transaction is private. Sender inputs, wallet behavior, change and metadata matter. Veil does not construct or observe transactions.</p></div></section></div>`;
}
function testsPage() {
  const r = state.report, shown = r?.results.filter((x) => state.filter === "all" || !x.passed) || [];
  return head("04 / Reproducible proof lab", "Evidence you can rerun.", "Published Zcash vectors meet intentionally broken requests. These checks run locally in the browser and in the command-line test suite.", `<button id="run-tests" class="btn primary">Run ${cases.length} checks \u2197</button>`) + `<div class="stats">${stat("60", "Unified Address vectors", "Expected receiver bytes")}${stat("12", "F4Jumble checks", "6 pairs \xB7 both directions")}${stat(cases.length - 72, "Behavior checks", "Examples, boundaries & failures")}</div>${panel("Latest test run", r ? `<div class="teststatus"><strong class="${r.failed ? "negative" : "positive"}">${r.passed}/${r.total}</strong><span class="badge ${r.failed ? "bad" : ""}">${r.failed ? "FAILURES FOUND" : "ALL CHECKS PASSED"}</span><span class="smallnote">${r.durationMs} ms \xB7 ${esc(new Date(r.generatedAt).toLocaleTimeString())}</span><button class="btn" id="export-tests">Export test evidence</button></div><div class="pills"><button class="pill" data-filter="all">All checks</button><button class="pill" data-filter="failed">Failures only (${r.failed})</button></div><div class="tablewrap"><table><thead><tr><th>Status</th><th>Test</th><th>Source category</th></tr></thead><tbody>${shown.map((x) => `<tr><td><span class="badge ${x.passed ? "" : "bad"}">${x.passed ? "PASS" : "FAIL"}</span></td><td>${esc(x.name)}${x.error ? `<p class="negative">${esc(x.error)}</p>` : ""}</td><td>${esc(x.group)}</td></tr>`).join("")}</tbody></table>${!shown.length ? '<p class="smallnote sectionspace">No failed checks in this run.</p>' : ""}</div>` : `<div class="reportempty">No run yet in this session.<br>Run the suite to generate fresh evidence.</div>`, "NOT AN AUDIT")}<div class="footnote">Passing checks is not a security audit, upstream endorsement, full ZIP conformance certification or proof of wallet interoperability.</div>`;
}
function aboutPage() {
  const section = (t, b) => `<div class="sectionspace">${panel(t, b)}</div>`;
  return head("05 / Method & limits", "Useful because the limits are visible.", "A pre-application prototype by Arun Pratap Singh Chandel / The Origin Guild, developed with AI assistance.") + `<div class="docs">${panel("The problem this explores", "<p>Developers have to debug address encoding, payment-request syntax and receiver compatibility separately. Veil brings these questions into one local workflow for workshop facilitators and integration developers. This need has not yet been validated with a Zcash maintainer.</p><p>Start with a broken request, reveal a network or memo error, repair it, rehearse receiver choice, then export actual test evidence. No funds or wallet setup are needed to teach these boundaries.</p>")}${section("What works in version 0.1", `<ul><li>Transparent Base58Check and Sapling Bech32 decoding.</li><li>Revision-0 Unified Address Bech32m, F4Jumble and receiver-structure decoding.</li><li>ZIP-321 ZEC subset: multiple recipients, exact zatoshi amounts, labels and base64url memos.</li><li>Local QR generation, receiver-policy rehearsal and JSON exports.</li><li>${cases.length} checks, including 60 official address fixtures and 12 F4Jumble reference checks.</li></ul>`)}${section("Explicitly not implemented", "<ul><li>No wallet, signing, key handling, custody, broadcast, balance lookup or indexing.</li><li>No zk-SNARK verification, address ownership or curve-point validity check.</li><li>No revision-2 Unified Addresses, custom assets (req-asset), Sprout or viewing keys.</li><li>No real-wallet interoperability guarantee, customer traction or security audit.</li><li>Unknown receivers are surfaced but never selected. Limits: request 32 KB / 32 recipients, F4Jumble 4 KB, composer 8 recipients.</li></ul><p>This prototype is not a substitute for maintained wallet libraries. It does not establish readiness to teach transaction construction without a qualified Zcash technical lead.</p>")}${section("Privacy & reproducibility", '<p>Inputs stay in memory in this browser tab. No external API calls, app analytics, localStorage or wallet connections. The hosting provider receives ordinary page/asset requests and may log visitor IP addresses; entered requests are not transmitted. Exports may contain addresses and memo text; review before sharing. Clear resets the inspector. Reload resets the session.</p><p>Fixtures are pinned to Zcash\u2019s repository commit <code class="mono">78321beacb0e0477e33cd002b56585a107c2708c</code>. Only public address and receiver fields are imported, not seed or key fields. Hashing and encoding use pinned <code>@noble/hashes</code> and <code>@scure/base</code> libraries.</p><p>Reproduce: <code>npm ci</code>, <code>npm test</code>, <code>npm run build</code>, <code>npm run dev</code>.</p>')}${section("Primary references", `<div class="minirow"><a href="https://zips.z.cash/zip-0321" target="_blank" rel="noreferrer">ZIP-321 \xB7 Payment request URI format \u2197</a></div><div class="minirow"><a href="https://zips.z.cash/zip-0316" target="_blank" rel="noreferrer">ZIP-316 \xB7 Unified Addresses and F4Jumble \u2197</a></div><div class="minirow"><a href="https://github.com/zcash/zcash-test-vectors/tree/78321beacb0e0477e33cd002b56585a107c2708c" target="_blank" rel="noreferrer">Pinned official test vectors \u2197</a></div><div class="minirow"><a href="https://zcashcommunitygrants.org/" target="_blank" rel="noreferrer">ZCG \xB7 Developer and usability priorities \u2197</a></div><p class="smallnote sectionspace">Independent project. Not endorsed by ZCG or a wallet team. Source: <a href="https://github.com/Arun5768/veil-zcash-lab" target="_blank" rel="noreferrer">Arun5768/veil-zcash-lab</a>. External review remains a next step.</p>`)}</div>`;
}
function route() {
  return nav.some(([r]) => r === location.hash.slice(1)) ? location.hash.slice(1) : "inspect";
}
function render() {
  const r = route();
  document.title = `${nav.find(([n]) => n === r)[1]} / Veil`;
  $("#app").innerHTML = `<div class="shell"><aside class="sidebar"><a class="brand" href="#inspect"><span class="brandmark">\u2228</span>veil<small>LAB</small></a><div class="subbrand">Zcash integration workbench</div><div class="navlabel">Workspace / 01</div><nav class="nav" aria-label="Workspace">${nav.map(([n, label, i]) => `<a href="#${n}" class="${r === n ? "active" : ""}" ${r === n ? 'aria-current="page"' : ""}><span class="navicon" aria-hidden="true">${i}</span>${label}</a>`).join("")}</nav><div class="sidebarbottom"><strong>Local by design.</strong>No wallet connection.<br>No keys. No transactions.<br><br>Arun Chandel / Origin Guild</div></aside><div class="main"><header class="topbar"><div class="crumb">WORKSPACE <span>/ ${nav.find(([n]) => n === r)[1]}</span></div><span class="tag">PREVIEW \xB7 0.1</span></header><main class="content">${{ inspect: inspectPage, compose: composePage, receivers: receiverPage, tests: testsPage, about: aboutPage }[r]()}<footer class="footer"><span>VEIL / Build confidence, not assumptions.</span><span>Prototype \xB7 No production payment use</span></footer></main></div></div>`;
  bind(r);
  if (r === "compose" && state.composed && !state.composeError) makeQR(state.composed.uri);
}
function on(s, e, fn) {
  $(s)?.addEventListener(e, fn);
}
function flash(t) {
  $("#notice").textContent = t;
  setTimeout(() => $("#notice").textContent = "", 4e3);
}
function download(name, data, type = "application/json") {
  const blob = new Blob([typeof data === "string" ? data : JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
  flash("Downloaded locally. Review before sharing.");
}
function runInspection() {
  state.result = safeInspect(state.input, state.network);
  render();
  return state.result;
}
function runTests() {
  state.report = runSuite();
  render();
  return state.report;
}
function saveRows() {
  document.querySelectorAll("[data-row]").forEach((el) => state.rows[Number(el.dataset.row)][el.dataset.key] = el.value);
  state.composeNetwork = $("#compose-network").value;
}
async function makeQR(uri) {
  const node = $("#qr");
  try {
    if (uri.length > 1800) throw Error("large");
    const src = await import_qrcode.default.toDataURL(uri, { width: 380, margin: 2, errorCorrectionLevel: "M", color: { dark: "#10191f", light: "#ffffff" } });
    if (node?.isConnected) {
      node.src = src;
      node.hidden = false;
      $("#qr-note").textContent = "Test request QR. Do not pay a reference address.";
    }
  } catch {
    if ($("#qr-note")) $("#qr-note").textContent = "Request is too long for the preview QR. Copy or download the URI instead.";
  }
}
function bind(r) {
  if (r === "inspect") {
    on("#request", "input", (e) => state.input = e.target.value);
    on("#network", "change", (e) => state.network = e.target.value);
    on("#inspect", "click", runInspection);
    on("#clear", "click", () => {
      state.input = "";
      state.result = null;
      render();
    });
    on("#export-inspection", "click", () => download("veil-inspection.json", { project: "Veil", version: "0.1.0", generatedAt: (/* @__PURE__ */ new Date()).toISOString(), scope: "Encoding only; no ownership, chain or settlement verification.", ...state.result }));
    document.querySelectorAll("[data-sample]").forEach((b) => b.addEventListener("click", () => {
      state.input = { single: EXAMPLE, multi: MULTI, ua: UA, broken: UA.slice(0, -1) + (UA.endsWith("q") ? "p" : "q") }[b.dataset.sample];
      state.network = ["ua", "broken"].includes(b.dataset.sample) ? "mainnet" : "testnet";
      runInspection();
    }));
  }
  if (r === "compose") {
    on("#add-recipient", "click", () => {
      saveRows();
      state.rows.push({ address: "", amount: "", label: "", memo: "" });
      state.composed = null;
      state.composeError = "";
      render();
    });
    document.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => {
      saveRows();
      state.rows.splice(Number(b.dataset.remove), 1);
      state.composed = null;
      state.composeError = "";
      render();
    }));
    on("#generate", "click", () => {
      saveRows();
      state.composeError = "";
      state.composed = null;
      try {
        state.composed = composeRequest(state.rows, state.composeNetwork);
      } catch (e) {
        state.composeError = e.message;
      }
      render();
    });
    on("#copy-uri", "click", async () => {
      try {
        await navigator.clipboard.writeText(state.composed.uri);
        flash("URI copied. This is not a payment.");
      } catch {
        flash("Select the URI or download it; clipboard unavailable.");
      }
    });
    on("#export-uri", "click", () => download("veil-test-request.txt", state.composed.uri, "text/plain"));
    on("#send-inspector", "click", () => {
      state.input = state.composed.uri;
      state.network = state.composeNetwork;
      state.result = safeInspect(state.input, state.network);
      location.hash = "inspect";
    });
  }
  if (r === "receivers") {
    on("#receiver-input", "input", (e) => state.receiverInput = e.target.value);
    on("#receiver-run", "click", render);
    on("#receiver-ua", "click", () => {
      state.receiverInput = UA;
      render();
    });
    on("#receiver-t", "click", () => {
      state.receiverInput = TRANSPARENT;
      render();
    });
    on("#strict", "change", (e) => {
      state.strict = e.target.checked;
      render();
    });
    document.querySelectorAll("[data-capability]").forEach((c) => c.addEventListener("change", () => {
      const nums = Number(c.dataset.capability) === 0 ? [0, 1] : [Number(c.dataset.capability)];
      state.capabilities = c.checked ? [.../* @__PURE__ */ new Set([...state.capabilities, ...nums])] : state.capabilities.filter((x) => !nums.includes(x));
      render();
    }));
  }
  if (r === "tests") {
    on("#run-tests", "click", runTests);
    on("#export-tests", "click", () => download("veil-test-evidence.json", state.report));
    document.querySelectorAll("[data-filter]").forEach((b) => b.addEventListener("click", () => {
      state.filter = b.dataset.filter;
      render();
    }));
  }
}
window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});
render();
var mc = document.modelContext;
var toolLife = new AbortController();
if (mc?.registerTool) {
  for (const tool of [{ name: "inspect_zcash_request", description: "Inspect a public Zcash address or ZEC request locally and show the result. Never provide keys or seeds. No transmission or payment.", inputSchema: { type: "object", properties: { request: { type: "string", maxLength: 32768 }, network: { type: "string", enum: ["any", "testnet", "mainnet"] } }, required: ["request"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: true }, execute: async (input) => {
    if (!input || typeof input !== "object") throw Error("Invalid input");
    const { request, network: network2 = "testnet" } = input;
    if (Object.keys(input).some((k) => !["request", "network"].includes(k)) || typeof request !== "string" || request.length > 32768 || !["any", "testnet", "mainnet"].includes(network2)) throw Error("Invalid input");
    state.input = request;
    state.network = network2;
    state.result = safeInspect(request, network2);
    location.hash = "inspect";
    render();
    return { ok: state.result.ok, network: state.result.network, recipients: state.result.recipients?.length, error: state.result.error, settlementVerified: false };
  } }, { name: "run_veil_checks", description: "Run local reference tests and show fresh results. No external changes.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: async (input) => {
    if (!input || typeof input !== "object" || Object.keys(input).length) throw Error("Expected empty object");
    location.hash = "tests";
    const report = runTests();
    return { passed: report.passed, total: report.total, failed: report.failed };
  } }]) {
    try {
      Promise.resolve(mc.registerTool(tool, { signal: toolLife.signal })).catch(() => {
      });
    } catch {
    }
  }
}
window.addEventListener("pagehide", () => toolLife.abort());
function invalidate(e) {
  const r = route(), el = e.target;
  if (r === "inspect" && ["request", "network"].includes(el.id)) {
    state.result = null;
    $(".workspace > .panel:last-child").innerHTML = '<div class="reportempty">Inputs changed. Inspect again for current results.</div>';
    $("#export-inspection").disabled = true;
    $(".wide").innerHTML = "";
  }
  if (r === "compose" && (el.dataset.row !== void 0 || el.id === "compose-network")) {
    saveRows();
    state.composed = null;
    state.composeError = "";
    $(".workspace > .panel:last-child .panelbody").innerHTML = '<div class="reportempty">Inputs changed. Generate a fresh request.</div>';
  }
  if (r === "receivers" && el.id === "receiver-input") {
    $(".workspace > .panel:last-child").innerHTML = '<div class="reportempty">Address changed. Rehearse again for current results.</div>';
  }
}
document.addEventListener("input", invalidate);
document.addEventListener("change", invalidate);
/*! Bundled license information:

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
