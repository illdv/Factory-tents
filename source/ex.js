const player = document.querySelector('.player-1');
const video1 = player.querySelector('.viewer-1');
const progress1 = player.querySelector('.progress-1');
const progressBar1 = player.querySelector(['.progress__filled-1']);

function togglePlay() {
	video1[video1.paused ? 'play' : 'pause']();
}

function handleProgress() {
	const percent = (video1.currentTime / video1.duration) * 100;
	progressBar1.style.flexBasis = `${percent}%`;
}

function scrub(e) {
	const scrubTime = (e.offsetX / progress1.offsetWidth) * video1.duration;
	video1.currentTime = scrubTime;
}
video1.addEventListener('click', togglePlay);
video1.addEventListener('timeupdate', handleProgress);
let mousedown = false;
progress1.addEventListener('click', scrub);
progress1.addEventListener('mousemove', e => mousedown && scrub(e));
progress1.addEventListener('mousedown', () => {
	mousedown = true;
});
progress1.addEventListener('mouseup', () => {
	mousedown = false;
});