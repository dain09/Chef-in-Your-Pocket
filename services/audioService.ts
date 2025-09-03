
import { Howl } from 'howler';

const sounds = {
  click: new Howl({
    src: ['https://cdn.jsdelivr.net/gh/k-next/sounds@main/sounds/ui_click.mp3'],
    volume: 0.5
  }),
  swoosh: new Howl({
    src: ['https://cdn.jsdelivr.net/gh/k-next/sounds@main/sounds/swoosh.mp3'],
     volume: 0.4
  }),
  success: new Howl({
    src: ['https://cdn.jsdelivr.net/gh/k-next/sounds@main/sounds/success_bell.mp3'],
     volume: 0.6
  }),
  pop: new Howl({
    src: ['https://cdn.jsdelivr.net/gh/k-next/sounds@main/sounds/ui_pop_high.mp3'],
    volume: 0.4
  }),
};

export const audioService = {
  playClick: () => sounds.click.play(),
  playSwoosh: () => sounds.swoosh.play(),
  playSuccess: () => sounds.success.play(),
  playPop: () => sounds.pop.play(),
};