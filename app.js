(function () {
  const synth = window.speechSynthesis;
  const textInput = document.getElementById('text-input');
  const voiceSelect = document.getElementById('voice-select');
  const rateInput = document.getElementById('rate');
  const pitchInput = document.getElementById('pitch');
  const rateValue = document.getElementById('rate-value');
  const pitchValue = document.getElementById('pitch-value');
  const btnSpeak = document.getElementById('btn-speak');
  const btnPause = document.getElementById('btn-pause');
  const btnStop = document.getElementById('btn-stop');
  const status = document.getElementById('status');
  const mark = document.querySelector('.app__mark');
  const urlInput = document.getElementById('url-input');
  const btnFetch = document.getElementById('btn-fetch');

  if (!synth) {
    status.textContent = "This browser doesn't support speech synthesis.";
    btnSpeak.disabled = true;
    return;
  }

  let voices = [];

  function loadVoices() {
    voices = synth.getVoices();
    if (!voices.length) return;
    voiceSelect.innerHTML = '';
    voices.forEach((voice, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(opt);
    });
    const defaultIndex = voices.findIndex((v) => v.default);
    if (defaultIndex >= 0) voiceSelect.value = defaultIndex;
  }

  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }

  rateInput.addEventListener('input', () => {
    rateValue.textContent = `${parseFloat(rateInput.value).toFixed(1)}×`;
  });
  pitchInput.addEventListener('input', () => {
    pitchValue.textContent = parseFloat(pitchInput.value).toFixed(1);
  });

  function setSpeakingState(isSpeaking) {
    mark.classList.toggle('is-active', isSpeaking);
    btnSpeak.disabled = isSpeaking;
    btnPause.disabled = !isSpeaking;
    btnStop.disabled = !isSpeaking;
  }

  btnSpeak.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
      status.textContent = 'Type or paste something first.';
      return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const chosen = voices[voiceSelect.value];
    if (chosen) utterance.voice = chosen;
    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);

    utterance.onstart = () => { setSpeakingState(true); status.textContent = 'Speaking…'; };
    utterance.onend = () => { setSpeakingState(false); status.textContent = 'Done.'; };
    utterance.onerror = () => { setSpeakingState(false); status.textContent = 'Something interrupted playback.'; };

    synth.speak(utterance);
  });

  btnPause.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      btnPause.textContent = 'Resume';
      status.textContent = 'Paused.';
    } else if (synth.paused) {
      synth.resume();
      btnPause.textContent = 'Pause';
      status.textContent = 'Speaking…';
    }
  });

  btnStop.addEventListener('click', () => {
    synth.cancel();
    setSpeakingState(false);
    btnPause.textContent = 'Pause';
    status.textContent = 'Stopped.';
  });

  btnFetch.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) {
      status.textContent = 'Paste an article URL first.';
      return;
    }

    btnFetch.disabled = true;
    btnFetch.textContent = 'Fetching…';
    status.textContent = 'Fetching article…';

    try {
      const res = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok) {
        status.textContent = data.error || 'Could not fetch that article.';
        return;
      }

      textInput.value = data.title ? `${data.title}\n\n${data.text}` : data.text;
      status.textContent = 'Article loaded — hit Speak to listen.';
    } catch (err) {
      status.textContent = 'Something went wrong fetching that page.';
    } finally {
      btnFetch.disabled = false;
      btnFetch.textContent = 'Fetch article';
    }
  });
})();
