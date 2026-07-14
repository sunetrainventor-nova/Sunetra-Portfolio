const apiKey = "e9c7f572ac6852493247fc168e15b88b";


const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const feels = document.getElementById("feels");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const clouds = document.getElementById("clouds");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const weatherIcon = document.getElementById("weatherIcon");

const forecast = document.getElementById("forecast");

const loader = document.getElementById("loader");

const modeBtn = document.getElementById("modeBtn");





searchBtn.addEventListener("click",()=>{

    let city = cityInput.value.trim();

    if(city===""){
        return;
    }

    getWeather(city);

});





cityInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});





modeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){

        modeBtn.textContent="☀️";

    }

    else{

        modeBtn.textContent="🌙";

    }

});






async function getWeather(city){


    loader.style.display="block";


    try{


        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


        const response = await fetch(url);



        if(!response.ok){

            throw Error();

        }



        const data = await response.json();



        cityName.textContent=data.name;


        temperature.textContent=
        Math.round(data.main.temp)+"°C";


        description.textContent=
        data.weather[0].description;



        weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;



        humidity.textContent=
        data.main.humidity+"% Humidity";


        wind.textContent=
        data.wind.speed+" km/h Wind";



        feels.textContent=
        data.main.feels_like+"°C Feels";



        pressure.textContent=
        data.main.pressure+" hPa";



        visibility.textContent=
        (data.visibility/1000)+" km";


        clouds.textContent=
        data.clouds.all+"% Clouds";



        sunrise.textContent=
        "🌅 "+convertTime(data.sys.sunrise);



        sunset.textContent=
        "🌇 "+convertTime(data.sys.sunset);



        changeBackground(data.weather[0].main);



        getForecast(city);



    }


    catch(error){

        cityName.textContent="Not Found";

        description.textContent=
        "Check city name";

        weatherIcon.src="";


    }


    finally{

        loader.style.display="none";

    }

}







async function getForecast(city){


    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;


    const response = await fetch(url);


    const data = await response.json();


    forecast.innerHTML="";



    let days=[];



    data.list.forEach(item=>{


        if(item.dt_txt.includes("12:00:00")){

            days.push(item);

        }

    });




    days.slice(0,5).forEach(day=>{


        let card=document.createElement("div");


        card.className="forecast-card";


        card.innerHTML=`

        <p>
        ${new Date(day.dt_txt)
        .toLocaleDateString("en",
        {weekday:"short"})}
        </p>


        <img width="50"
        src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">


        <h3>
        ${Math.round(day.main.temp)}°C
        </h3>

        `;


        forecast.appendChild(card);


    });


}







function convertTime(time){


    let date=new Date(time*1000);


    return date.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

}








function changeBackground(weather){


    document.body.className="";


    weather=weather.toLowerCase();



    if(weather.includes("clear")){

        document.body.classList.add("sunny");

    }


    else if(weather.includes("rain")){

        document.body.classList.add("rainy");

    }


    else if(weather.includes("cloud")){

        document.body.classList.add("cloudy");

    }


}