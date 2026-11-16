// The browser's own speech recognition (Chrome on Android and PC, Safari on iPhone and Mac).
// It stops by itself after silence or a minute or so; while listening is on, it is restarted
// at once, and the last words of the previous session are kept so matching doesn't lose context.
import { normWord } from './align.js';

const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;

// Inside the Яйца Cloud app for Android the page lives in a WebView, which has no speech
// recognition of its own. From version 1.5 the app recognizes speech with Android's own
// recognizer and passes the words in: YaytsaAndroid.speech(json) to start and stop, results
// come back as 'yaytsa-app' events { type: 'speech', text, final } / 'speech-state' / 'speech-error'.
export const inApp = /YaytsaCloudAndroid\//.test(navigator.userAgent);
const bridge = window.YaytsaAndroid;
export const nativeSpeech = inApp && typeof bridge?.speech === 'function';
export const speechSupported = nativeSpeech || (!!Rec && !inApp);

class NativeListener {
  constructor({ lang = 'ru-RU', onWords, onState, onError }) {
    Object.assign(this, { lang, onWords, onState, onError });
    this.active = false;
    this.carry = [];
    this.session = [];
    this.onEvent = e => {
      const m = e.detail || {};
      if (!this.active) return;
      if (m.type === 'speech') {
        const words = String(m.text || '').split(/\s+/).map(normWord).filter(Boolean);
        this.session = words;
        this.onWords?.(this.carry.concat(words));
        // a finished phrase becomes context for the next one
        if (m.final) { this.carry = this.carry.concat(words).slice(-8); this.session = []; }
      } else if (m.type === 'speech-state') this.onState?.(m.state);
      else if (m.type === 'speech-error') { this.onError?.(m.error); this.stop(); }
    };
  }

  start() {
    if (this.active) return;
    this.active = true;
    addEventListener('yaytsa-app', this.onEvent);
    bridge.speech(JSON.stringify({ type: 'start', lang: this.lang }));
  }

  stop() {
    if (this.active) bridge.speech(JSON.stringify({ type: 'stop' }));
    this.active = false;
    removeEventListener('yaytsa-app', this.onEvent);
    this.onState?.('off');
  }
}

class WebListener {
  constructor({ lang = 'ru-RU', onWords, onState, onError }) {
    Object.assign(this, { lang, onWords, onState, onError });
    this.active = false;
    this.rec = null;
    this.carry = [];
    this.session = [];
    this.fails = 0;
  }

  start() {
    if (!Rec || this.active) return;
    this.active = true;
    this.fails = 0;
    this.open();
  }

  stop() {
    this.active = false;
    clearTimeout(this.retry);
    clearInterval(this.watch);
    const r = this.rec;
    this.rec = null;
    if (r) { r.onend = r.onresult = r.onerror = r.onstart = null; try { r.abort(); } catch { /* already stopped */ } }
    this.onState?.('off');
  }

  open() {
    if (!this.active) return;
    const r = new Rec();
    r.lang = this.lang;
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;
    // Always the browser's cloud service: no on-device language pack, so the browser has no
    // reason to offer a large model download.
    if ('processLocally' in r) r.processLocally = false;
    this.carry = this.carry.concat(this.session).slice(-8);
    this.session = [];
    this.last = Date.now();
    r.onstart = () => { this.onState?.('on'); this.last = Date.now(); };
    r.onresult = e => {
      this.fails = 0;
      this.last = Date.now();
      // The newest results first, until there are enough words. On Android one result often
      // already holds the whole phrase so far; older ones then only add context.
      let words = [];
      for (let k = e.results.length - 1; k >= 0 && words.length < 16; k--) {
        words = e.results[k][0].transcript.split(/\s+/).map(normWord).filter(Boolean).concat(words);
      }
      this.session = words;
      this.onWords?.(this.carry.concat(words));
    };
    r.onerror = e => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') {
        this.onError?.(e.error);
        this.stop();
      } else if (e.error === 'network') {
        this.fails++;
        this.onState?.('network');
      }
    };
    r.onend = () => {
      if (this.rec !== r || !this.active) return;
      this.onState?.('restart');
      // back off if the service keeps failing (no internet), otherwise reopen at once
      const wait = this.fails ? Math.min(5000, 300 * 2 ** this.fails) : 30;
      this.retry = setTimeout(() => this.open(), wait);
    };
    this.rec = r;
    try { r.start(); } catch { this.retry = setTimeout(() => this.open(), 300); }
    // a recognizer that hangs silently is aborted (onend then reopens it)
    clearInterval(this.watch);
    this.watch = setInterval(() => {
      if (this.active && this.rec === r && Date.now() - this.last > 25000) { try { r.abort(); } catch { /* gone */ } }
    }, 5000);
  }
}

export const Listener = nativeSpeech ? NativeListener : WebListener;
