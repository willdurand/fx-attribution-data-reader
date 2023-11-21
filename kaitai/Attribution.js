// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.Attribution = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var Attribution = (function() {
  function Attribution(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Attribution.prototype._read = function() {
  }

  var AttributionResourceT = Attribution.AttributionResourceT = (function() {
    function AttributionResourceT(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    AttributionResourceT.prototype._read = function() {
      this.signature = this._io.readBytes(4);
      if (!((KaitaiStream.byteArrayCompare(this.signature, [114, 116, 116, 97]) == 0))) {
        throw new KaitaiStream.ValidationNotEqualError([114, 116, 116, 97], this.signature, this._io, "/types/attribution_resource_t/seq/0");
      }
      this.version = this._io.readU4le();
      this.beforeCompressedChecksum = this._io.readU4le();
      this.beforeCompressedLength = this._io.readU8le();
      this.beforeUncompressedChecksum = this._io.readU4le();
      this.beforeUncompressedLength = this._io.readU8le();
      this.rawPos = this._io.readU8le();
      this.rawLength = this._io.readU8le();
      this.rawChecksum = this._io.readU4le();
      this.afterCompressedChecksum = this._io.readU4le();
      this.afterCompressedLength = this._io.readU8le();
      this.afterUncompressedChecksum = this._io.readU4le();
      this.afterUncompressedLength = this._io.readU8le();
    }

    return AttributionResourceT;
  })();
  Object.defineProperty(Attribution.prototype, 'attributionResource', {
    get: function() {
      if (this._m_attributionResource !== undefined)
        return this._m_attributionResource;
      this._m_attributionResource = new AttributionResourceT(this._io, this, this._root);
      return this._m_attributionResource;
    }
  });

  return Attribution;
})();
return Attribution;
}));
