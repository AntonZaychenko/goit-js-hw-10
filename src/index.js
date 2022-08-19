import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {searchCountries} from '../src/js/fetchCountries'



const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(inputResult, DEBOUNCE_DELAY));

 

function inputResult(e) {
    const inputText = e.target.value.trim();
    if(!inputText) {
        clearDiv()
        return
    }
    let promise = searchCountries(inputText);
   
    promise.then((countries) => {
    
        clearDiv()
        if(countries.length === 1) {
            let html = createCountryInfo(countries) 
            countryInfo.innerHTML = html
            
        } else if(countries.length <= 10) {

            let htmlList = createCountryList(countries)
            countryList.innerHTML = htmlList

        } else if (countries.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.')
        } 
    }, (error) => {
        clearDiv()
        
        Notify.failure('Oops, there is no country with that name')
        
    });
    return inputText;
}

function clearDiv() {
    countryInfo.innerHTML = " ";
    countryList.innerHTML = " ";
}

const createCountryInfo = data => {
    return data.map(({name,capital,population,flags,languages}) => 
    `<h1><img src="${flags.png}" alt="${name.official}" width="40"> ${name.official}</h1>
    <p>capital: ${capital}</p>
    <p>population: ${population}</p>
    <p>languages: ${Object.values(languages).join(', ')}</p>`)
};


const createCountryList = data => {
   
    return data.map(({name, flags}) => 
  
    `<li><img src="${flags.png}" alt="${name.official}" width="20"> ${name.official}</li>`
    ).join('')
}
countryList.style.cssText = `list-style: none;`;
