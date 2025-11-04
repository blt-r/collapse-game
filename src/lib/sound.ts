import popSoundPath from "$lib/assets/pop.mp3";
import clickSoundPath from "$lib/assets/click.mp3";

import { browser } from "$app/environment";

let popAudio: HTMLAudioElement | null = null;
let clickAudio: HTMLAudioElement | null = null;

if (browser) {
  popAudio = new Audio(popSoundPath);
  popAudio.volume = 0.2;
  clickAudio = new Audio(clickSoundPath);
  clickAudio.volume = 0.2;
}

export const popSound = () => {
  if (!popAudio) return;
  popAudio.currentTime = 0;
  popAudio.play();
};

export const clickSound = () => {
  if (!clickAudio) return;
  clickAudio.currentTime = 0;
  clickAudio.play();
};
