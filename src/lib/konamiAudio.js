// Easter-egg audio: the Contra title theme, played softly on a loop when the
// secret login is opened via the Konami code. One shared Audio instance so the
// track never stacks on itself.
import titleTheme from '../assets/contra/01. Title Screen.mp3'

let audio = null

function getAudio() {
  if (!audio && typeof Audio !== 'undefined') {
    audio = new Audio(titleTheme)
    audio.loop = true
    audio.volume = 0.15 // lightly
  }
  return audio
}

// Called from a user gesture (the final Konami keypress), so autoplay is allowed.
// Any rejection (e.g. an aggressive autoplay policy) is swallowed — it's a
// non-critical flourish, never a crash.
export function playKonamiTune() {
  const a = getAudio()
  if (!a) return
  a.currentTime = 0
  a.play().catch(() => {})
}

export function stopKonamiTune() {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
}
