function copyAudioData(gl, audioData, textureData) {
	for (var i = 0; i < audioData.length; i++) {
		textureData[4 * i + 0] = audioData[i]; // R
		textureData[4 * i + 1] = audioData[i]; // G
		textureData[4 * i + 2] = audioData[i]; // B
		textureData[4 * i + 3] = 255; // A
	}
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, audioData.length,
	// 	1, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
}

export function audio(options = {}) {
	const element = document.createElement("audio");
	element.controls = options.controls || "controls";
	element.crossOrigin = options.crossOrigin || "anonymous";

	var context;
	var analyser;
	var spectrumAudioData;
	var spectrumTextureData;
	var waveformAudioData;
	var waveformTextureData;

	function handlePlay() {
		if (!context) {
			context = new AudioContext();
			analyser = context.createAnalyser();

			const masterGain = context.createGain();
			masterGain.connect(context.destination);
			masterGain.connect(analyser);

			const source = context.createMediaElementSource(element);
			source.connect(masterGain);

			const binCount = analyser.frequencyBinCount;

			spectrumAudioData = new Uint8Array(binCount);
			spectrumTextureData = new Uint8Array(4 * spectrumAudioData.length);

			waveformAudioData = new Float32Array(binCount);
			waveformTextureData = new Uint8Array(4 * waveformAudioData.length);
		}
	}

	return {
		destroy() {
			element.pause();
			element.currentTime = 0;
			element.removeEventListener("play", handlePlay);
		},

		play(src) {
			element.addEventListener("play", handlePlay);
			element.src = src;
		},

		update(gl) {
			if (context) {
				analyser.getFrequencyData(spectrumAudioData);
				copyAudioData(gl, spectrumAudioData, spectrumTextureData);

				analyser.getFloatTimeDomainData(waveformAudioData);
				copyAudioData(gl, waveformAudioData, waveformTextureData);
			}
		},
	};
}
