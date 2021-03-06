/* eslint-disable no-undef */
/* eslint-disable no-console */
'use strict';

const apiKey = '2935326c022f87e31d30aa76733c8985';
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather';
const yelpURL = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search';

function formatQueryParams(params){
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function weatherResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  $('#js-error-message').empty();

  for (let i = 0; i < responseJson.weather.length; i++){
    let imgSrc = `http://openweathermap.org/img/w/${responseJson.weather[i].icon}.png`;

    console.log(imgSrc);
    $('#results-list').append(

      `<li>
        <img src=${imgSrc} />        
        <h1 class="list-items">${Math.floor(responseJson.main.temp)} &#8457;</h1>
        <p class="weather">${responseJson.weather[i].main}</p>
       </li>`
    );};
  $('#results').removeClass('hidden');
};

function yelpResults(responseJson) {
  console.log(JSON.stringify(responseJson.businesses[0], null, 4));
  $('#yelp-results-list').empty();

  for (let i = 0; i < responseJson.businesses.length; i++){

    $('#yelp-results-list').append(

      `<li>
         <h3>${responseJson.businesses[i].name}</h3>
         <p>Type: ${responseJson.businesses[i].categories[0].title}</p>
         <p>Yelp Rating: ${responseJson.businesses[i].rating} out of 5</p>
         <p>Price: ${responseJson.businesses[i].price}</p>
         <a target="_blank" href=${responseJson.businesses[i].url}>For details click here.</a>
       </li>`
    );};
  $('#yelp-results').removeClass('hidden');
};

function weatherData(input) {
  var params = {
    q: `${input}`,
    zip: `${input}`,
    units: 'imperial',
    appid: apiKey,
  };
  const queryString = formatQueryParams(params);
  const url = weatherURL + '?' + queryString;

  console.log('url');

  fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      weatherResults(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went horribly wrong: ${err.message}`);
    });
}

function yelpData(input) {
  var params = {
    location: `${input}`,
  };
  const queryString = formatQueryParams(params);
  const url2 = yelpURL + '?' + queryString;

  console.log(url2);

  fetch(url2, {
    headers: {
      'Authorization': 'Bearer t790uoLTc07ASD2svsCZk24JTHJgT2u6zYCqCcCV5IxZiFTtrm9QNQBs3ZdGl4bXaXq5fVoKXuBrxz9YSAFNxHhHDZFjaS7bAeDzM4x_2jaSDR-BuGhKpOkNOWETXnYx',
    },
  })
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => yelpResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went horribly wrong: ${err.message}`);
    });
}

function watchForm() {
  $('#js-form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const zipcode = $('#js-zipcode').val();
    weatherData(searchTerm, zipcode);
    yelpData(searchTerm);
  });
}

$(watchForm);

