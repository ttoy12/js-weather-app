import "./style.css"
import { getWeather } from "./weather"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess( { coords }) {
    getWeather(
        coords.latitude,
        coords.longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        console.log(coords)
    )
    .then(renderWeather)  
    //.then(data => { console.log(data)}) // trying to see if this will still print out the data, it returns undefined
    // will output data if I put this then statement first, but will get error...maybe can't use 2 then statements
    .catch(e => {
        console.error(e)
        alert("Error getting weather.")
    })
}

function positionError() {
    alert("There was an error getting your location. Allow us to use your location and refresh the page.")
}

// getWeather(10, 10, Intl.DateTimeFormat().resolvedOptions().timeZone).then( // moved inside postionSuccess function
//     data => {
//         console.log(data)
//     }
// )
    // renderWeather)
    // .catch(e => {
    //     console.error(e)
    //     alert("Error getting weather.")
    // })

function renderWeather({ current, daily, hourly }) {
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    renderHourlyWeather(hourly)
    document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent = document } = {}) {
    parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode) {
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
     //document.querySelector("[data-current-temp").textContent = current.currentTemp // made setValue function to replace this
    currentIcon.src =  getIconUrl(current.iconCode)
    setValue("current-temp", current.currentTemp)
    setValue("current-high", current.highTemp)
    setValue("current-low", current.lowTemp)
    setValue("current-fl-high", current.highFeelsLike)
    setValue("current-fl-low", current.lowFeelsLike)
    setValue("current-wind", current.windSpeed)
    setValue("current-precip", current.precip)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" }) // "can also use long which gives full day name...Tue=Tuesday"
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
    dailySection.innerHTML = ""
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        setValue("temp", day.maxTemp, { parent: element })
        setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element })
        element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
        dailySection.append(element)
    })
}


const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
    hourlySection.innerHTML = ""
    hourly.forEach(hour => {
        const element = hourRowTemplate.content.cloneNode(true)
        setValue("temp", hour.temp, { parent: element })
        setValue("fl-temp", hour.feelsLike, { parent: element })
        setValue("wind", hour.windSpeed, { parent: element })
        setValue("precip", hour.precip, { parent: element })
        setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element })
        setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element })
        element.querySelector("[data-icon").src = getIconUrl(hour.iconCode)
        hourlySection.append(element)
    })
}