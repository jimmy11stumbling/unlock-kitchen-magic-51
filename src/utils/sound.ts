
export const playAlertSound = () => {
  const audio = new Audio('/alert.mp3');
  audio.volume = 0.5;
  return audio.play().catch(err => console.log('Audio playback failed:', err));
};
