import apiConfig from './../apiKeys'

export async function getWeather(name='avare', datetime=new Date().toISOString().split('T')[0]){
  name = name.replace(/ /g, '%20');
  const weatherURL =
  `http://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&lang=pt_br&APPID=${apiConfig.WEATHER_API_KEY}`

  return fetch(weatherURL)
    .then(res => res.json())
    .then(data => data.list.filter(reading => reading.dt_txt.includes(datetime)).filter(checkTime))
    .catch(error => console.dir(error));
}

function checkTime(data) {
  let info = data.dt_txt;
  if(info.includes("09:00:00") || info.includes("15:00:00") || info.includes("21:00:00")){
    return true;
  }
  return false;
}
