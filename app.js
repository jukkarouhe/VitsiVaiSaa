const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const clearBtn = document.getElementById('clearBtn');
const jokeOutput = document.getElementById('jokeOutput');
const weatherOutput = document.getElementById('weatherOutput');

const FALLBACK_JOKES = [
  'Miksi tietokone meni nukkumaan? Koska se oli käynyt liian pitkään ilman latausta.',
  'Miksi ohjelmoija ei koskaan luota sateeseen? Koska se on aina pilvessä.',
  'Tietokone sanoi: "Minulla on vähän ongelmia." – Se tarkoitti, että sillä on 42 ongelmaa.'
];

const WEATHER_CODE_LABELS = {
  0: 'selkeä',
  1: 'enimmäkseen selkeä',
  2: 'osittain pilvinen',
  3: 'pilvinen',
  45: 'usvainen',
  48: 'sumuinen',
  51: 'heikkoa tihkua',
  53: 'kohtalaista tihkua',
  55: 'vahvaa tihkua',
  61: 'heikkoa sadetta',
  63: 'sadetta',
  65: 'rankkaa sadetta',
  71: 'heikkoa lunta',
  73: 'lunta',
  75: 'rankkaa lunta',
  80: 'kohtauksittaisia sadekuuroja',
  81: 'sadekuuroja',
  82: 'voimakkaita sadekuuroja',
  85: 'lumikuuroja',
  86: 'voimakkaita lumikuuroja',
  95: 'ukkosta',
  96: 'ukkosta ja rakeita',
  99: 'ukkosta ja voimakkaita rakeita'
};

function setStatus(target, text) {
  target.textContent = text;
}

async function fetchShortJoke() {
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
    if (!response.ok) throw new Error('Joke API request failed');
    const data = await response.json();

    if (data.type === 'single' && data.joke) return data.joke;
    if (data.type === 'twopart' && data.setup && data.delivery) return `${data.setup} ${data.delivery}`;
  } catch (error) {
    console.warn('Joke fetch failed, using fallback joke.', error);
  }

  return FALLBACK_JOKES[Math.floor(Math.random() * FALLBACK_JOKES.length)];
}

async function fetchWeatherSummary() {
  const latitude = 61.6886;
  const longitude = 27.2723;

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Europe%2FHelsinki&forecast_days=1`);
    if (!response.ok) throw new Error('Weather API request failed');
    const data = await response.json();
    const current = data.current;
    const temp = Math.round(current.temperature_2m);
    const weatherLabel = WEATHER_CODE_LABELS[current.weather_code] || 'tuttu sää';

    return `Mikkelissä on nyt noin ${temp} °C ja sää on ${weatherLabel}. Tämä on lyhyt päiväkohtainen tiivistelmä nykyisestä säästä.`;
  } catch (error) {
    console.warn('Weather fetch failed, using fallback summary.', error);
    return 'Sääpalvelu ei vastannut juuri nyt, mutta Mikkelissä on päivän mittaan tyypillisesti vaihtelevaa säätä.';
  }
}

jokeBtn.addEventListener('click', async () => {
  setStatus(jokeOutput, 'Haetaan vitsiä...');
  const joke = await fetchShortJoke();
  setStatus(jokeOutput, joke);
});

weatherBtn.addEventListener('click', async () => {
  setStatus(weatherOutput, 'Haetaan säätietoja...');
  const summary = await fetchWeatherSummary();
  setStatus(weatherOutput, summary);
});

clearBtn.addEventListener('click', () => {
  setStatus(jokeOutput, 'Paina nappia nähdäksesi päivän vitsin.');
  setStatus(weatherOutput, 'Paina nappia nähdäksesi päivän säätiivistelmän.');
});
