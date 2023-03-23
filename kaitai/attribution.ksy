meta:
  id: attribution
  endian: le

instances:
  attribution_resource:
    type: attribution_resource_t

types:
  attribution_resource_t:
    seq:
      - id: signature
        # The magic value is "attr" but little-endian is used.
        contents: rtta
      - id: version
        type: u4
      - id: before_compressed_checksum
        type: u4
      - id: before_compressed_length
        type: u8
      - id: before_uncompressed_checksum
        type: u4
      - id: before_uncompressed_length
        type: u8
      - id: raw_pos
        type: u8
      - id: raw_length
        type: u8
      - id: raw_checksum
        type: u4
      - id: after_compressed_checksum
        type: u4
      - id: after_compressed_length
        type: u8
      - id: after_uncompressed_checksum
        type: u4
      - id: after_uncompressed_length
        type: u8
