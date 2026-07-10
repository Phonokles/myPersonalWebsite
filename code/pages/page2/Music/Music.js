
const SONGS = {
  paparazzi:  '28jp-30w8Lg',
  dandelions: 'HZbsLxL7GeM',
};

const players = {};
let inited = false;

function initPlayers() {
  if (inited) return;
  inited = true;

  for (const key in SONGS) {
    players[key] = new YT.Player('yt-' + key, {
      height: '200',
      width: '200',
      videoId: SONGS[key],
      playerVars: { controls: 0, disablekb: 1, rel: 0, playsinline: 1 },
      events: {
        onStateChange: (e) => updateButton(key, e.data),
        onError: (e) => console.warn('YouTube-Fehler bei "' + key + '" - Code ' + e.data),
      },
    });
  }
}

function onYouTubeIframeAPIReady() { initPlayers(); }
if (window.YT && window.YT.Player) initPlayers();


function updateButton(key, state) {
  const card = document.querySelector('.player[data-player="' + key + '"]');
  if (!card) return;
  const btn = card.querySelector('.play-btn');
  const playing = state === YT.PlayerState.PLAYING;
  btn.classList.toggle('is-playing', playing);
  btn.setAttribute('aria-label', playing ? 'pause' : 'play');
}


function toggle(key) {
  const p = players[key];
  if (!p || !p.getPlayerState) return;

  if (p.getPlayerState() === YT.PlayerState.PLAYING) {
    p.pauseVideo();
  } else {
    for (const other in players) {
      if (other !== key && players[other].pauseVideo) players[other].pauseVideo();
    }
    p.playVideo();
  }
}

// Klick-Handler an die Buttons haengen.
document.querySelectorAll('.player').forEach((card) => {
  card.querySelector('.play-btn').addEventListener('click', () => toggle(card.dataset.player));
});