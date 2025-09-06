

import { Howl, Howler } from 'howler';

const sounds = {
  click: new Howl({
    src: ['/audio/ui_click.mp3'],
    volume: 0.5
  }),
  swoosh: new Howl({
    src: ['/audio/swoosh.mp3'],
     volume: 0.4
  }),
  success: new Howl({
    src: ['/audio/success_bell.mp3'],
     volume: 0.6
  }),
  pop: new Howl({
    src: ['/audio/ui_pop_high.mp3'],
    volume: 0.4
  }),
  // Ambiance sounds
  sizzle: new Howl({
    src: ['/audio/sizzle_long.mp3'],
    volume: 0.2,
    loop: true,
  }),
  chopping: new Howl({
    src: ['/audio/chopping_board.mp3'],
    volume: 0.3,
    loop: true,
  }),
  boiling: new Howl({
    src: ['/audio/water_boiling.mp3'],
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