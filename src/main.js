import player from './components/player';
import visualizer from './components/visualizer';
import status from './components/status';
import EventEmitter from './app/EventEmitter';
import { getTrack } from './app/utils';

const eventBus = new EventEmitter();
player.environment = eventBus;

let currentTrack = getTrack(0);
let nextTrack = currentTrack;

const logoAccent = /** @type HTMLElement */ (
  document.querySelector('.page__logo-part_accent')
);
logoAccent.style.color = currentTrack?.theme?.color ?? 'inherit';
logoAccent.classList.remove('no-animation');

player.on('playing:toggle', ({ trackNum, flag }) => {
  visualizer.togglePlaying(flag);
  status.togglePlaying(flag);
});
player.on('change-record:init', ({ trackNum }) => {
  if ((nextTrack = getTrack(trackNum))) {
    status.track = nextTrack;
    status.toggleLoading(true);

    const { video } = getTrack(trackNum) ?? {};
    // console.log('change to track num', trackNum, getTrack(trackNum));
    if (video) {
      visualizer.once('footage-loaded', () =>
        eventBus.trigger('ready2change-record'),
      );
      visualizer.nextFootage = video;
    }
  }
});
player.on('change-record:start-animation', () => {
  visualizer.replaceFootage();

  const themeColor = nextTrack?.theme?.color ?? '';
  logoAccent.style.color = themeColor || 'inherit';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColor);
});
player.on('change-record:start', () => {
  status.toggleLoading(false); // by this time both audio n video loaded
});
player.on('change-record:end', () => {
  currentTrack = nextTrack;
});

status.track = currentTrack;
