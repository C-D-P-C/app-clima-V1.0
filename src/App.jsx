import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const APIkey = "1315d05e4ca0bedab2dadb99152f4b10";

const translations = {
  en: {
    search: "Search",
    loading: "Loading...",
    errorFetchingWeather: "Error fetching weather data",
    cityNotFoundError: "City not found. Please check the city name.",
    language: "Language",
  },
  fr: {
    search: "Rechercher",
    loading: "Chargement...",
    errorFetchingWeather:
      "Erreur lors de la récupération des données météorologiques",
    cityNotFoundError:
      "Aucune donnée trouvée pour la ville. Veuillez vérifier le nom de la ville.",
    language: "Langue",
  },
  es: {
    search: "Buscar",
    loading: "Cargando...",
    errorFetchingWeather: "Error al obtener datos meteorológicos",
    cityNotFoundError:
      "No se encontraron datos para la ciudad. Por favor, verifica el nombre de la ciudad.",
    language: "Idioma",
  },
};

const backgrounds = {
  soleado: "url(https://th.bing.com/th/id/OIG1.OCYkpqkOWkkCZqdPFnCQ?pid=ImgGn)",
  nublado: "url(https://th.bing.com/th/id/OIG4.evh8q6a3MFd3qT7XENTN?pid=ImgGn)",
  ventoso:
    "url(https://th.bing.com/th/id/OIG1.reazRgO3qlE1xhl6EUzT?w=1024&h=1024&rs=1&pid=ImgDetMain)",
  caluroso:
    "url(https://th.bing.com/th/id/OIG1.2zf12VlInf3QxgaUIP7H?pid=ImgGn)",
  frio: "url(https://th.bing.com/th/id/OIG2.oqUkiqpZZcx2HDhsab8t?w=1024&h=1024&rs=1&pid=ImgDetMain)",
};

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [finder, setFinder] = useState();
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const success = (position) => {
    const obj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    setCoords(obj);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  useEffect(() => {
    if (coords) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}&lang=${currentLanguage}`;
      axios
        .get(url)
        .then((res) => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(
              2
            ),
          };
          setTemp(obj);
          setWeather(res.data);
        })
        .catch((err) => {
          setError(translations[currentLanguage].errorFetchingWeather);
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords, currentLanguage]);

  useEffect(() => {
    if (textInput) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${textInput}&appid=${APIkey}&lang=${currentLanguage}`;
      axios
        .get(url)
        .then((res) => {
          const obj = {
            celsius: (res.data.main.temp - 273.15).toFixed(2),
            fahrenheit: ((res.data.main.temp - 273.15) * (9 / 5) + 32).toFixed(
              2
            ),
          };
          setTemp(obj);
          setFinder(res.data);
        })
        .catch((err) => {
          setError(translations[currentLanguage].cityNotFoundError);
          console.error(err);
        });
    }
  }, [textInput, currentLanguage]);

  const obtenerFondoSegunClima = () => {
    const condicionesClimaticas = textInput ? finder : weather;

    if (
      !condicionesClimaticas ||
      !condicionesClimaticas.main ||
      !condicionesClimaticas.clouds
    ) {
      return backgrounds.soleado;
    }

    const temperatura = condicionesClimaticas.main.temp;
    const nubes = condicionesClimaticas.clouds.all;
    const velocidadViento = condicionesClimaticas.wind.speed;

    if (temperatura > 25 && nubes < 50) {
      return backgrounds.caluroso;
    } else if (nubes > 70) {
      return backgrounds.nublado;
    } else if (temperatura < 10) {
      return backgrounds.frio;
    } else if (velocidadViento > 5) {
      return backgrounds.ventoso;
    } else {
      return backgrounds.soleado;
    }
  };

  const changeLanguage = () => {
    const languages = ["en", "fr", "es"];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  return (
    <div className="app" style={{ backgroundImage: obtenerFondoSegunClima() }}>
      <div className="language-menu">
        <button className="language-button" onClick={changeLanguage}>
          {translations[currentLanguage].language}:{" "}
          {currentLanguage.toUpperCase()}
        </button>
      </div>
      {isLoading ? (
        <h2 className="loader">{translations[currentLanguage].loading}</h2>
      ) : (
        <WeatherCard
          weather={textInput ? finder : weather}
          temp={temp}
          setTextInput={setTextInput}
          error={error}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
}

export default App;
