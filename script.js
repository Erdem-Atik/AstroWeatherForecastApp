const time = document.querySelector(".time");
const cond = document.querySelector(".condition");
const temp = document.querySelector(".temp");

const timeConvert = (num) => {
  const hours = Math.floor(num);
  const minutes = (num * 60) % 60;
  return `${hours}:${minutes}`;
};

const currentTime = function (tp) {
  let curTime = new Date();
  let curHour = curTime.getHours();

  if (curHour + tp < 24) {
    return timeConvert(curHour + tp);
  }
  if (curHour + tp >= 24) {
    return timeConvert(curHour + tp - 24);
  }
};

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      lat = latitude.toString().slice(0, 6);
      long = longitude.toString().slice(0, 6);

      const getWeather = async function () {
        const res = await fetch(
          `http://www.7timer.info/bin/api.pl?lon=${long}&lat=${lat}&product=civil&output=json`
        );

        const result = await res.json();
        return result;
      };

      getWeather().then((res) => {
        console.log(res, lat, long);
        const { dataseries: data } = res;
        console.log(data[0].prec_type);
        cond.innerHTML = data[0].prec_type;
        temp.innerHTML = `${data[0].temp2m}°`;
        time.innerHTML = currentTime(res.dataseries[0].timepoint);
      });
    },
    function () {
      alert("could not your position");
    }
  );
