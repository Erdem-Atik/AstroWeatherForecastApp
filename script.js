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



const windMeas = function(wind){
if(wind<1) return `0.3m/s (durgun)`
if(wind<2) return `0.3-3.4m/s (hafif)`
if(wind<3) return `3.4-8.0m/s (orta)`
if(wind<4) return `8.0-10.8m/s (fresh)`
if(wind<5) return `10.8-17.2m/s (güçlü)`
if(wind<6) return `17.2-24.5m/s (fırtına)`
if(wind<7) return `24.5-32.6m/s (storm)`
if(wind<8) return `Over 32.6m/s (hurricane)`
}

const SeeingMeas = function(see){
  if(see===1) return  `<0.5"`
  if(see===2) return  `0.5"-0.75"`
  if(see===3) return  `0.75"-1"`
  if(see===4) return  `1"-1.25"`
  if(see===5) return  `1.25"-1.5`
  if(see===6) return  `1.5"-2"`
  if(see===7) return  `2"-2.5`
  if(see===8) return  `>2.5"`
} 

const transMeas = function(tra){
  if(tra===1) return  `<0.3`
  if(tra===2) return  `0.3-0.4`
  if(tra===3) return  `0.4-0.5`
  if(tra===4) return  `0.5-0.6`
  if(tra===5) return  `0.6-0.7`
  if(tra===6) return  `<0.7-0.85`
  if(tra===7) return  `0.85-1`
  if(tra===8) return  `>1`
}

const cloudMeas = function(clo){
  if(clo===1) return `0%-6%`
  if(clo===2) return `6%-19%`
  if(clo===3) return `19%-31%`
  if(clo===4) return `31%-44%`
  if(clo===5) return `44%-56%`
  if(clo===6) return `56%-69%`
  if(clo===7) return `69%-81%`
  if(clo===8) return `81%-94%`
  if(clo===9) return `94%-100%`
}

const humMeas = function(hum){
  if(hum===-4) return `0%-5%`
  if(hum===-3) return `5%-10%`
  if(hum===-2) return `10%-15%`
  if(hum===-1) return `15%-20%`
  if(hum===-0) return `20%-25%`
  if(hum=== 1) return `25%-30%`
  if(hum=== 2) return `30%-35%`
  if(hum=== 3) return `35%-40%`
  if(hum=== 4) return `40%-45%`
  if(hum=== 5) return `45%-50%`
  if(hum=== 6) return `50%-55%`
  if(hum=== 7) return `55%-60%`
  if(hum=== 8) return `60%-65%`
  if(hum=== 9) return `65%-70%`
  if(hum=== 10) return `70%-75%`
  if(hum=== 11) return `75%-80%`
  if(hum=== 12) return `80%-85%`
  if(hum=== 13) return `85%-90%`
  if(hum=== 14) return `90%-95%`
  if(hum=== 15) return `95%-99%`
  if(hum=== 16) return `100%`
}

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
    if (arrIndex === 0) return `ŞİMDİ`;
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
    <td>${SeeingMeas(el.seeing)}</td>
    <td>${transMeas(el.transparency)}</td>
    <td>${cloudMeas(el.cloudcover)}</td>
    <td>${humMeas(el.rh2m)}</td>
    <td>${windMeas(el.wind10m.speed)}</td>
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
      const lat = +latitude.toString().slice(0, 6);
      const long = +longitude.toString().slice(0, 6)

      const getWeather = async function () {
        const res = await fetch(
          `http://www.7timer.info/bin/api.pl?lon=${41.015}&lat=${28.979}&product=astro&output=json` 
        );
        const result = await res.json();
        return result;
      };

      getWeather().then((rslt) => {
        console.log(rslt, lat, long);
        const { dataseries: data, init: init } = rslt;
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
