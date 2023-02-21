meta:
  id: dmg
  endian: be
instances:
  xml_plist:
    type: str
    encoding: UTF-8
    pos: koly_block.xml_offset
    size: koly_block.xml_length
  koly_block:
    pos: _io.size - 512
    type: koly_block_t
types:
  koly_block_t:
    seq:
      - id: signature
        contents: koly
      - id: version
        type: u4
      - id: header_size
        type: u4
      - id: flags
        type: u4
      - id: running_data_fork_offset
        type: u8
      - id: data_fork_offset
        type: u8
      - id: data_fork_length
        type: u8
      - id: rsrc_fork_offset
        type: u8
      - id: rsrc_fork_length
        type: u8
      - id: segment_number
        type: u4
      - id: segment_count
        type: u4
      - id: segment_id
        type: u4
        repeat: expr
        repeat-expr: 4
      - id: data_checksum_type
        type: u4
      - id: data_checksum_size
        type: u4
      - id: data_checksum
        type: u4
        repeat: expr
        repeat-expr: 32
      - id: xml_offset
        type: u8
      - id: xml_length
        type: u8
      - id: reserved_1
        type: u1
        repeat: expr
        repeat-expr: 120
      - id: checksum_type
        type: u4
      - id: checksum_size
        type: u4
      - id: checksum
        type: u4
        repeat: expr
        repeat-expr: 32
      - id: image_variant
        type: u4
      - id: sector_count
        type: u8
      - id: reserved_2
        type: u4
      - id: reserved_3
        type: u4
      - id: reserved_4
        type: u4
