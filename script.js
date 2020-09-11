'use strict';

const apiKey = "YRYtdbJtVucbWg683N3hnbygIUZKyn8fdqFcNkiB";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    const address = responseJson.data[i].addresses.find(address => address.type == "Physical")
    let addressHTML;
    if (address) {
      addressHTML = `
      <p>${address.line1}</p>
      <p>${address.line2}</p>
      <p>${address.line3}</p>
      <p>${address.city}, ${address.stateCode} ${address.postalCode}</p>
      `
    }
    $('#results-list').append(`
    <li><h3>${responseJson.data[i].fullName}</h3>
    <p>${responseJson.data[i].description}</p>
    <h4>Address:</h4>

    <p>${responseJson.data[i].fullName}</p>
    ${addressHTML}
    
    <br><a href = '${responseJson.data[i].url}'>Click here for more information on ${responseJson.data[i].fullName}</a>
    </li>
    `)};
    $('#results').removeClass('hidden');
  }


function getParks(searchArea, maxResults = 10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: searchArea
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchArea = $('#js-search-area').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchArea, maxResults);
  });
}

$(watchForm);
