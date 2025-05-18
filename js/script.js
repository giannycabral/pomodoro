// Variáveis e configurações do timer
let timeLeft;
let timerId = null;
let isBreak = false;

// Elementos do DOM
const timerDisplay = document.querySelector(".timer");
const toggleButton = document.getElementById("toggle");
const resetButton = document.getElementById("reset");
const notesTextarea = document.getElementById("study-notes");

// Configurações do timer (em minutos)
const WORK_TIME = 25;
const BREAK_TIME = 5;

// Configurações de mensagens
const MESSAGES = {
  break: {
    title: "Hora do intervalo!",
    notification: "Hora do intervalo!",
    body: "Faça uma pausa relaxante!",
    icon: "⏲",
  },
  work: {
    title: "Hora de estudar!",
    notification: "Hora de estudar!",
    body: "Vamos focar nos estudos!",
    icon: "⏰",
  },
};

// Funções auxiliares
function formatTime(minutes, seconds) {
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 3000);
}

// Configurações dos botões
const BUTTON_STATES = {
  start: { icon: "►", text: "INICIAR" },
  pause: { icon: "||", text: "PAUSAR" },
  continue: { icon: "►", text: "CONTINUAR" },
};

function updateStartButton(state) {
  const { icon, text } = BUTTON_STATES[state];
  toggleButton.innerHTML = `<span class="btn-icon">${icon}</span><span class="btn-text">${text}</span>`;
}

function getNotificationConfig() {
  const mode = isBreak ? "break" : "work";
  const { title, body, icon } = MESSAGES[mode];
  return {
    title,
    body,
    icon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${icon}</text></svg>`,
  };
}

function updateModeText() {
  const modeText = document.getElementById("mode-text");
  modeText.textContent = isBreak ? "BREAK" : "WORK";
}

function updateProgressBar() {
  const progress = document.getElementById("timer-progress");
  const totalTime = isBreak ? BREAK_TIME * 60 : WORK_TIME * 60;
  const percentage = (timeLeft / totalTime) * 100;
  progress.style.width = `${percentage}%`;
}

function resetTimerState() {
  clearInterval(timerId);
  timerId = null;
  isBreak = false;
  timeLeft = WORK_TIME * 60;
  updateStartButton("start");
  timerDisplay.textContent = formatTime(WORK_TIME, 0);
  document.title = "Timer Retro";
}

function updateTimer() {
  if (timeLeft <= 0) {
    handleTimerComplete();
    return;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = formatTime(minutes, seconds);
  document.title = `${formatTime(minutes, seconds)} - Timer Retro`;
  updateProgressBar();
  timeLeft--;
}

function handleTimerComplete() {
  clearInterval(timerId);
  timerId = null;
  isBreak = !isBreak;
  timeLeft = isBreak ? BREAK_TIME * 60 : WORK_TIME * 60;
  updateStartButton("start");
  updateModeText();

  const mode = isBreak ? "break" : "work";
  showNotification(MESSAGES[mode].notification);

  if (Notification.permission === "granted") {
    const config = getNotificationConfig();
    new Notification(config.title, config);
  }
}

// Event listeners
toggleButton.addEventListener("click", () => {
  if (timerId === null) {
    if (!timeLeft) {
      timeLeft = WORK_TIME * 60;
    }
    timerId = setInterval(updateTimer, 1000);
    updateStartButton("pause");
  } else {
    clearInterval(timerId);
    timerId = null;
    updateStartButton("continue");
  }
});

resetButton.addEventListener("click", resetTimerState);

// Salvar notas automaticamente
notesTextarea?.addEventListener("input", () => {
  localStorage.setItem("studyNotes", notesTextarea.value);
});

// Carregar notas salvas
if (notesTextarea && localStorage.getItem("studyNotes")) {
  notesTextarea.value = localStorage.getItem("studyNotes");
}

// Solicitar permissão para notificações
if (
  Notification.permission !== "granted" &&
  Notification.permission !== "denied"
) {
  Notification.requestPermission();
}

// Configuração das partículas
particlesJS("particles-js", {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#00ffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      animation: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#4d4dff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      push: {
        particles_nb: 4,
      },
    },
  },
  retina_detect: true,
});

// Inicializar o timer
resetTimerState();
