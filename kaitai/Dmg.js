// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.Dmg = factory(root.KaitaiStream);
  }
}(typeof self !== 'undefined' ? self : this, function (KaitaiStream) {
var Dmg = (function() {
  function Dmg(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Dmg.prototype._read = function() {
  }

  var KolyBlockT = Dmg.KolyBlockT = (function() {
    function KolyBlockT(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    KolyBlockT.prototype._read = function() {
      this.signature = this._io.readBytes(4);
      if (!((KaitaiStream.byteArrayCompare(this.signature, [107, 111, 108, 121]) == 0))) {
        throw new KaitaiStream.ValidationNotEqualError([107, 111, 108, 121], this.signature, this._io, "/types/koly_block_t/seq/0");
      }
      this.version = this._io.readU4be();
      this.headerSize = this._io.readU4be();
      this.flags = this._io.readU4be();
      this.runningDataForkOffset = this._io.readU8be();
      this.dataForkOffset = this._io.readU8be();
      this.dataForkLength = this._io.readU8be();
      this.rsrcForkOffset = this._io.readU8be();
      this.rsrcForkLength = this._io.readU8be();
      this.segmentNumber = this._io.readU4be();
      this.segmentCount = this._io.readU4be();
      this.segmentId = [];
      for (var i = 0; i < 4; i++) {
        this.segmentId.push(this._io.readU4be());
      }
      this.dataChecksumType = this._io.readU4be();
      this.dataChecksumSize = this._io.readU4be();
      this.dataChecksum = [];
      for (var i = 0; i < 32; i++) {
        this.dataChecksum.push(this._io.readU4be());
      }
      this.xmlOffset = this._io.readU8be();
      this.xmlLength = this._io.readU8be();
      this.reserved1 = [];
      for (var i = 0; i < 120; i++) {
        this.reserved1.push(this._io.readU1());
      }
      this.checksumType = this._io.readU4be();
      this.checksumSize = this._io.readU4be();
      this.checksum = [];
      for (var i = 0; i < 32; i++) {
        this.checksum.push(this._io.readU4be());
      }
      this.imageVariant = this._io.readU4be();
      this.sectorCount = this._io.readU8be();
      this.reserved2 = this._io.readU4be();
      this.reserved3 = this._io.readU4be();
      this.reserved4 = this._io.readU4be();
    }

    return KolyBlockT;
  })();
  Object.defineProperty(Dmg.prototype, 'kolyBlock', {
    get: function() {
      if (this._m_kolyBlock !== undefined)
        return this._m_kolyBlock;
      var _pos = this._io.pos;
      this._io.seek((this._io.size - 512));
      this._m_kolyBlock = new KolyBlockT(this._io, this, this._root);
      this._io.seek(_pos);
      return this._m_kolyBlock;
    }
  });

  return Dmg;
})();
return Dmg;
}));
