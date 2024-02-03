import { useState, useEffect } from 'react';
import axios from 'axios';


const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_SOME_KEY
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`

    axios
      .get(apiUrl)
      .then(response => {
        setWeather(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setWeather(null);
      });
    }, [capital]);

    if (!weather) {
      return <div>No weather data available</div>;
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <div>temperature {weather.main.temp} Celsius</div>
        <img src={iconUrl} alt="Weather icon"></img>
        <div>wind {weather.wind.speed} m/s</div>
      </div>
    )
}

const Countries = ({ countries, handleClick }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length === 1) {
    return <Countryinfo country={countries[0].name.common}/>
  }
  return (
    <ul>
      {countries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleClick(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

const Countryinfo = ({ country }) => {
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/name/${country}`)
      .then(response => {
        const data = response.data[0];
        setCountryData(data);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
        setCountryData(null);
      });
  }, [country]);

  if (!countryData) {
    return <div>Loading...</div>;
  }

  const languagesArray = Object.values(countryData.languages)

  return (
    <div>
      <h2>{countryData.name.common}</h2>
      <div>capital {countryData.capital}</div>
      <div>area {countryData.area}</div>
      <br />
      <div>
        <b>languages:</b>
        <ul>
          {languagesArray.map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
      </div>
      <div>
        <span style={{ fontSize: '8em' }}>{countryData.flag}</span>
      </div>
      <Weather capital={countryData.capital} />
    </div>
  )
}

const App = () => {
  const [countryToSearch, setCountryToSearch] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (countryToSearch.trim() === '') {
      setCountries([]);
      return;
    }

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const filteredCountries = response.data.filter(country => {
          const commonName = country.name.common || '';
          const searchTerm = countryToSearch.toLowerCase();

          return commonName.toLowerCase().includes(searchTerm)
        });

        setCountries(filteredCountries);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setCountries([]);
      });
  }, [countryToSearch]);

  const handleCountryChange = (event) => {
    setCountryToSearch(event.target.value);
  }

  const handleClick = (country) => {
    setCountries([country])
  }

  return (
    <div>
        find countries <input value={countryToSearch} onChange={handleCountryChange} />
        <Countries countries={countries} handleClick={handleClick}/>
    </div>
  )
}

export default App;
