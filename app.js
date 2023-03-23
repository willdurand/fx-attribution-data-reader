// This is for Windows attribution.
const MozCustom = {
  TAG: "__MOZCUSTOM__:",
  LEN: 1024,

  getIndex(bytes) {
    for (let i = 0; i < bytes.length; i++) {
      if (
        String.fromCharCode(...bytes.slice(i, i + this.TAG.length)) === this.TAG
      ) {
        return i + this.TAG.length;
      }
    }

    return -1;
  },

  getValue(certificateEntry) {
    const { certificateBytes } = certificateEntry;
    const index = this.getIndex(certificateBytes);

    if (index < 0) {
      return null;
    }

    const bytes = certificateBytes.slice(index, index + this.LEN);
    const firstNullByte = bytes.findIndex((b) => b === 0);

    return bytes.slice(0, firstNullByte);
  },
};

// This is for macOS attribution.
const MozAnchor = "__MOZILLA__";

const decodeRTAMO = (value) =>
  atob(value.slice(4).replace(/_/g, "/").replace(/-/g, "+"));

const App = {
  SHARE_QS: "?share",

  init() {
    this.$inputFile = document.getElementById("input-file");
    this.$inputMessage = document.getElementById("input-message");
    this.$outputRaw = document.getElementById("output-raw");
    this.$outputPretty = document.getElementById("output-pretty");

    const url = new URL(window.location);
    if (url.search === this.SHARE_QS) {
      const attributionData = url.hash.slice(1);
      this.$inputMessage.textContent = "Loading data from URL... OK";

      this.renderAttributionData(attributionData);
    }

    this.$inputFile.addEventListener(
      "change",
      this.onInputFileChange.bind(this)
    );
  },

  onInputFileChange() {
    this.resetUI();

    if (this.$inputFile.files?.length) {
      const [file] = this.$inputFile.files;
      const reader = new FileReader();

      reader.onloadend = () => this.onInputFileLoaded(reader, file.name);
      reader.readAsArrayBuffer(file);
    }
  },

  async onInputFileLoaded(reader, fileName) {
    this.$inputMessage.textContent = "Reading file...";

    if (!reader.result) {
      this.$inputMessage.textContent = "Error: could not read the input file.";
      return;
    }

    try {
      const attributionData = await this.readAttributionData(
        reader.result,
        fileName
      );
      this.$inputMessage.textContent += " OK";

      this.renderAttributionData(attributionData);

      // TODO: we do not make a shareable URL for macOS because we currently do
      // not fetch the attribution data.
      if (!fileName.endsWith(".dmg")) {
        this.setShareURL(attributionData);
      }
    } catch (err) {
      this.$inputMessage.textContent = `Error: ${err.message}`;
    }
  },

  resetUI() {
    this.$inputMessage.textContent = "";
    this.$outputRaw.textContent = "";
    this.$outputPretty.textContent = "";
  },

  async readAttributionData(arrayBuffer, fileName) {
    if (fileName.endsWith(".dmg")) {
      return this.readAttributionDataForMacOS(arrayBuffer);
    }

    return this.readAttributionDataForWindows(arrayBuffer);
  },

  async readAttributionDataForWindows(arrayBuffer) {
    let data;

    try {
      data = new MicrosoftPe(new KaitaiStream(arrayBuffer));
    } catch (err) {
      console.error(err);
      throw new Error("could not parse file, not a PE file?");
    }

    if (!data?.pe?.certificateTable?.items?.length) {
      throw new Error("no item in the certificate table, file not signed?");
    }

    data = MozCustom.getValue(data.pe.certificateTable.items[0]);

    if (data) {
      let decoded = new TextDecoder().decode(data);

      while (decoded.includes("%")) {
        try {
          const result = decodeURIComponent(decoded);
          if (result === decoded) {
            break;
          }
          decoded = result;
        } catch {
          break;
        }
      }

      return decoded;
    }

    throw new Error("attribution data not found");
  },

  async readAttributionDataForMacOS(arrayBuffer) {
    try {
      const stream = new KaitaiStream(arrayBuffer);
      // We need to read a special block in the DMG file, called the "koly"
      // block. There should be some information about a XML property list
      // file in this block.
      const dmg = new Dmg(stream);

      if (dmg.xmlPlist?.length) {
        // If we find the property list file, then we can attempt to parse it.
        // We are looking for an "attribution" key, which contains new
        // information about where to find the attribution data.
        const [attribution] = plist.parse(dmg.xmlPlist)["resource-fork"]
          ?.attribution;

        // Assuming things look okay, we now have to parse the binary data for
        // this attribution key in the property list file. This is encoded as a
        // structure coming from the `libdmg-hfsplus` project so we need a new
        // parser.
        const { attributionResource } = new Attribution(
          new KaitaiStream(attribution.Data)
        );

        // Let's extract the actual attribution data in the DMG file now that
        // we have all the information we need.
        stream.seek(attributionResource.rawPos);

        let data = stream.readBytes(attributionResource.rawLength);
        data = KaitaiStream.bytesToStr(data, "utf-8");
        // The data we extract is huge and `libdmg-hfsplus` seems to inject the
        // data somehwere but not necessarily at the start of the block of
        // data. In addition, there might be junk after, though I don't get
        // why. Anyway... let's find the data and then we get rid of everything
        // after the first null byte.
        data = data.substr(data.indexOf(MozAnchor) + MozAnchor.length);
        data = data.substr(0, data.indexOf("\0"));

        return data;
      }
    } catch (err) {
      console.log(err);
      // Do nothing else, we throw an error below anyway.
    }

    throw new Error("attribution data not found");
  },

  renderAttributionData(attributionData) {
    this.$outputRaw.textContent = attributionData;

    if (attributionData.length === 0) {
      this.$outputPretty.innerHTML = `<tr>
        <td align="center" colspan="2">
          (no attribution data)
        </td>
      </tr>`;
      return;
    }

    this.$outputPretty.innerHTML = attributionData
      .split("&")
      .map((part) => part.split("="))
      .filter((parts) => parts.length === 2)
      .map(([key, value]) => {
        if (key === "content" && value.startsWith("rta:")) {
          value += `<br><br>Add-on ID for RTAMO: ${decodeRTAMO(value)}`;
        }

        return `<tr><td>${key}</td><td>${value}</td></tr>`;
      })
      .join("");
  },

  setShareURL(attributionData) {
    const url = new URL(window.location);
    url.search = this.SHARE_QS;
    url.hash = `#${attributionData}`;
    window.history.pushState({}, "", url);
  },
};

App.init();
