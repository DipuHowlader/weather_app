// key = 1adcda59a9b5bb90b782b20ed9d80d6e
// https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=439d4b804bc8187953eb36d2a8c26a02
// // pro.openweathermap.org/data/2.5/forecast/hourly?lat={lat}&lon={lon}&appid={API key}

// setting current date 
const date = document.querySelector('.date')
const currentDate = new Date()
const day = currentDate.toLocaleString('en-us', {
    weekday: 'long'
})
const month = currentDate.toLocaleString('en-us', {
    month: 'long'
})
const cdate = currentDate.getDate()
date.innerText = `${day} ${cdate} ${month}`

// getting target 
const key = '1adcda59a9b5bb90b782b20ed9d80d6e';
const temp = document.querySelector('.temp');
const info = document.querySelector('.weather-info');
const form = document.querySelector('form');
const changeCity = document.querySelector('.change-city');
const high = document.querySelector('.high h2');
const wind = document.querySelector('.wind h2');
const sunrise = document.querySelector('.sunrise h2');
const low = document.querySelector('.low h2');
const rain = document.querySelector('.rain h2');
const sunset = document.querySelector('.sunset h2');
const icon = document.querySelector('.icon');
const city = document.querySelector('.city');
const overlay = document.querySelector('.overlay');
const Cost = document.querySelectorAll('.single-cast');
const state = document.querySelector('.state')
let j = 0

// fetch api for fordcast
const fordcast = (lat, long) => {
    j = 0
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=1adcda59a9b5bb90b782b20ed9d80d6e`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            Cost.forEach((element) => {
                    const unix = (data.hourly[j].dt)
                    const fordcastData = new Date(unix * 1000)
                    const hour = fordcastData.getHours() % 12 || 12
                    const minute = fordcastData.getMinutes()

                    element.querySelector('.weather img').setAttribute('src', `http://openweathermap.org/img/w/${data.hourly[j].weather[0].icon}.png`)
                    element.querySelector('.degree').innerText = Math.ceil((data.hourly[j].temp - 273.14))
                    element.querySelector('.time').innerText = (hour) + ':' + minute
                    j += 5
            })
        })
    overlay.classList.add('custom')
}
// getting user location through Geolocation
const geoLocacion = () => {
    overlay.classList.remove('custom')
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPositon)
    }
}

const showPositon = (position) => {
    let lat = position.coords.latitude
    let long = position.coords.longitude

    // fetch api for current location
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`
    fetch(api)
        .then(response => response.json())
        .then(data => {

            // process data 
            let unix = data.sys.sunset
            let unit = data.sys.sunrise
            const format = (unix) => {
                let formated = new Date(unix * 1000)
                let Hours = formated.getHours() % 12 || 12
                let minute = formated.getMinutes()
                return `${Hours}:${minute}`
            }

            // setting data through json data 
            city.setAttribute('placeholder', data.name)
            changeCity.innerText = data.name
            temp.innerText = Math.ceil((data.main.temp - 273.14))
            info.innerText = (data.weather[0].description)
            high.innerText = Math.ceil(data.main.temp_max - 273.14)
            wind.innerText = `${data.wind.speed} mph`
            sunrise.innerText = format(unit)
            low.innerText = Math.floor((data.main.temp_min - 273.15))
            rain.innerText = `${data.main.humidity} %`
            sunset.innerText = format(unix)
            const iconcode = data.weather[0].icon
            icon.setAttribute('src', "http://openweathermap.org/img/w/" + iconcode + ".png")
        })
        .catch((err) => {
            if (err) {
                console.err(err)
            }
        });
    fordcast(lat, long)
}

geoLocacion()


// feth on form event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let city_name = document.querySelector('.city').value
    let state_name = document.querySelector('.state').value
    if (city_name=='' || state_name ==''){
        return
    }

    overlay.classList.remove('custom')
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city_name},${state_name},uk&appid=${key}`;
    fetch(api)
        .then(response => response.json())
        .then(data => {

            if(data.cod){
                overlay.classList.remove('custom')
                return
            }

            // process data 
            let unix = data.sys.sunset
            let unit = data.sys.sunrise
            const format = (unix) => {

                let formated = new Date(unix * 1000)
                let Hours = formated.getHours() % 12 || 12
                let minute = formated.getMinutes()
                return `${Hours}:${minute}`
            }
            // setting data through json data 
            changeCity.innerText = city_name
            temp.innerText = Math.ceil((data.main.temp - 273.14))
            info.innerText = (data.weather[0].description)
            high.innerText = Math.ceil(data.main.temp_max - 273.14)
            wind.innerText = `${data.wind.speed} mph`
            sunrise.innerText = format(unit)
            low.innerText = Math.floor((data.main.temp_min - 273.15))
            rain.innerText = `${data.main.humidity} %`
            sunset.innerText = format(unix)
            const iconcode = data.weather[0].icon
            icon.setAttribute('src', "http://openweathermap.org/img/w/" + iconcode + ".png")

            // call fordcast
            fordcast(data.coord.lat, data.coord.lon)



        }).catch((err) => {
            if (err) {
                console.error(err)
            }
        })
    overlay.classList.remove('custom')

})