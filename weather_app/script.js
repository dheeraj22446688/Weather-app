const city=document.querySelector("#city")
const search=document.querySelector("#search")
const cityName = document.querySelector("#city-name");
const condition = document.querySelector("#condition");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
search.addEventListener("click",async function(){
    const cityValue=city.value.trim();
    if(cityValue==""){
        condition.innerText=`please enter a city name!`;
        return;
    }
    condition.innerText=`Searching.....`;
    try{
        const response=await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityValue)}&count=1&language=en&format=json`
        );
        const data=await response.json();
        if(!data.results){
            condition.innerText="City not found!";
            return;
        }
        const latitude=data.results[0].latitude;
        const longitude=data.results[0].longitude;
        cityName.innerText=data.results[0].name;
        const weatherResponse=await fetch(
             `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`
        );
        if(!weatherResponse.ok){
            throw new Error("Weather could not be fetched")
        }
        const weatherData= await weatherResponse.json();
        const current=weatherData.current;
        temperature.innerText=`${current.temperature_2m}°C`
        humidity.innerText=`${current.relative_humidity_2m}%`
        wind.innerText=`${current.wind_speed_10m} km/h`
        condition.innerText=`Feels like ${current.apparent_temperature} °C`
    }catch(error){
        condition.innerText=`Something went wrong!`;
        console.log(error);
    }
})