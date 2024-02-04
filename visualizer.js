const visualizer = document.getElementById('visualizer');
const canvasCtx = visualizer.getContext('2d');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvasCtx.fillStyle = '#333';

function updateVisualizer() {
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);

  const barWidth = (visualizer.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] / 2;

    canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }

  requestAnimationFrame(updateVisualizer);
}

audio.addEventListener('play', () => {
  audioContext.resume().then(() => {
    updateVisualizer();
  });
});