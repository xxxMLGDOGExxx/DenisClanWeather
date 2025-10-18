const apiKey = 'f3972689290a4991bb7214524251710';
const video = document.getElementById('bg-video');
const audio = document.getElementById('bg-audio');
const trackName = document.getElementById('track-name');
const toast = document.getElementById('music-toast');
const warning = document.getElementById('autoplay-warning');
const infoPanel = document.getElementById('autoplay-info');
const motivationText = document.getElementById('motivation-text');
let lastCondition = null;
let cachedLocation = null;

const motivationalQuotes = [
  "You’ve got this. One step at a time.",
  "Progress is progress, no matter how small.",
  "Your effort today plants tomorrow’s success.",
  "Every morning is a fresh start! make it count.",
  "Remember: You matter! Always remember that :).",
  "Message from Denis: You're awesome! :)",
];

function loadMotivation() {
  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  motivationText.textContent = quote;
}

document.addEventListener('DOMContentLoaded', () => {
  loadMotivation();
  fetchAndUpdateWeather();
  setInterval(fetchAndUpdateWeather, 60000);

 // document.getElementById('weather-select').addEventListener('change', e => {
//   const type = e.target.value;
//   if (!type) return;

//   const conditionMap = {
//     sun: 'Sunny',
//     cloudy: 'Cloudy',
//     rain: 'Light rain',
//     snow: 'Snow showers',
//     storm: 'Thunderstorm'
//   };

//   const simulatedData = {
//     location: { name: 'Manual Override' },
//     current: {
//       condition: { text: conditionMap[type] || 'Cloudy' },
//       temp_c: 'N/A'
//     }
//   };

//   lastCondition = conditionMap[type].toLowerCase();
//   applyWeatherData(simulatedData);
// });


  document.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(err => console.warn('Audio play blocked:', err));
    }
  }, { once: true });

  document.getElementById('why-button').addEventListener('click', () => {
    infoPanel.style.display = 'flex';
  });

  document.getElementById('close-info').addEventListener('click', () => {
    const box = document.querySelector('#autoplay-info .info-box');
    box.style.animation = 'popOut 0.3s ease forwards';

    setTimeout(() => {
      infoPanel.style.display = 'none';
      box.style.animation = 'popIn 0.4s ease forwards';
    }, 300);
  });

  function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    document.getElementById('date').textContent = now.toLocaleDateString(undefined, dateOptions);
    document.getElementById('time').textContent = now.toLocaleTimeString(undefined, timeOptions);
  }

  setInterval(updateDateTime, 1000);
  updateDateTime();
});

function fetchAndUpdateWeather() {
  if (cachedLocation) {
    fetchWeatherAt(cachedLocation.latitude, cachedLocation.longitude);
  } else {
    navigator.geolocation.getCurrentPosition(position => {
      cachedLocation = position.coords;
      fetchWeatherAt(cachedLocation.latitude, cachedLocation.longitude);
    });
  }
}

function fetchWeatherAt(latitude, longitude) {
  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`)
    .then(res => res.json())
    .then(data => {
      const newCondition = data.current.condition.text.toLowerCase();
      if (newCondition !== lastCondition) {
        lastCondition = newCondition;
        applyWeatherData(data);
      }
    })
    .catch(err => {
      console.error('Weather refresh error:', err);
    });
}

function applyWeatherData(data) {
  const condition = data.current.condition.text.toLowerCase();
  document.getElementById('location').textContent = data.location.name;
  document.getElementById('description').textContent = `${getWeatherEmoji(data.current.condition.text)} ${data.current.condition.text}`;
  document.getElementById('temperature').textContent = `${data.current.temp_c}°C`;

  const mediaType = getMediaType(condition);
  setMedia(mediaType);
}

function getWeatherEmoji(conditionText) {
  const c = conditionText.toLowerCase();
  if (c.includes('sunny') || c.includes('clear')) return '☀️';
  if (c.includes('partly cloudy')) return '⛅';
  if (c.includes('cloudy') || c.includes('overcast')) return '☁️';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return '❄️';
  if (c.includes('thunder') || c.includes('storm') || c.includes('lightning')) return '⛈️';
  if (c.includes('tornado')) return '🌪️';
  if (c.includes('wind') || c.includes('breeze')) return '💨';
  if (c.includes('ice pellets') || c.includes('freezing rain')) return '🧊';
  if (c.includes('smoke')) return '🚬';
  if (c.includes('sand') || c.includes('dust')) return '🌬️';
  if (c.includes('hot')) return '🔥';
  if (c.includes('cold')) return '🥶';
  return '🌈';
}

function getMediaType(condition) {
  const c = condition.toLowerCase();
  if (c.includes('sunny') || c.includes('clear')) return 'sun';
  if (c.includes('cloud') || c.includes('overcast') || c.includes('haze') || c.includes('mist')) return 'cloudy';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rain';
  if (c.includes('snow') || c.includes('sleet') || c.includes('freezing') || c.includes('blizzard') || c.includes('ice pellets')) return 'snow';
  if (c.includes('thunder') || c.includes('storm') || c.includes('tornado') || c.includes('squall')) return 'storm';
  return 'cloudy';
}

function setMedia(type) {
  video.src = `media/${type}.mp4`;
  audio.src = `media/${type}.mp3`;

  audio.play().catch(err => console.warn('Audio play blocked:', err));

  // Custom track names based on weather
  let track = 'Atmospheric Soundtrack';
  if (type === 'rain') {
    track = 'Relaxed Scene – James Clarke';
  } else if (type === 'cloudy') {
    track = 'Hello Neighbor Menu Theme';
  } else if (type === 'storm') {
    track = 'Dido – Thank You';
  } else if (type === 'sun') {
    track = 'Mii Maker Theme';
  }

  showMusicToast(track);
}

function showMusicToast(name) {
  trackName.textContent = `Now Playing: ${name}`;
  toast.classList.add('show');

  clearTimeout(toast.hideTimeout);
  toast.hideTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);

  // Show warning only if music hasn't started after 2.5s
  setTimeout(() => {
    if (audio.paused) {
      warning.classList.add('show');

      const onPlay = () => {
        setTimeout(() => {
          warning.classList.remove('show');
        }, 3000); // wait 3 seconds after music starts
        audio.removeEventListener('play', onPlay);
      };

      audio.addEventListener('play', onPlay);
    }
  }, 2500);
}
