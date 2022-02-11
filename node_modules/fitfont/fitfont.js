import document from 'document';
import { statSync, openSync, readSync, closeSync } from 'fs';

var fonts = {};

var CURRENT_VERSION = 1;

var INDEX_VERSION = 0;
var INDEX_DESCENT = 1;
var INDEX_ASCENT = 2;
var INDEX_CHARS = 3;

var BYTES_PER_CHAR = 2;
var INFO_PER_CHAR = 5;
var TOTAL_BYTES_PER_CHAR = BYTES_PER_CHAR + INFO_PER_CHAR;

var getCharIndex = function getCharIndex(info, c) {
  var count = (info.length - INDEX_CHARS) / TOTAL_BYTES_PER_CHAR;

  var min = 0;
  var max = count - 1;

  // Check if the character is in the list
  var charMinOffset = INDEX_CHARS + BYTES_PER_CHAR * min;
  var charMaxOffset = INDEX_CHARS + BYTES_PER_CHAR * max;
  if ((info[charMinOffset] << 8) + info[charMinOffset + 1] > c || (info[charMaxOffset] << 8) + info[charMaxOffset + 1] < c) {
    return -1;
  }

  // use dichotomic search
  while (min <= max) {
    var id = Math.round((max + min) / 2);
    var charOffset = INDEX_CHARS + BYTES_PER_CHAR * id;
    var val = (info[charOffset] << 8) + info[charOffset + 1];

    if (val === c) {
      return INDEX_CHARS + INFO_PER_CHAR * id + BYTES_PER_CHAR * count;
    } else if (val > c) {
      max = id - 1;
    } else {
      min = id + 1;
    }
  }

  return -1;
};

export function FitFont(_ref) {
  var _this = this;

  var id = _ref.id,
      font = _ref.font,
      halign = _ref.halign,
      valign = _ref.valign,
      letterspacing = _ref.letterspacing;


  this.root = typeof id === 'string' ? document.getElementById(id) : id;
  this.style = this.root.style;
  this.chars = this.root.getElementsByClassName('fitfont-char');

  this._halign = halign || 'start';
  this._valign = valign || 'baseline';
  this._spacing = letterspacing || 0;
  this._text = '';

  this._width = 0;
  this._ascent = 0;
  this._descent = 0;

  if (fonts[font] === undefined) {
    try {
      var fName = '/mnt/assets/resources/' + font + '/ff';
      var stats = statSync(fName);
      var file = openSync(fName, 'r');

      var buffer = new ArrayBuffer(stats.size);
      readSync(file, buffer, 0, stats.size, 0);
      closeSync(file);

      var bytes = new Uint8Array(buffer);

      // Check if the binary file has the right format
      if (bytes[INDEX_VERSION] !== CURRENT_VERSION) {
        return;
      }

      fonts[font] = bytes;
    } catch (e) {
      console.error('Font ' + font + ' not found');
      return;
    }
  }

  this._info = fonts[font];

  this.redraw = function () {
    var val = _this._text + '';

    var totalWidth = 0;
    var i = 0;

    while (i < val.length && i < _this.chars.length) {
      var charCode = val.charCodeAt(i);
      var index = getCharIndex(_this._info, charCode);
      var charElem = _this.chars[i];
      if (index === -1) {
        // Char not found in the font
        // console.error(`Char not found ${val[i]} in ${font}`)
        charElem.href = '';
      } else {
        charElem.width = _this._info[index++];
        charElem.height = _this._info[index++];
        charElem.x = totalWidth - _this._info[index++];
        charElem.y = _this._info[index++];
        if (charElem.y > 200) charElem.y -= 256;
        totalWidth += _this._info[index++];
        charElem.href = font + '/' + charCode + '.png';
      }
      if (i < val.length - 1) {
        totalWidth += _this._spacing;
      }
      i++;
    }

    for (; i < _this.chars.length; i++) {
      _this.chars[i].href = '';
    }

    _this._width = totalWidth;

    var offx = 0;
    switch (_this._halign) {
      case 'middle':
        offx -= totalWidth / 2;break;
      case 'end':
        offx -= totalWidth;break;
    }

    var offy = 0;
    switch (_this._valign) {
      case 'top':
        offy = 0;break;
      case 'middle':
        offy -= (_this._info[INDEX_ASCENT] + _this._info[INDEX_DESCENT]) / 2;break;
      case 'bottom':
        offy -= _this._info[INDEX_ASCENT] + _this._info[INDEX_DESCENT];break;
      case 'baseline':
      default:
        offy -= _this._info[INDEX_ASCENT];break;
    }

    for (i = 0; i < _this.chars.length; i++) {
      _this.chars[i].x += offx;
      _this.chars[i].y += offy;
    }
  };

  Object.defineProperty(this, 'text', {
    get: function get() {
      return _this._text;
    },
    set: function set(val) {
      if (_this._text === val) return;
      _this._text = val;
      _this.redraw();
    }
  });

  Object.defineProperty(this, 'halign', {
    get: function get() {
      return _this._halign;
    },
    set: function set(val) {
      if (_this._halign === val) return;
      _this._halign = val;
      _this.redraw();
    }
  });

  Object.defineProperty(this, 'valign', {
    get: function get() {
      return _this._valign;
    },
    set: function set(val) {
      if (_this._valign === val) return;
      _this._valign = val;
      _this.redraw();
    }
  });

  Object.defineProperty(this, 'letterspacing', {
    get: function get() {
      return _this._spacing;
    },
    set: function set(val) {
      if (_this._spacing === val) return;
      _this._spacing = val;
      _this.redraw();
    }
  });

  Object.defineProperty(this, 'width', {
    get: function get() {
      return _this._width;
    }
  });
}