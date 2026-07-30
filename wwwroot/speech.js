(() => {
  "use strict";

  const superscriptDigits = {
    "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
    "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9"
  };

  class ACTDrillSpeechController {
    constructor(getSettings, nativeBridge = null) {
      this.getSettings = getSettings;
      this.nativeBridge = nativeBridge;
      this.nativeVoices = [];
      this.voiceLoad = null;
      this.runId = 0;
      this.currentUtterance = null;
      this.currentAudio = null;
      this.startTimer = null;
      this.handleVoicesChanged = () => {
        window.dispatchEvent(new CustomEvent("actdrill:voices-changed"));
      };
      if (this.browserAvailable) {
        speechSynthesis.addEventListener("voiceschanged", this.handleVoicesChanged);
      }
    }

    get desktopAvailable() {
      return typeof this.nativeBridge === "function" &&
        !!(window.chrome && window.chrome.webview);
    }

    get browserAvailable() {
      return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    }

    get available() {
      return this.desktopAvailable || this.browserAvailable;
    }

    rendererName() {
      return this.desktopAvailable
        ? "Native Windows WAV"
        : (this.browserAvailable ? "Browser speech fallback" : "Unavailable");
    }

    voiceId(voice) {
      return voice.id || voice.voiceURI || `${voice.name}|${voice.lang}`;
    }

    async refreshVoices() {
      if (!this.desktopAvailable) {
        window.dispatchEvent(new CustomEvent("actdrill:voices-changed"));
        return this.voices();
      }
      if (this.voiceLoad) return this.voiceLoad;

      this.voiceLoad = this.nativeBridge("speechVoices", {}, 10000)
        .then(result => {
          if (!result.ok || !Array.isArray(result.voices)) {
            throw new Error(result.error || "Windows voice discovery failed.");
          }
          this.nativeVoices = result.voices.map(voice => ({
            id: voice.Id || voice.id || `native:${voice.Name || voice.name}`,
            name: voice.Name || voice.name,
            lang: voice.Culture || voice.culture || "",
            localService: true,
            native: true
          })).filter(voice => voice.name);
          window.dispatchEvent(new CustomEvent("actdrill:voices-changed"));
          return this.nativeVoices;
        })
        .catch(error => {
          this.reportError(error.message);
          return [];
        })
        .finally(() => {
          this.voiceLoad = null;
        });
      return this.voiceLoad;
    }

    voices() {
      if (this.desktopAvailable) return this.nativeVoices.slice();
      if (!this.browserAvailable) return [];
      const voices = speechSynthesis.getVoices();
      const localVoices = voices.filter(voice => voice.localService);
      const safeVoices = localVoices.length ? localVoices : voices;
      return safeVoices.slice().sort((a, b) => {
        const englishA = /^en(?:-|_)/i.test(a.lang) ? 0 : 1;
        const englishB = /^en(?:-|_)/i.test(b.lang) ? 0 : 1;
        return englishA - englishB || a.name.localeCompare(b.name);
      });
    }

    selectedVoice() {
      const voices = this.voices();
      if (!voices.length) return null;
      const settings = this.getSettings();
      const selected = voices.find(voice => this.voiceId(voice) === settings.voiceId);
      if (selected) return selected;

      const score = voice => {
        let value = 0;
        if (/en[-_]US/i.test(voice.lang)) value += 6;
        else if (/^en/i.test(voice.lang)) value += 3;
        if (/natural|aria|jenny|guy|zira|david/i.test(voice.name)) value += 4;
        return value;
      };
      return voices.sort((a, b) => score(b) - score(a))[0] || voices[0];
    }

    selectedVoiceName() {
      return this.selectedVoice()?.name || "Windows default";
    }

    render(text) {
      const exponentWords = (_, base, exponent) => {
        const negative = exponent.startsWith("⁻") || exponent.startsWith("-");
        const digits = exponent
          .replace(/^[⁻-]/, "")
          .split("")
          .map(digit => superscriptDigits[digit] || digit)
          .join("");
        if (!negative && digits === "2") return `${base} squared`;
        if (!negative && digits === "3") return `${base} cubed`;
        return `${base} to the ${negative ? "negative " : ""}${digits} power`;
      };

      return String(text || "")
        .replace(/\|([^|]+)\|/g, ", $1, ")
        .replace(/([A-Za-z0-9])([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, exponentWords)
        .replace(/([A-Za-z0-9])\^(-?\d+)/g, exponentWords)
        .replace(/√\s*/g, " square root of ")
        .replace(/π/g, " pi ")
        .replace(/(\d+)\s*\/\s*(\d+)/g, "$1 divided by $2")
        .replace(/([A-Za-z])\(([^)]+)\)/g, "$1 of $2")
        .replace(/≠/g, " is not equal to ")
        .replace(/≤/g, " is less than or equal to ")
        .replace(/≥/g, " is greater than or equal to ")
        .replace(/=/g, " equals ")
        .replace(/×/g, " times ")
        .replace(/÷/g, " divided by ")
        .replace(/([0-9)])\s*−\s*([0-9(])/g, "$1 minus $2")
        .replace(/−/g, " negative ")
        .replace(/%/g, " percent ")
        .replace(/°/g, " degrees ")
        .replace(/→/g, " gives ")
        .replace(/\s+/g, " ")
        .replace(/\s+([,.;!?])/g, "$1")
        .trim();
    }

    split(text, maximumLength = 150) {
      const normalized = String(text || "").replace(/\s+/g, " ").trim();
      if (!normalized) return [];
      const sentences = normalized.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [normalized];
      const chunks = [];

      for (const sentence of sentences) {
        let remaining = sentence.trim();
        while (remaining.length > maximumLength) {
          const windowText = remaining.slice(0, maximumLength + 1);
          const comma = windowText.lastIndexOf(", ");
          const space = windowText.lastIndexOf(" ");
          const splitAt = Math.max(comma > maximumLength * 0.55 ? comma + 1 : 0, space);
          const safeSplit = splitAt > 0 ? splitAt : maximumLength;
          chunks.push(remaining.slice(0, safeSplit).trim());
          remaining = remaining.slice(safeSplit).trim();
        }
        if (remaining) chunks.push(remaining);
      }
      return chunks;
    }

    stop() {
      this.runId += 1;
      if (this.startTimer) {
        clearTimeout(this.startTimer);
        this.startTimer = null;
      }
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.removeAttribute("src");
        this.currentAudio.load();
        this.currentAudio = null;
      }
      this.currentUtterance = null;
      if (this.browserAvailable) speechSynthesis.cancel();
    }

    speak(text, onDone) {
      const settings = this.getSettings();
      if (!this.available || !settings.on || !text) {
        onDone?.();
        return Promise.resolve();
      }

      this.stop();
      const run = this.runId;
      const rendered = this.render(text);
      return this.desktopAvailable
        ? this.speakNative(rendered, run, onDone)
        : this.speakBrowser(rendered, run, onDone);
    }

    async speakNative(text, run, onDone) {
      if (!this.nativeVoices.length) await this.refreshVoices();
      if (run !== this.runId) return;

      const settings = this.getSettings();
      const voice = this.selectedVoice();
      const rate = Math.max(-10, Math.min(10,
        Math.round(((Number(settings.rate) || 0.9) - 0.9) * 10)));
      const result = await this.nativeBridge("speechSynthesize", {
        text,
        voice: voice?.name || "",
        rate
      }, 30000);
      if (run !== this.runId) return;
      if (!result.ok || !result.audioBase64) {
        this.reportError(result.error || "Windows could not render that speech.");
        onDone?.();
        return;
      }

      const audio = new Audio(
        `data:${result.mimeType || "audio/wav"};base64,${result.audioBase64}`
      );
      audio.volume = Math.max(0, Math.min(1,
        settings.volume == null ? 1 : Number(settings.volume)));
      audio.onended = () => {
        if (run !== this.runId) return;
        this.currentAudio = null;
        onDone?.();
      };
      audio.onerror = () => {
        if (run !== this.runId) return;
        this.currentAudio = null;
        this.reportError("The native speech audio could not be played.");
        onDone?.();
      };
      this.currentAudio = audio;
      try {
        await audio.play();
      } catch (error) {
        if (run !== this.runId) return;
        this.currentAudio = null;
        this.reportError(error.message || "The native speech audio was blocked.");
        onDone?.();
      }
    }

    speakBrowser(text, run, onDone) {
      const settings = this.getSettings();
      const chunks = this.split(text);
      const voice = this.selectedVoice();
      let index = 0;
      let finished = false;

      const finish = () => {
        if (finished || run !== this.runId) return;
        finished = true;
        this.currentUtterance = null;
        onDone?.();
      };
      const next = () => {
        if (run !== this.runId) return;
        if (index >= chunks.length) {
          finish();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index++]);
        utterance.rate = Number(settings.rate) || 0.9;
        utterance.pitch = 1;
        utterance.volume = settings.volume == null ? 1 : Number(settings.volume);
        if (voice) utterance.voice = voice;
        utterance.onend = next;
        utterance.onerror = event => {
          if (event.error === "canceled" || event.error === "interrupted") {
            finish();
            return;
          }
          next();
        };
        this.currentUtterance = utterance;
        speechSynthesis.resume();
        speechSynthesis.speak(utterance);
      };

      this.startTimer = setTimeout(() => {
        this.startTimer = null;
        next();
      }, 40);
      return Promise.resolve();
    }

    reportError(message) {
      window.dispatchEvent(new CustomEvent("actdrill:speech-error", {
        detail: String(message || "Speech rendering failed.")
      }));
    }
  }

  window.ACTDrillSpeechController = ACTDrillSpeechController;
})();
