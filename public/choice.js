const audience = document.querySelector('.js-audience-mode');
const player = document.querySelector('.js-player');
const host = document.querySelector('.js-host');

audience.addEventListener('click', () => {
  window.location.href = "/audience";
});

player.addEventListener('click', () => {
  window.location.href = "/join";
});

host.addEventListener('click', () => {
  window.location.href = "/host";
});