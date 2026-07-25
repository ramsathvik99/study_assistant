/**
 * Utility to interface with the native Web Speech API for Text-to-Speech (TTS).
 */

class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((speaking: boolean) => void) | null = null;

  constructor() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public speak(text: string, onStateChange: (speaking: boolean) => void): void {
    if (!this.synth) return;

    this.stop();
    this.onStateChangeCallback = onStateChange;

    // Clean up text (strip html tags if any)
    const cleanedText = text.replace(/<[^>]*>/g, "");

    this.currentUtterance = new SpeechSynthesisUtterance(cleanedText);

    this.currentUtterance.onstart = () => {
      if (this.onStateChangeCallback) this.onStateChangeCallback(true);
    };

    this.currentUtterance.onend = () => {
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      this.currentUtterance = null;
    };

    this.currentUtterance.onerror = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      this.currentUtterance = null;
    };

    // Use a standard english voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (voice) => voice.lang.includes("en-US") || voice.lang.includes("en-GB")
    );
    if (englishVoice) {
      this.currentUtterance.voice = englishVoice;
    }

    this.currentUtterance.rate = 1.0;
    this.currentUtterance.pitch = 1.0;

    this.synth.speak(this.currentUtterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback(false);
        this.onStateChangeCallback = null;
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const tts = new TextToSpeechService();
export default tts;
