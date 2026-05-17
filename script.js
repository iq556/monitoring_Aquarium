/* =========================
   SIDEBAR MENU
========================= */
const sidebar = document.getElementById("sidebarMenu");
const backdrop = document.getElementById("sidebarBackdrop");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const navLinks = document.querySelectorAll(".side-nav a");
const sections = document.querySelectorAll("main section[id]");

function openSidebar() {
  sidebar?.classList.add("show");
  backdrop?.classList.add("show");
}

function closeSidebar() {
  sidebar?.classList.remove("show");
  backdrop?.classList.remove("show");
}

function setActiveMenu(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

function setActiveMenuFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (hash) {
    setActiveMenu(hash);
  } else {
    setActiveMenu("beranda");
  }
}

openSidebarBtn?.addEventListener("click", openSidebar);
backdrop?.addEventListener("click", closeSidebar);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.getAttribute("href").replace("#", "");
    setActiveMenu(id);
    closeSidebar();
  });
});

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveMenu(entry.target.id);
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener("load", setActiveMenuFromHash);
window.addEventListener("hashchange", setActiveMenuFromHash);

/* =========================
   QUIZ MONITORING AQUARIUM
========================= */
const quizData = [
  {
    question: "Sensor DHT22 pada simulasi digunakan untuk membaca...",
    options: [
      "Suhu dan kelembapan",
      "Jarak dan tinggi air",
      "Kekeruhan air",
      "Gerak servo"
    ],
    answer: "Suhu dan kelembapan",
  },
  {
    question: "Sensor HC-SR04 digunakan untuk membaca...",
    options: [
      "Kelembapan udara",
      "Jarak sensor ke permukaan air",
      "Nilai kekeruhan",
      "Suhu air"
    ],
    answer: "Jarak sensor ke permukaan air",
  },
  {
    question: "Suhu air tropis yang dianggap ideal pada sistem adalah...",
    options: [
      "10°C - 15°C",
      "24°C - 28°C",
      "35°C - 40°C",
      "45°C - 60°C"
    ],
    answer: "24°C - 28°C",
  },
  {
    question: "Air dianggap keruh jika nilai potentiometer...",
    options: [
      "Kurang dari 100",
      "Sama dengan 0",
      "Lebih dari atau sama dengan 2500",
      "Lebih dari 5000"
    ],
    answer: "Lebih dari atau sama dengan 2500",
  },
  {
    question: "Pada mode otomatis, relay/pompa menyala ketika...",
    options: [
      "Air rendah",
      "Air terlalu tinggi",
      "Suhu ideal",
      "Kelembapan stabil"
    ],
    answer: "Air rendah",
  },
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const quizProgressText = document.getElementById("quizProgressText");
const quizScoreText = document.getElementById("quizScoreText");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuizBtn = document.getElementById("restartQuizBtn");

function loadQuestion() {
  if (
    !quizProgressText ||
    !quizScoreText ||
    !quizProgressBar ||
    !quizQuestion ||
    !quizOptions ||
    !quizFeedback
  ) {
    return;
  }

  selectedAnswer = null;

  const data = quizData[currentQuestion];

  quizQuestion.textContent = data.question;
  quizOptions.innerHTML = "";
  quizFeedback.textContent = "Pilih salah satu jawaban.";
  quizFeedback.className = "text-secondary";

  quizProgressText.textContent = `Soal ${currentQuestion + 1} dari ${quizData.length}`;
  quizScoreText.textContent = `Skor: ${score}`;

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  quizProgressBar.style.width = `${progress}%`;

  data.options.forEach((option) => {
    const col = document.createElement("div");
    col.className = "col-md-6";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary w-100 rounded-pill py-3 quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      selectedAnswer = option;

      document.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline-primary");
      });

      button.classList.remove("btn-outline-primary");
      button.classList.add("btn-primary");

      if (option === data.answer) {
        quizFeedback.textContent = "Benar! Jawaban kamu tepat.";
        quizFeedback.className = "text-success fw-semibold";
      } else {
        quizFeedback.textContent = `Kurang tepat. Jawaban yang benar adalah ${data.answer}.`;
        quizFeedback.className = "text-danger fw-semibold";
      }
    });

    col.appendChild(button);
    quizOptions.appendChild(col);
  });
}

nextQuestionBtn?.addEventListener("click", () => {
  if (!quizFeedback || !quizQuestion || !quizOptions) {
    return;
  }

  if (!selectedAnswer) {
    quizFeedback.textContent = "Pilih jawaban terlebih dahulu.";
    quizFeedback.className = "text-warning fw-semibold";
    return;
  }

  if (selectedAnswer === quizData[currentQuestion].answer) {
    score += 20;
  }

  currentQuestion++;

  if (currentQuestion >= quizData.length) {
    quizQuestion.textContent = "Kuis selesai!";
    quizOptions.innerHTML = "";
    quizFeedback.innerHTML = `Skor akhir kamu adalah <strong>${score}</strong> dari 100.`;
    quizFeedback.className = "text-primary fw-semibold";

    quizProgressText.textContent = "Selesai";
    quizScoreText.textContent = `Skor: ${score}`;
    quizProgressBar.style.width = "100%";

    nextQuestionBtn.disabled = true;
    return;
  }

  loadQuestion();
});

restartQuizBtn?.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;

  if (nextQuestionBtn) {
    nextQuestionBtn.disabled = false;
  }

  loadQuestion();
});

loadQuestion();

/* =========================
   KALKULATOR KALOR
========================= */
const massInput = document.getElementById("massInput");
const specificHeatInput = document.getElementById("specificHeatInput");
const deltaTemperatureInput = document.getElementById("deltaTemperatureInput");
const materialPreset = document.getElementById("materialPreset");
const heatResult = document.getElementById("heatResult");

materialPreset?.addEventListener("change", function () {
  if (specificHeatInput) {
    specificHeatInput.value = materialPreset.value;
  }
});

function hitungKalor() {
  const massa = parseFloat(massInput?.value);
  const kalorJenis = parseFloat(specificHeatInput?.value);
  const deltaT = parseFloat(deltaTemperatureInput?.value);

  if (isNaN(massa) || isNaN(kalorJenis) || isNaN(deltaT)) {
    if (heatResult) {
      heatResult.textContent = "Mohon isi massa, kalor jenis, dan ΔT terlebih dahulu.";
      heatResult.className = "mt-3 fw-bold text-danger";
    }
    return;
  }

  if (massa <= 0 || kalorJenis <= 0) {
    if (heatResult) {
      heatResult.textContent = "Massa dan kalor jenis harus lebih dari 0.";
      heatResult.className = "mt-3 fw-bold text-danger";
    }
    return;
  }

  const Q = massa * kalorJenis * deltaT;

  if (heatResult) {
    heatResult.textContent =
      "Energi kalor = " + Q.toLocaleString("id-ID") + " Joule";
    heatResult.className = "mt-3 fw-bold text-primary";
  }
}

/* =========================
   KONVERSI SUHU REAL-TIME
========================= */
const temperatureInput = document.getElementById("temperatureInput");
const temperatureUnit = document.getElementById("temperatureUnit");

const celsiusResult = document.getElementById("celsiusResult");
const fahrenheitResult = document.getElementById("fahrenheitResult");
const reamurResult = document.getElementById("reamurResult");
const kelvinResult = document.getElementById("kelvinResult");

function konversiSuhu() {
  const nilaiSuhu = parseFloat(temperatureInput?.value);
  const satuanAsal = temperatureUnit?.value;

  if (isNaN(nilaiSuhu)) {
    if (celsiusResult) celsiusResult.textContent = "Celsius: -";
    if (fahrenheitResult) fahrenheitResult.textContent = "Fahrenheit: -";
    if (reamurResult) reamurResult.textContent = "Reamur: -";
    if (kelvinResult) kelvinResult.textContent = "Kelvin: -";
    return;
  }

  let celsius;

  if (satuanAsal === "celsius") {
    celsius = nilaiSuhu;
  } else if (satuanAsal === "fahrenheit") {
    celsius = (nilaiSuhu - 32) * 5 / 9;
  } else if (satuanAsal === "reamur") {
    celsius = nilaiSuhu * 5 / 4;
  } else if (satuanAsal === "kelvin") {
    celsius = nilaiSuhu - 273.15;
  } else {
    celsius = nilaiSuhu;
  }

  const fahrenheit = (celsius * 9 / 5) + 32;
  const reamur = celsius * 4 / 5;
  const kelvin = celsius + 273.15;

  celsiusResult.textContent = "Celsius: " + celsius.toFixed(2) + " °C";
  fahrenheitResult.textContent = "Fahrenheit: " + fahrenheit.toFixed(2) + " °F";
  reamurResult.textContent = "Reamur: " + reamur.toFixed(2) + " °R";
  kelvinResult.textContent = "Kelvin: " + kelvin.toFixed(2) + " K";
}

temperatureInput?.addEventListener("input", konversiSuhu);
temperatureUnit?.addEventListener("change", konversiSuhu);

/* =========================
   WOKWI SIMULATION AQUARIUM
   Sesuai kode ESP32:
   - suhu ideal: 24 - 28 C
   - tinggi air ideal: 2 - 10 cm
   - kelembapan ideal: 45 - 75 %
   - tinggi wadah default: 20 cm
   - batas keruh: 2500
========================= */
const wokwiSuhuInput = document.getElementById("wokwiSuhuInput");
const wokwiKelembabanInput = document.getElementById("wokwiKelembabanInput");
const wokwiJarakInput = document.getElementById("wokwiJarakInput");
const wokwiTinggiWadahInput = document.getElementById("wokwiTinggiWadahInput");
const wokwiKeruhInput = document.getElementById("wokwiKeruhInput");
const wokwiModeInput = document.getElementById("wokwiModeInput");

const hitungWokwiBtn = document.getElementById("hitungWokwiBtn");
const simulasiOtomatisBtn = document.getElementById("simulasiOtomatisBtn");
const stopSimulasiBtn = document.getElementById("stopSimulasiBtn");

const wokwiSuhuOutput = document.getElementById("wokwiSuhuOutput");
const wokwiStatusSuhuOutput = document.getElementById("wokwiStatusSuhuOutput");
const wokwiKelembabanOutput = document.getElementById("wokwiKelembabanOutput");
const wokwiStatusKelembabanOutput = document.getElementById("wokwiStatusKelembabanOutput");
const wokwiJarakOutput = document.getElementById("wokwiJarakOutput");
const wokwiTinggiAirOutput = document.getElementById("wokwiTinggiAirOutput");
const wokwiStatusAirOutput = document.getElementById("wokwiStatusAirOutput");
const wokwiKeruhOutput = document.getElementById("wokwiKeruhOutput");
const wokwiStatusKeruhOutput = document.getElementById("wokwiStatusKeruhOutput");
const wokwiRelayOutput = document.getElementById("wokwiRelayOutput");
const wokwiLedOutput = document.getElementById("wokwiLedOutput");
const wokwiBuzzerOutput = document.getElementById("wokwiBuzzerOutput");
const wokwiServoOutput = document.getElementById("wokwiServoOutput");
const wokwiModeOutput = document.getElementById("wokwiModeOutput");

const wokwiStatusOutput = document.getElementById("wokwiStatusOutput");
const wokwiActionOutput = document.getElementById("wokwiActionOutput");

let wokwiSimulationTimer = null;
let wokwiAutoStopTimer = null;

const BATAS_WAKTU_SIMULASI = 10000;

const SUHU_MIN_IDEAL = 24;
const SUHU_MAX_IDEAL = 28;

const TINGGI_AIR_MIN_IDEAL = 2;
const TINGGI_AIR_MAX_IDEAL = 10;

const KELEMBAPAN_MIN_IDEAL = 45;
const KELEMBAPAN_MAX_IDEAL = 75;

const TINGGI_WADAH_DEFAULT = 20;
const BATAS_KERUH = 2500;

function setElementText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function getInputNumber(input) {
  if (!input || input.value.trim() === "") {
    return NaN;
  }

  return Number(input.value.replace(",", "."));
}

function formatAngka(value, digit = 1) {
  if (Number.isNaN(value)) {
    return "-";
  }

  return value.toFixed(digit);
}

function setStatusClass(element, status) {
  if (!element) {
    return;
  }

  element.classList.remove("status-ideal", "status-warning", "status-bahaya");

  if (status === "IDEAL" || status === "STABIL" || status === "JERNIH") {
    element.classList.add("status-ideal");
  } else if (status === "DINGIN" || status === "PANAS" || status === "KERING" || status === "LEMBAP" || status === "RENDAH" || status === "TINGGI") {
    element.classList.add("status-warning");
  } else if (status === "KERUH" || status === "ERROR") {
    element.classList.add("status-bahaya");
  }
}

function hitungTinggiAir(tinggiWadahCm, jarakSensorCm) {
  if (Number.isNaN(jarakSensorCm)) {
    return NaN;
  }

  let tinggiAirCm = tinggiWadahCm - jarakSensorCm;

  if (tinggiAirCm < 0) {
    tinggiAirCm = 0;
  }

  if (tinggiAirCm > tinggiWadahCm) {
    tinggiAirCm = tinggiWadahCm;
  }

  return tinggiAirCm;
}

function getStatusSuhuAquarium(suhu) {
  if (Number.isNaN(suhu)) {
    return "ERROR";
  }

  if (suhu < SUHU_MIN_IDEAL) {
    return "DINGIN";
  }

  if (suhu > SUHU_MAX_IDEAL) {
    return "PANAS";
  }

  return "IDEAL";
}

function getStatusKelembapanAquarium(kelembapan) {
  if (Number.isNaN(kelembapan)) {
    return "ERROR";
  }

  if (kelembapan < KELEMBAPAN_MIN_IDEAL) {
    return "KERING";
  }

  if (kelembapan > KELEMBAPAN_MAX_IDEAL) {
    return "LEMBAP";
  }

  return "STABIL";
}

function getStatusAirAquarium(tinggiAir) {
  if (Number.isNaN(tinggiAir)) {
    return "ERROR";
  }

  if (tinggiAir < TINGGI_AIR_MIN_IDEAL) {
    return "RENDAH";
  }

  if (tinggiAir > TINGGI_AIR_MAX_IDEAL) {
    return "TINGGI";
  }

  return "IDEAL";
}

function getStatusKeruhAquarium(nilaiPot) {
  if (Number.isNaN(nilaiPot)) {
    return "ERROR";
  }

  if (nilaiPot >= BATAS_KERUH) {
    return "KERUH";
  }

  return "JERNIH";
}

function cekKondisiBahaya(statusSuhu, statusKelembapan, statusAir, statusKeruh) {
  if (statusSuhu === "DINGIN" || statusSuhu === "PANAS" || statusSuhu === "ERROR") {
    return true;
  }

  if (statusKelembapan === "KERING" || statusKelembapan === "LEMBAP" || statusKelembapan === "ERROR") {
    return true;
  }

  if (statusAir === "RENDAH" || statusAir === "TINGGI" || statusAir === "ERROR") {
    return true;
  }

  if (statusKeruh === "KERUH" || statusKeruh === "ERROR") {
    return true;
  }

  return false;
}

function tampilkanErrorWokwi(message) {
  if (wokwiStatusOutput) {
    wokwiStatusOutput.textContent = message;
    wokwiStatusOutput.className = "text-danger fw-semibold";
  }

  setElementText(wokwiActionOutput, "-");
}

function stopSimulasiWokwi(pesan, className = "text-secondary", action = "-") {
  clearInterval(wokwiSimulationTimer);
  clearTimeout(wokwiAutoStopTimer);

  wokwiSimulationTimer = null;
  wokwiAutoStopTimer = null;

  if (wokwiStatusOutput) {
    wokwiStatusOutput.textContent = pesan;
    wokwiStatusOutput.className = className;
  }

  setElementText(wokwiActionOutput, action);
}

function hitungSimulasiWokwi() {
  if (!wokwiSuhuInput) {
    return;
  }

  const suhu = getInputNumber(wokwiSuhuInput);
  const kelembapan = getInputNumber(wokwiKelembabanInput);
  const jarakSensorCm = getInputNumber(wokwiJarakInput);
  const tinggiWadahCm = getInputNumber(wokwiTinggiWadahInput);
  const nilaiKeruh = getInputNumber(wokwiKeruhInput);
  const mode = wokwiModeInput?.value || "otomatis";

  if (
    Number.isNaN(suhu) ||
    Number.isNaN(kelembapan) ||
    Number.isNaN(jarakSensorCm) ||
    Number.isNaN(tinggiWadahCm) ||
    Number.isNaN(nilaiKeruh)
  ) {
    tampilkanErrorWokwi(
      "Mohon isi suhu, kelembapan, jarak sensor, tinggi wadah, nilai kekeruhan, dan mode sistem."
    );
    return;
  }

  if (tinggiWadahCm <= 0) {
    tampilkanErrorWokwi("Tinggi wadah harus lebih dari 0 cm.");
    return;
  }

  const tinggiAirCm = hitungTinggiAir(tinggiWadahCm, jarakSensorCm);

  const statusSuhu = getStatusSuhuAquarium(suhu);
  const statusKelembapan = getStatusKelembapanAquarium(kelembapan);
  const statusAir = getStatusAirAquarium(tinggiAirCm);
  const statusKeruh = getStatusKeruhAquarium(nilaiKeruh);

  const kondisiBahaya = cekKondisiBahaya(
    statusSuhu,
    statusKelembapan,
    statusAir,
    statusKeruh
  );

  let relay = "OFF";
  let led = "OFF";
  let buzzer = "OFF";
  let servo = "0°";
  let action = "";

  if (mode === "otomatis") {
    if (statusAir === "RENDAH") {
      relay = "ON";
    } else {
      relay = "OFF";
    }

    if (kondisiBahaya) {
      led = "ON";
      buzzer = "ON";
    } else {
      led = "OFF";
      buzzer = "OFF";
    }

    servo = "90° / interval otomatis";
    action =
      "Mode otomatis aktif. Relay menyala jika air rendah. LED dan buzzer menyala jika ada kondisi tidak ideal.";
  } else {
    relay = "OFF";

    if (kondisiBahaya) {
      led = "ON";
      buzzer = "ON";
    } else {
      led = "OFF";
      buzzer = "OFF";
    }

    servo = "90° / interval manual";
    action =
      "Mode manual aktif. Relay mati, tetapi LED dan buzzer tetap aktif jika ada kondisi bahaya.";
  }

  setElementText(wokwiSuhuOutput, `${formatAngka(suhu, 1)} °C`);
  setElementText(wokwiStatusSuhuOutput, statusSuhu);
  setStatusClass(wokwiStatusSuhuOutput, statusSuhu);

  setElementText(wokwiKelembabanOutput, `${formatAngka(kelembapan, 0)} %`);
  setElementText(wokwiStatusKelembabanOutput, statusKelembapan);
  setStatusClass(wokwiStatusKelembabanOutput, statusKelembapan);

  setElementText(wokwiJarakOutput, `${formatAngka(jarakSensorCm, 1)} cm`);
  setElementText(wokwiTinggiAirOutput, `${formatAngka(tinggiAirCm, 1)} cm`);
  setElementText(wokwiStatusAirOutput, statusAir);
  setStatusClass(wokwiStatusAirOutput, statusAir);

  setElementText(wokwiKeruhOutput, nilaiKeruh.toLocaleString("id-ID"));
  setElementText(wokwiStatusKeruhOutput, statusKeruh);
  setStatusClass(wokwiStatusKeruhOutput, statusKeruh);

  setElementText(wokwiRelayOutput, relay);
  setElementText(wokwiLedOutput, led);
  setElementText(wokwiBuzzerOutput, buzzer);
  setElementText(wokwiServoOutput, servo);
  setElementText(wokwiModeOutput, mode.toUpperCase());

  if (wokwiStatusOutput) {
    if (kondisiBahaya) {
      wokwiStatusOutput.innerHTML =
        'Status: <span class="status-bahaya">PERLU PERHATIAN</span>';
      wokwiStatusOutput.className = "";
    } else {
      wokwiStatusOutput.innerHTML =
        'Status: <span class="status-ideal">SISTEM IDEAL</span>';
      wokwiStatusOutput.className = "";
    }
  }

  setElementText(
    wokwiActionOutput,
    `${action} Suhu: ${statusSuhu}, kelembapan: ${statusKelembapan}, air: ${statusAir}, kekeruhan: ${statusKeruh}.`
  );
}

function isiNilaiSimulasiOtomatis() {
  if (!wokwiSuhuInput) {
    return;
  }

  const suhuAcak = Math.random() * (32 - 20) + 20;
  const kelembapanAcak = Math.random() * (85 - 35) + 35;
  const tinggiWadah = TINGGI_WADAH_DEFAULT;
  const jarakAcak = Math.random() * (22 - 5) + 5;
  const keruhAcak = Math.floor(Math.random() * 4096);
  const modeAcak = Math.random() > 0.5 ? "otomatis" : "manual";

  wokwiSuhuInput.value = suhuAcak.toFixed(1);
  wokwiKelembabanInput.value = kelembapanAcak.toFixed(0);
  wokwiJarakInput.value = jarakAcak.toFixed(1);
  wokwiTinggiWadahInput.value = tinggiWadah;
  wokwiKeruhInput.value = keruhAcak;
  wokwiModeInput.value = modeAcak;

  hitungSimulasiWokwi();
}

hitungWokwiBtn?.addEventListener("click", () => {
  stopSimulasiWokwi("Simulasi otomatis dihentikan.");
  hitungSimulasiWokwi();
});

simulasiOtomatisBtn?.addEventListener("click", () => {
  clearInterval(wokwiSimulationTimer);
  clearTimeout(wokwiAutoStopTimer);

  isiNilaiSimulasiOtomatis();

  wokwiSimulationTimer = setInterval(() => {
    isiNilaiSimulasiOtomatis();
  }, 2000);

  wokwiAutoStopTimer = setTimeout(() => {
    stopSimulasiWokwi(
      "Simulasi otomatis selesai setelah 10 detik.",
      "text-secondary",
      "Simulasi berhenti karena sudah mencapai batas waktu."
    );
  }, BATAS_WAKTU_SIMULASI);
});

stopSimulasiBtn?.addEventListener("click", () => {
  stopSimulasiWokwi(
    "Simulasi otomatis dihentikan.",
    "text-secondary",
    "-"
  );
});

/* =========================
   ASAS BLACK
========================= */
function hitungAsasBlack() {
  const blackMassHot = document.getElementById("blackMassHot");
  const blackHeatHot = document.getElementById("blackHeatHot");
  const blackTempHot = document.getElementById("blackTempHot");

  const blackMassCold = document.getElementById("blackMassCold");
  const blackHeatCold = document.getElementById("blackHeatCold");
  const blackTempCold = document.getElementById("blackTempCold");

  const result = document.getElementById("blackResult");
  const explanation = document.getElementById("blackExplanation");

  if (
    !blackMassHot ||
    !blackHeatHot ||
    !blackTempHot ||
    !blackMassCold ||
    !blackHeatCold ||
    !blackTempCold ||
    !result ||
    !explanation
  ) {
    return;
  }

  const m1 = parseFloat(blackMassHot.value);
  const c1 = parseFloat(blackHeatHot.value);
  const t1 = parseFloat(blackTempHot.value);

  const m2 = parseFloat(blackMassCold.value);
  const c2 = parseFloat(blackHeatCold.value);
  const t2 = parseFloat(blackTempCold.value);

  if (
    isNaN(m1) || isNaN(c1) || isNaN(t1) ||
    isNaN(m2) || isNaN(c2) || isNaN(t2)
  ) {
    result.textContent = "-";
    explanation.textContent = "Lengkapi semua data terlebih dahulu.";
    explanation.className = "text-danger fw-semibold mb-0";
    return;
  }

  if (m1 <= 0 || c1 <= 0 || m2 <= 0 || c2 <= 0) {
    result.textContent = "-";
    explanation.textContent = "Massa dan kalor jenis harus lebih dari 0.";
    explanation.className = "text-danger fw-semibold mb-0";
    return;
  }

  const suhuCampuran =
    ((m1 * c1 * t1) + (m2 * c2 * t2)) /
    ((m1 * c1) + (m2 * c2));

  result.textContent = suhuCampuran.toFixed(2) + " °C";
  explanation.textContent =
    "Suhu campuran dihitung dari keseimbangan kalor antara benda panas dan benda dingin.";
  explanation.className = "text-secondary mb-0";
}

function resetAsasBlack() {
  const inputIds = [
    "blackMassHot",
    "blackHeatHot",
    "blackTempHot",
    "blackMassCold",
    "blackHeatCold",
    "blackTempCold"
  ];

  inputIds.forEach(function (id) {
    const input = document.getElementById(id);

    if (input) {
      input.value = "";
    }
  });

  const result = document.getElementById("blackResult");
  const explanation = document.getElementById("blackExplanation");

  if (result) {
    result.textContent = "-";
  }

  if (explanation) {
    explanation.textContent = "Masukkan data lalu klik tombol hitung.";
    explanation.className = "text-secondary mb-0";
  }
}

/* =========================
   PESAN / INBOX LOKAL
========================= */
const messageForm = document.getElementById("messageForm");
const senderName = document.getElementById("senderName");
const senderEmail = document.getElementById("senderEmail");
const messageSubject = document.getElementById("messageSubject");
const messageBody = document.getElementById("messageBody");
const inboxList = document.getElementById("inboxList");

const STORAGE_KEY = "monitoringAquariumMessages";

function ambilPesanLokal() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function simpanPesanLokal(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function renderPesan() {
  if (!inboxList) {
    return;
  }

  const messages = ambilPesanLokal();

  if (messages.length === 0) {
    inboxList.innerHTML = `
      <div class="inbox-item">
        <h4>Belum ada pesan</h4>
        <p class="mb-0">Pesan yang dikirim akan tampil di sini.</p>
      </div>
    `;
    return;
  }

  inboxList.innerHTML = "";

  messages.forEach((message, index) => {
    const item = document.createElement("div");
    item.className = "inbox-item";

    item.innerHTML = `
      <h4>${message.subject}</h4>
      <p><strong>${message.name}</strong> - ${message.email}</p>
      <p>${message.body}</p>
      <div class="inbox-meta">${message.time}</div>
      <button
        class="btn btn-sm btn-outline-danger rounded-pill mt-2"
        type="button"
        onclick="hapusPesan(${index})"
      >
        Hapus
      </button>
    `;

    inboxList.appendChild(item);
  });
}

messageForm?.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = senderName?.value.trim();
  const email = senderEmail?.value.trim();
  const subject = messageSubject?.value.trim();
  const body = messageBody?.value.trim();

  if (!name || !email || !subject || !body) {
    return;
  }

  const messages = ambilPesanLokal();

  messages.unshift({
    name,
    email,
    subject,
    body,
    time: new Date().toLocaleString("id-ID"),
  });

  simpanPesanLokal(messages);
  renderPesan();
  messageForm.reset();
});

function hapusPesan(index) {
  const messages = ambilPesanLokal();
  messages.splice(index, 1);
  simpanPesanLokal(messages);
  renderPesan();
}

function hapusSemuaPesan() {
  localStorage.removeItem(STORAGE_KEY);
  renderPesan();
}

renderPesan();
/* =========================
   AI TANYA JAWAB PEMBELAJARAN
   Versi aman tanpa API
   Lengkap sesuai materi dan gambar rangkaian
========================= */

function isiPertanyaanAI(pertanyaan) {
  const input = document.getElementById("aiQuestionInput");

  if (!input) return;

  input.value = pertanyaan;
  jawabPertanyaanAI();
}

function jawabPertanyaanAI() {
  const input = document.getElementById("aiQuestionInput");
  const output = document.getElementById("aiChatOutput");

  if (!input || !output) return;

  const pertanyaan = input.value.trim();

  if (pertanyaan === "") {
    tambahPesanAI("bot", "Silakan tulis pertanyaan terlebih dahulu.");
    return;
  }

  tambahPesanAI("user", pertanyaan);

  const jawaban = prosesJawabanPembelajaran(pertanyaan);

  setTimeout(function () {
    tambahPesanAI("bot", jawaban);
  }, 400);

  input.value = "";
}

function tambahPesanAI(tipe, pesan) {
  const output = document.getElementById("aiChatOutput");

  if (!output) return;

  const div = document.createElement("div");
  div.className = "ai-message " + tipe;
  div.textContent = pesan;

  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function prosesJawabanPembelajaran(pertanyaan) {
  const q = pertanyaan.toLowerCase();

  if (q.includes("rangkaian") || q.includes("gambar") || q.includes("komponen")) {
    return "Pada gambar rangkaian, sistem menggunakan ESP32 sebagai pusat kendali. Komponen yang terhubung meliputi sensor DHT22 untuk membaca suhu dan kelembapan, sensor HC-SR04 untuk mengukur jarak permukaan air, LCD I2C untuk menampilkan data, potentiometer sebagai simulasi sensor kekeruhan, LED sebagai indikator visual, buzzer sebagai alarm, servo sebagai penggerak pakan, relay sebagai pengendali pompa, serta resistor sebagai pembatas arus LED.";
  }

  if (q.includes("esp32") || q.includes("mikrokontroler") || q.includes("controller")) {
    return "ESP32 berfungsi sebagai otak utama sistem monitoring aquarium. Semua data dari sensor seperti DHT22, HC-SR04, dan potentiometer dibaca oleh ESP32. Setelah data diproses, ESP32 mengontrol output seperti LCD I2C, relay, LED, buzzer, dan servo sesuai kondisi aquarium.";
  }

  if (q.includes("dht22") || q.includes("sensor dht")) {
    return "DHT22 digunakan untuk membaca suhu dan kelembapan. Pada sistem aquarium, suhu dipantau agar ikan tropis tetap berada pada kondisi ideal, sedangkan kelembapan digunakan untuk mengetahui kondisi lingkungan sekitar aquarium.";
  }

  if (q.includes("suhu") || q.includes("temperatur")) {
    return "Suhu air sangat penting dalam aquarium ikan tropis. Pada sistem ini, suhu ideal berada pada rentang 24°C sampai 28°C. Jika suhu terlalu rendah, ikan dapat menjadi kurang aktif. Jika suhu terlalu tinggi, kadar oksigen dalam air dapat menurun dan ikan bisa mengalami stres. Data suhu dibaca melalui sensor DHT22 dan diproses oleh ESP32.";
  }

  if (q.includes("kelembapan") || q.includes("lembap") || q.includes("humidity")) {
    return "Kelembapan udara dipantau menggunakan sensor DHT22. Pada sistem ini, kelembapan stabil berada pada rentang 45% sampai 75%. Jika kelembapan terlalu rendah atau terlalu tinggi, sistem dapat memberi peringatan melalui LED dan buzzer.";
  }

  if (q.includes("hc-sr04") || q.includes("hcsr04") || q.includes("ultrasonik") || q.includes("ultrasonic")) {
    return "Sensor HC-SR04 digunakan untuk mengukur jarak antara sensor dan permukaan air. Dari jarak tersebut, sistem dapat menghitung tinggi air dengan rumus: tinggi air = tinggi wadah - jarak sensor. Jika tinggi air terlalu rendah, relay atau pompa dapat diaktifkan.";
  }

  if (q.includes("tinggi air") || q.includes("air rendah") || q.includes("jarak")) {
    return "Tinggi air dihitung dari selisih antara tinggi wadah dan jarak sensor HC-SR04 ke permukaan air. Jika air terlalu rendah, sistem dapat menyalakan relay atau pompa pada mode otomatis. Jika air terlalu tinggi atau tidak ideal, LED dan buzzer dapat aktif sebagai peringatan.";
  }

  if (q.includes("lcd") || q.includes("i2c") || q.includes("layar")) {
    return "LCD I2C digunakan untuk menampilkan informasi hasil pembacaan sensor, seperti suhu, kelembapan, tinggi air, kekeruhan, dan status sistem. Modul I2C membuat koneksi LCD lebih sederhana karena hanya membutuhkan jalur SDA dan SCL selain VCC dan GND.";
  }

  if (q.includes("potentiometer") || q.includes("potensio") || q.includes("keruh") || q.includes("kekeruhan")) {
    return "Potentiometer pada rangkaian digunakan sebagai simulasi sensor kekeruhan air. Nilai analog dari potentiometer dibaca oleh ESP32. Pada sistem ini, air dianggap keruh jika nilai mencapai 2500 atau lebih. Jika air keruh, LED dan buzzer dapat aktif sebagai tanda peringatan.";
  }

  if (q.includes("relay") || q.includes("pompa")) {
    return "Relay berfungsi sebagai saklar elektronik untuk mengontrol pompa. Pada mode otomatis, relay akan aktif ketika tinggi air berada di bawah batas aman. Dengan begitu, pompa dapat membantu menjaga ketinggian air aquarium agar tetap sesuai kebutuhan ikan tropis.";
  }

  if (q.includes("led") || q.includes("lampu")) {
    return "LED digunakan sebagai indikator visual. LED dapat menyala ketika sistem mendeteksi kondisi tidak normal, misalnya suhu terlalu panas, suhu terlalu dingin, air rendah, kelembapan tidak stabil, atau air keruh.";
  }

  if (q.includes("resistor") || q.includes("hambatan")) {
    return "Resistor digunakan untuk membatasi arus listrik yang masuk ke LED. Tanpa resistor, LED dapat menerima arus terlalu besar sehingga berisiko cepat rusak atau terbakar.";
  }

  if (q.includes("buzzer") || q.includes("alarm")) {
    return "Buzzer berfungsi sebagai alarm suara. Pada sistem monitoring aquarium, buzzer aktif ketika ESP32 mendeteksi kondisi bahaya atau tidak normal, seperti suhu tidak ideal, air terlalu rendah, kelembapan tidak stabil, atau air terlalu keruh.";
  }

  if (q.includes("servo") || q.includes("pakan")) {
    return "Servo digunakan sebagai penggerak mekanisme pemberian pakan ikan. Servo dapat bergerak dari posisi 0° ke 90° sesuai logika program. Dalam sistem aquarium, servo membantu mensimulasikan pemberian pakan otomatis.";
  }

  if (q.includes("vcc") || q.includes("gnd") || q.includes("ground") || q.includes("kabel merah") || q.includes("kabel hitam")) {
    return "VCC adalah jalur tegangan positif, sedangkan GND adalah jalur ground atau negatif. Umumnya kabel merah digunakan untuk VCC dan kabel hitam digunakan untuk GND. Koneksi VCC dan GND harus benar agar sensor, LCD, relay, buzzer, servo, dan komponen lain dapat bekerja dengan baik.";
  }

  if (q.includes("mode otomatis") || q.includes("otomatis")) {
    return "Mode otomatis berarti ESP32 mengambil keputusan sendiri berdasarkan data sensor. Contohnya, jika tinggi air rendah, relay dapat aktif untuk menyalakan pompa. Jika suhu, kelembapan, atau kekeruhan tidak normal, LED dan buzzer dapat menyala sebagai peringatan.";
  }

  if (q.includes("mode manual") || q.includes("manual")) {
    return "Mode manual berarti pengguna dapat mengatur atau mengontrol sistem secara langsung, tanpa semua keputusan dilakukan otomatis oleh ESP32. Mode ini berguna untuk pengujian atau saat pengguna ingin mengendalikan alat secara mandiri.";
  }

  if (q.includes("wokwi") || q.includes("simulasi")) {
    return "Simulasi Wokwi digunakan untuk menampilkan cara kerja sistem sebelum dibuat dalam bentuk alat nyata. Melalui simulasi, pengguna dapat memahami hubungan antara ESP32, sensor DHT22, HC-SR04, LCD I2C, potentiometer, relay, LED, buzzer, dan servo.";
  }

  if (q.includes("cara kerja") || q.includes("alur kerja") || q.includes("sistem bekerja")) {
    return "Cara kerja sistem dimulai dari sensor membaca kondisi aquarium. DHT22 membaca suhu dan kelembapan, HC-SR04 membaca jarak permukaan air, dan potentiometer mensimulasikan kekeruhan. Data dikirim ke ESP32, lalu ESP32 menampilkan hasil ke LCD dan mengontrol output seperti relay, LED, buzzer, serta servo sesuai kondisi yang terbaca.";
  }

  if (q.includes("bahaya") || q.includes("tidak normal") || q.includes("peringatan")) {
    return "Kondisi dianggap tidak normal jika suhu berada di luar 24°C sampai 28°C, kelembapan berada di luar 45% sampai 75%, tinggi air tidak berada pada rentang ideal 2 cm sampai 10 cm, atau air keruh dengan nilai 2500 ke atas. Jika kondisi tersebut terjadi, LED dan buzzer dapat aktif sebagai peringatan.";
  }

  if (q.includes("kalor")) {
    return "Kalor adalah energi panas yang berpindah karena perbedaan suhu. Pada website ini, konsep kalor dipelajari melalui kalkulator Q = m × c × ΔT. Rumus tersebut menjelaskan bahwa kalor dipengaruhi oleh massa benda, kalor jenis, dan perubahan suhu.";
  }

  if (q.includes("asas black") || q.includes("black")) {
    return "Asas Black menyatakan bahwa kalor yang dilepas oleh benda bersuhu tinggi sama dengan kalor yang diterima oleh benda bersuhu rendah, selama tidak ada kalor yang hilang ke lingkungan. Konsep ini membantu memahami proses pencampuran dua benda atau zat dengan suhu berbeda.";
  }

  if (q.includes("ikan tropis") || q.includes("aquarium") || q.includes("akuarium")) {
    return "Ikan tropis membutuhkan kondisi air yang stabil. Karena itu suhu, tinggi air, dan kekeruhan perlu dipantau. Pada sistem ini, suhu ideal berada pada 24°C sampai 28°C, kelembapan stabil 45% sampai 75%, tinggi air ideal 2 cm sampai 10 cm, dan air dianggap keruh jika nilai sensor mencapai 2500 atau lebih.";
  }

  return "Pertanyaanmu bagus. Pada media pembelajaran ini, kamu bisa bertanya tentang ESP32, DHT22, HC-SR04, LCD I2C, potentiometer kekeruhan, relay, LED, resistor, buzzer, servo, suhu air, kelembapan, tinggi air, kekeruhan, kalor, asas Black, atau simulasi Wokwi.";
}

const aiQuestionInput = document.getElementById("aiQuestionInput");

if (aiQuestionInput) {
  aiQuestionInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      jawabPertanyaanAI();
    }
  });
}
/* =========================
   GAME TEBAK KOMPONEN
========================= */

const dataGameKomponen = [
  {
    soal: "Komponen yang berfungsi sebagai otak utama sistem monitoring aquarium adalah...",
    jawaban: "ESP32",
    pilihan: ["DHT22", "ESP32", "Buzzer", "LED"],
    penjelasan: "ESP32 berfungsi sebagai mikrokontroler utama yang membaca sensor dan mengontrol aktuator."
  },
  {
    soal: "Sensor yang digunakan untuk membaca suhu dan kelembapan adalah...",
    jawaban: "DHT22",
    pilihan: ["DHT22", "Relay", "Servo", "LCD I2C"],
    penjelasan: "DHT22 digunakan untuk membaca suhu dan kelembapan lingkungan."
  },
  {
    soal: "Komponen yang digunakan untuk mengukur jarak permukaan air adalah...",
    jawaban: "HC-SR04",
    pilihan: ["LED", "HC-SR04", "Potentiometer", "Buzzer"],
    penjelasan: "HC-SR04 adalah sensor ultrasonik untuk mengukur jarak sensor ke permukaan air."
  },
  {
    soal: "Komponen yang menampilkan data suhu, kelembapan, tinggi air, dan status sistem adalah...",
    jawaban: "LCD I2C",
    pilihan: ["LCD I2C", "Relay", "Servo", "Resistor"],
    penjelasan: "LCD I2C digunakan untuk menampilkan informasi hasil pembacaan sensor."
  },
  {
    soal: "Komponen yang digunakan sebagai alarm suara ketika kondisi tidak normal adalah...",
    jawaban: "Buzzer",
    pilihan: ["Servo", "Buzzer", "DHT22", "LCD I2C"],
    penjelasan: "Buzzer berfungsi sebagai alarm suara saat sistem mendeteksi bahaya."
  },
  {
    soal: "Komponen yang berfungsi sebagai indikator visual ketika terjadi peringatan adalah...",
    jawaban: "LED",
    pilihan: ["Relay", "LED", "HC-SR04", "ESP32"],
    penjelasan: "LED digunakan sebagai indikator visual saat kondisi aquarium tidak normal."
  },
  {
    soal: "Komponen yang dapat mengontrol pompa air secara otomatis adalah...",
    jawaban: "Relay",
    pilihan: ["Relay", "Resistor", "Potentiometer", "LCD I2C"],
    penjelasan: "Relay berfungsi sebagai saklar elektronik untuk menghidupkan atau mematikan pompa."
  },
  {
    soal: "Komponen yang digunakan untuk membuka dan menutup mekanisme pemberian pakan adalah...",
    jawaban: "Servo",
    pilihan: ["Servo", "Buzzer", "DHT22", "LED"],
    penjelasan: "Servo dapat bergerak ke sudut tertentu untuk mensimulasikan pemberian pakan otomatis."
  },
  {
    soal: "Komponen yang digunakan sebagai simulasi sensor kekeruhan air adalah...",
    jawaban: "Potentiometer",
    pilihan: ["Potentiometer", "Relay", "LCD I2C", "Resistor"],
    penjelasan: "Potentiometer dapat menghasilkan nilai analog yang digunakan untuk mensimulasikan kekeruhan air."
  },
  {
    soal: "Komponen yang membatasi arus listrik agar LED tidak mudah rusak adalah...",
    jawaban: "Resistor",
    pilihan: ["Resistor", "Servo", "Relay", "DHT22"],
    penjelasan: "Resistor membatasi arus yang masuk ke LED agar LED tidak menerima arus berlebihan."
  }
];

let indeksGameKomponen = 0;
let skorGameKomponen = 0;
let gameKomponenAktif = false;

function mulaiGameKomponen() {
  indeksGameKomponen = 0;
  skorGameKomponen = 0;
  gameKomponenAktif = true;

  const skor = document.getElementById("componentGameScore");
  const feedback = document.getElementById("componentGameFeedback");

  if (skor) skor.textContent = skorGameKomponen;
  if (feedback) feedback.textContent = "Pilih jawaban yang paling tepat.";

  tampilkanSoalGameKomponen();
}

function tampilkanSoalGameKomponen() {
  const round = document.getElementById("componentGameRound");
  const question = document.getElementById("componentGameQuestion");
  const options = document.getElementById("componentGameOptions");
  const feedback = document.getElementById("componentGameFeedback");

  if (!round || !question || !options || !feedback) return;

  if (indeksGameKomponen >= dataGameKomponen.length) {
    question.textContent = "Game selesai!";
    round.textContent = "Hasil Akhir";
    options.innerHTML = "";
    feedback.textContent =
      "Skor akhir kamu: " + skorGameKomponen + " dari " + dataGameKomponen.length + ".";
    gameKomponenAktif = false;
    return;
  }

  const data = dataGameKomponen[indeksGameKomponen];

  round.textContent = "Soal Game " + (indeksGameKomponen + 1) + " dari " + dataGameKomponen.length;
  question.textContent = data.soal;
  feedback.textContent = "Pilih salah satu jawaban.";

  options.innerHTML = "";

  data.pilihan.forEach(function (pilihan) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = pilihan;
    button.onclick = function () {
      cekJawabanGameKomponen(pilihan, button);
    };

    options.appendChild(button);
  });
}

function cekJawabanGameKomponen(pilihan, tombol) {
  if (!gameKomponenAktif) return;

  const data = dataGameKomponen[indeksGameKomponen];
  const feedback = document.getElementById("componentGameFeedback");
  const skor = document.getElementById("componentGameScore");
  const semuaTombol = document.querySelectorAll("#componentGameOptions button");

  semuaTombol.forEach(function (btn) {
    btn.disabled = true;

    if (btn.textContent === data.jawaban) {
      btn.classList.add("correct");
    }
  });

  if (pilihan === data.jawaban) {
    skorGameKomponen++;
    tombol.classList.add("correct");

    if (feedback) {
      feedback.textContent = "Benar! " + data.penjelasan;
    }
  } else {
    tombol.classList.add("wrong");

    if (feedback) {
      feedback.textContent = "Kurang tepat. Jawaban yang benar adalah " + data.jawaban + ". " + data.penjelasan;
    }
  }

  if (skor) skor.textContent = skorGameKomponen;

  setTimeout(function () {
    indeksGameKomponen++;
    tampilkanSoalGameKomponen();
  }, 1800);
}

function resetGameKomponen() {
  indeksGameKomponen = 0;
  skorGameKomponen = 0;
  gameKomponenAktif = false;

  const round = document.getElementById("componentGameRound");
  const question = document.getElementById("componentGameQuestion");
  const options = document.getElementById("componentGameOptions");
  const feedback = document.getElementById("componentGameFeedback");
  const skor = document.getElementById("componentGameScore");

  if (round) round.textContent = "Soal Game 1";
  if (question) question.textContent = "Klik mulai untuk menampilkan soal permainan.";
  if (options) options.innerHTML = "";
  if (feedback) feedback.textContent = "Tekan tombol mulai untuk bermain.";
  if (skor) skor.textContent = "0";
}
