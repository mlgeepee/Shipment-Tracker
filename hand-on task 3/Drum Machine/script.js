const BANKS = {
  heater: [
    { key: "Q", id: "Heater-1", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
    { key: "W", id: "Heater-2", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
    { key: "E", id: "Heater-3", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
    { key: "A", id: "Heater-4", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
    { key: "S", id: "Clap", src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
    { key: "D", id: "Open-HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
    { key: "Z", id: "Kick-n-Hat", src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
    { key: "X", id: "Kick", src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
    { key: "C", id: "Closed-HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" },
  ],
  smooth: [
    { key: "Q", id: "Chord-1", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3" },
    { key: "W", id: "Chord-2", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3" },
    { key: "E", id: "Chord-3", src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3" },
    { key: "A", id: "Shaker", src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3" },
    { key: "S", id: "Open-HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3" },
    { key: "D", id: "Closed-HH", src: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3" },
    { key: "Z", id: "Punchy-Kick", src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3" },
    { key: "X", id: "Side-Stick", src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3" },
    { key: "C", id: "Snare", src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3" },
  ],
};

const machine = document.getElementById("drum-machine");
const display = document.getElementById("display");
const powerToggle = document.getElementById("power-toggle");
const bankToggle = document.getElementById("bank-toggle");
const volumeSlider = document.getElementById("volume-slider");
const pads = Array.from(document.querySelectorAll(".drum-pad"));

const state = {
  power: true,
  bank: "heater",
  volume: 0.5,
};

const getBankLabel = () => (state.bank === "heater" ? "Heater Kit" : "Smooth Piano Kit");

const setDisplay = (text) => {
  display.textContent = text;
};

const syncToggleStyles = () => {
  powerToggle.classList.toggle("on", state.power);
  bankToggle.classList.toggle("on", state.bank === "smooth");
  powerToggle.setAttribute("aria-pressed", `${state.power}`);
  bankToggle.setAttribute("aria-pressed", `${state.bank === "smooth"}`);
  machine.classList.toggle("off", !state.power);
};

const loadBank = () => {
  const map = new Map(BANKS[state.bank].map((item) => [item.key, item]));

  pads.forEach((pad) => {
    const key = pad.dataset.key;
    const config = map.get(key);
    const clip = pad.querySelector(".clip");

    pad.id = config.id;
    clip.src = config.src;
    clip.volume = state.volume;
  });
};

const flashPad = (pad) => {
  pad.classList.add("active");
  window.setTimeout(() => pad.classList.remove("active"), 120);
};

const playSound = (key) => {
  if (!state.power) {
    return;
  }

  const upperKey = key.toUpperCase();
  const pad = pads.find((item) => item.dataset.key === upperKey);
  if (!pad) {
    return;
  }

  const clip = pad.querySelector(".clip");
  clip.currentTime = 0;
  clip.volume = state.volume;
  clip.play().catch(() => {
    setDisplay("Audio blocked");
  });

  flashPad(pad);
  setDisplay(pad.id.replace(/-/g, " "));
};

pads.forEach((pad) => {
  pad.addEventListener("click", () => playSound(pad.dataset.key));
});

window.addEventListener("keydown", (event) => {
  playSound(event.key);
});

powerToggle.addEventListener("click", () => {
  state.power = !state.power;
  syncToggleStyles();

  if (!state.power) {
    setDisplay("Power Off");
    return;
  }

  setDisplay(getBankLabel());
});

bankToggle.addEventListener("click", () => {
  if (!state.power) {
    return;
  }

  state.bank = state.bank === "heater" ? "smooth" : "heater";
  loadBank();
  syncToggleStyles();
  setDisplay(getBankLabel());
});

volumeSlider.addEventListener("input", (event) => {
  state.volume = Number(event.target.value) / 100;

  if (!state.power) {
    return;
  }

  const level = Math.round(state.volume * 100);
  setDisplay(`Volume: ${level}`);

  pads.forEach((pad) => {
    const clip = pad.querySelector(".clip");
    clip.volume = state.volume;
  });
});

loadBank();
syncToggleStyles();
setDisplay(getBankLabel());
