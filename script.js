'use strict';

// const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = '') {
  const html = `
          <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
              <h3 class="country__name">${data.name}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
              <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
              <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
          </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

/******** ASYNC/ AWAIT *********/

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=JSON`);
    const dataGeo = await resGeo.json();
    if (dataGeo.distance === 'Throttled! See geocode.xyz/pricing') throw new Error(`Throttled! Problem getting location data`);

    const res = await fetch(`https://restcountries.com/v2/name/${dataGeo.country}`);
    if (!res.ok) throw new Error(`Problem getting country data`);

    const data = await res.json();
    renderCountry(data[0]);
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    renderError(`Somthing went wrong: ${err.message}`);

    // reject promise returned from async function
    throw err;
  }

  // fetch(`https://restcountries.com/v2/name/${country}`).then(res => console.log(res));
};

/****** promise: then(), catch(), finally() ******/
// even there is an error in async function, the promise that async function returns is still fulfilled and not rejected!!!!
// fix: re-throw error in catch
// console.log('1: Will get location');
// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err}`))
//   .finally(() => console.log('3: Fininshed getting location'));

/***** async/ await ******/
(async function () {
  console.log('1: Will get location');
  try {
    const city = await whereAmI();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`2: ${err}`);
  }
  console.log('3: Fininshed getting location');
})();
