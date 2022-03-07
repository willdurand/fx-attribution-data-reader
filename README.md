# fx-attribution-data-reader

This repository contains a pure client-side application that allows to parse Firefox installers for Windows in order to extract and display attribution data encoded in these installers. It uses [Kaitai Struct][] to parse [PE files (`.exe`)][pe-file], and [terminal.css][] for the User Interface (UI).

## License

This project is released under the MIT License, see the bundled [LICENSE](./LICENSE) file for details. See also the license files of the third-party libraries in [`libs/`](./libs/).

[Kaitai Struct]: https://kaitai.io/
[pe-file]: https://en.wikipedia.org/wiki/Portable_Executable
[terminal.css]: https://github.com/Gioni06/terminal.css
