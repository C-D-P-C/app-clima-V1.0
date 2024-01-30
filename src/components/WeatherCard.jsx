import React, { useRef, useState } from "react";
import "./styles/weatherCard.css";

const WeatherCard = ({
  weather,
  temp,
  setTextInput,
  error,
  currentLanguage,
  changeLanguage,
}) => {
  const [isCelsius, setIsCelsius] = useState(true);

  const handleChange = () => {
    setIsCelsius(!isCelsius);
  };

  const city = useRef();

  const handleForm = (event) => {
    event.preventDefault();
    setTextInput(city.current.value.toLowerCase().trim());
  };

  const handleReturnToTop = () => {
    window.location.reload();
  };

  return (
    <section className="weather">
      <h1 className="weather__title">
        {currentLanguage === "en"
          ? "Weather App"
          : currentLanguage === "fr"
          ? "Application météo"
          : "Aplicación del clima"}
      </h1>
      <form onSubmit={handleForm} className="weather__form">
        <input type="text" ref={city} />
        <button>
          {currentLanguage === "en"
            ? "Search"
            : currentLanguage === "fr"
            ? "Rechercher"
            : "Buscar"}
        </button>
      </form>
      {error && (
        <>
          <p style={{ color: "red" }}>{error}</p>
          <button className="return-button" onClick={handleReturnToTop}>
            {currentLanguage === "en"
              ? "Home"
              : currentLanguage === "fr"
              ? "Accueil"
              : "Inicio"}
          </button>
        </>
      )}
      {weather && !error && (
        <>
          <h2 className="weather__city">
            {weather?.name}, {weather?.sys.country}
          </h2>
          <article className="weather__container1">
            <figure className="weather__fig">
              <img
                className="weather__img"
                src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </figure>
            <div>
              <h3 className="weather__clouds">
                {weather?.weather[0].description}
              </h3>
              <ul className="weather__info">
                <li>
                  <span>
                    {currentLanguage === "en"
                      ? "Wind speed:"
                      : currentLanguage === "fr"
                      ? "Vitesse du vent :"
                      : "Velocidad del viento:"}{" "}
                  </span>
                  <span>{weather?.wind.speed} "m/s"</span>
                </li>
                <li>
                  <span>
                    {currentLanguage === "en"
                      ? "Clouds:"
                      : currentLanguage === "fr"
                      ? "Nuages :"
                      : "Nubes :"}{" "}
                  </span>
                  <span>{weather?.clouds.all} %</span>
                </li>
                <li>
                  <span>
                    {currentLanguage === "en"
                      ? "Pressure:"
                      : currentLanguage === "fr"
                      ? "Pression :"
                      : "Presión :"}{" "}
                  </span>
                  <span>{weather?.main.pressure} hPa</span>
                </li>
                <li>
                  <span>
                    {currentLanguage === "en"
                      ? "Humidity:"
                      : currentLanguage === "fr"
                      ? "Humidité :"
                      : "Humedad :"}{" "}
                  </span>
                  <span>{weather?.main.humidity} %</span>
                </li>
              </ul>
            </div>
          </article>
          <div className="weather__conteiner2">
            <h3 className="weather__temp">
              {isCelsius ? temp?.celsius + "°C" : temp?.fahrenheit + "°F"}
            </h3>
            <button className="weather__btn" onClick={handleChange}>
              {currentLanguage === "en"
                ? `Change to ${isCelsius ? "°F" : "°C"}`
                : currentLanguage === "fr"
                ? `Changer en ${isCelsius ? "°F" : "°C"}`
                : `Cambiar a ${isCelsius ? "°F" : "°C"}`}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default WeatherCard;
