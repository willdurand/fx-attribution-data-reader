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
      const reader = new FileReader();
      reader.onloadend = () => this.onInputFileLoaded(reader);
      reader.readAsArrayBuffer(this.$inputFile.files[0]);
    }
  },

  async onInputFileLoaded(reader) {
    this.$inputMessage.textContent = "Reading file...";

    if (!reader.result) {
      this.$inputMessage.textContent = "Error: could not read the input file.";
      return;
    }

    try {
      const attributionData = await this.readAttributionData(reader.result);
      this.$inputMessage.textContent += " OK";

      this.renderAttributionData(attributionData);
      this.setShareURL(attributionData);
    } catch (err) {
      this.$inputMessage.textContent = `Error: ${err.message}`;
    }
  },

  resetUI() {
    this.$inputMessage.textContent = "";
    this.$outputRaw.textContent = "";
    this.$outputPretty.textContent = "";
  },

  async readAttributionData(arrayBuffer) {
    let data;

    try {
      data = new MicrosoftPe(new KaitaiStream(arrayBuffer));
    } catch (err) {
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

  renderAttributionData(attributionData) {
    this.$outputRaw.textContent = attributionData;
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
