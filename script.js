const forecast = document.querySelector(".forecast-1");
const titles = document.querySelector(".titles")
const fortables = document.querySelector(".forecastTable")

//calculate the current GMT hour
let time;
const curGMT = (GMTdif = 3) => {
  // GMT is default 3 for Turkey. You should select proper time correction according to your time zone
  time = new Date();
  const timecorrection = time.getHours() - GMTdif;
  if (timecorrection === 0) return 24;
  if (timecorrection > 0) return timecorrection;
  if (timecorrection < 0) return Math.abs(timecorrection - 21);
};
// select icon accoring to the condition
const selectIcon = (el) => {
  if (el.weather.includes("cloudy") && el.weather.includes("night"))
    return `<i class="fas fa-cloud-moon"></i>`;

  if (el.weather.includes("clear") && el.weather.includes("night"))
    return `<i class="fas fa-moon"></i>`;

  if (el.weather.includes("rain") && el.weather.includes("night"))
    return `<i class="fas fa-cloud-moon-rain"></i>`;

  if (el.weather.includes("snow")) return `<i class="fas fa-snowflake"></i>`;

  if (el.weather.includes("clear") && el.weather.includes("day"))
    return `<i class="fas fa-sun"></i>`;

  if (el.weather.includes("cloudy") && el.weather.includes("day"))
    return `<i class="fas fa-cloud"></i>`;

  if (el.weather.includes("rain") && el.weather.includes("day"))
    return `<i class="fas fa-cloud-sun-rain"></i>`;
};
// select weather condition

const selectState = (el) => {
  if (el.weather.includes("cloudy") && el.weather.includes("night"))
    return `Cloudy Night`;

  if (el.weather.includes("clear") && el.weather.includes("night"))
    return `Clear Night`;

  if (el.weather.includes("rain") && el.weather.includes("night"))
    return ` Rainy Night`;

  if (el.weather.includes("snow") && el.weather.includes("night"))
    return `Snowy Night`;

  if (el.weather.includes("snow") && el.weather.includes("day"))
    return `Snowy Day`;

  if (el.weather.includes("clear") && el.weather.includes("day"))
    return `Clear Day`;

  if (el.weather.includes("cloudy") && el.weather.includes("day"))
    return `Cloudy Day`;

  if (el.weather.includes("rain") && el.weather.includes("day"))
    return `Rainy Day`;
};

//select weather condition
const predictor = function (fdata, init, tpoint = 3, day) {
  // fdata: dataseries array in JSON data, init: initializing time, tpoint: timepoint
  //which array's index indicates current time's weather condition
  const arrIn = Math.floor(
    (curGMT() - +init.slice(-2) < 0 ? curGMT() : curGMT() - +init.slice(-2)) /
      tpoint
  ); //
  // show the weather condition's time
  const curTime = (arrIndex) => {
    //show 'now' if time is now
    if (arrIndex === 0) return `NOW`;
    // show weather condition's time
    if (arrIndex > 0)
      return `${(
        time.getHours() +
        arrIndex * tpoint -
        24 * Math.floor((time.getHours() + arrIndex * tpoint) / 24)
      )
        .toString()
        .padStart(2, 0)}:00`;
  };

  
  //select time window array between current time and after 24 hours
  const selectedData = fdata.filter((el, i) => {
    return i >= arrIn && i <= arrIn + 8 * day;
  });
console.log(selectedData);

 selectedData.forEach((el, i) => {
    const tag = ` 
  <tr>
    <td>${curTime(i)}</td>
    <td>${el.seeing}</td>
    <td>${el.transparency}</td>
    <td>${el.wind10m.speed}</td>
    <td>${el.wind10m.direction}</td>
    <td>${el.temp2m}</td>
  </tr>
  `    
  fortables.insertAdjacentHTML("beforeend", tag);
  });
};


      



//async functions. 1) obtain geolocation 2) get the weather broadcast from the API
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      const lat = latitude.toString().slice(0, 6);
      const long = longitude.toString().slice(0, 6);

      const getWeather = async function () {
        const res = await fetch(
          `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=astro&output=json`         
        );
        const result = await res.json();
        return result;
      };

      getWeather().then((rslt) => {
        console.log(rslt, lat, long);
        const { dataseries: data, init: init } = rslt;
        console.log(rslt);
        //console.log(data, init);
       predictor(data, init, 3, 1);
        // console.log(data[0].prec_type);
      });
    },
    function () {
      alert("could not your position");
    }
  );

  // cloudcover bulut örtüsü
  //seeing görüş
