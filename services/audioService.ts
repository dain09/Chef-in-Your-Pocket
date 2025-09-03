import { Howl, Howler } from 'howler';

// Base URL for audio files from the GitHub repository to ensure they are accessible
// even when not available in the local development environment.
const audioBaseUrl = 'https://raw.githubusercontent.com/dain09/Chef-in-Your-Pocket/main/audio/';

const sounds = {
  click: new Howl({
    src: [`${audioBaseUrl}ui_click.mp3`],
    volume: 0.5
  }),
  swoosh: new Howl({
    src: [`${audioBaseUrl}swoosh.mp3`],
     volume: 0.4
  }),
  success: new Howl({
    src: [`${audioBaseUrl}success_bell.mp3`],
     volume: 0.6
  }),
  pop: new Howl({
    src: [`${audioBaseUrl}ui_pop_high.mp3`],
    volume: 0.4
  }),
  // Ambiance sounds
  sizzle: new Howl({
    src: [`${audioBaseUrl}sizzle_long.mp3`],
    volume: 0.2,
    loop: true,
  }),
  chopping: new Howl({
    src: [`${audioBaseUrl}chopping_board.mp3`],
    volume: 0.3,
    loop: true,
  }),
  boiling: new Howl({
    src: [`${audioBaseUrl}water_boiling.mp3`],
    volume: 0.15,
    loop: true,
  }),
};

let currentAmbiance: Howl | null = null;

export const audioService = {
  playClick: () => sounds.click.play(),
  playSwoosh: () => sounds.swoosh.play(),
  playSuccess: () => sounds.success.play(),
  playPop: () => sounds.pop.play(),
  
  playAmbiance: (sound: keyof typeof sounds) => {
    if (currentAmbiance) {
      currentAmbiance.stop();
    }
    const ambianceSound = sounds[sound];
    if (ambianceSound) {
      ambianceSound.play();
      currentAmbiance = ambianceSound;
    }
  },
  
  stopAmbiance: () => {
    if (currentAmbiance) {
      currentAmbiance.stop();
      currentAmbiance = null;
    }
  },

  toggleMute: (mute: boolean) => {
    Howler.mute(mute);
  }
};
