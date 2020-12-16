import React from 'react';
import { } from 'reactstrap';
import apiConfig from './../../apiKeys'
import dateFormater from './../../Helpers/dateFormaters'

export default class Weather extends React.Component {
  constructor(){
    super();
    this.state = {
      dailyData: '',
      weatherData: {
        weekday: [],
        day: [],
        month: [],
        icon:[],
        temperature:[],
        weather:[],
      },
    }
  }

  componentDidMount = () => {
    this.getWeather();
    this.getWeatherInterval = setInterval(
      () => this.getWeather(),
      60000
    );
  }

  componentWillUnmount() {
    clearInterval(this.getWeatherInterval);
  }

  getWeather(){
    const weatherURL =
    `http://api.openweathermap.org/data/2.5/forecast?id=3471291&units=metric&lang=pt_br&APPID=${apiConfig.WEATHER_API_KEY}`

    fetch(weatherURL)
      .then(res => res.json())
      .then(data => {
      const dailyData = data.list.filter(reading => reading.dt_txt.includes("18:00:00"))
        this.setState({
          dailyData: dailyData
        })
      for(let i = 0; i < 3; i++){
        let newDate = new Date();
        const weekday = dailyData[i].dt*1000;
        newDate.setTime(weekday);

        this.state.weatherData.weekday.push(dateFormater.formateWeekday(newDate.getDay()));
        this.state.weatherData.day.push(newDate.getDate());
        this.state.weatherData.month.push(dateFormater.formateMonth(newDate.getMonth()));
        this.state.weatherData.icon.push(this.formatWeatherIcon(dailyData[i].weather[0].id));
        this.state.weatherData.temperature.push(Math.floor(dailyData[i].main.temp));
        this.state.weatherData.weather.push(dailyData[i].weather[0].description);
      }
      })
      .catch(error => console.dir(error));
  }

  formatWeatherIcon(id){
    let iconURL = "http://openweathermap.org/img/wn/";
    if(id === 804 || id === 803) iconURL += "04d";
    else if(id === 800) iconURL += "01d";
    else if(id === 802) iconURL += "03d";
    else if(id === 801) iconURL += "02d";
    else if(id > 700 && id < 782) iconURL += "50d";
    else if((id > 599 && id < 623) || (id === 511)) iconURL += "13d";
    else if(id > 519 && id < 532) iconURL += "09d";
    else if(id > 499 && id < 505) iconURL += "10d";
    else if(id > 299 && id < 322) iconURL += "09d";
    else iconURL += "11d";
    return iconURL+"@2x.png";
  }

  turnFirstCapital(string){
    if(string === undefined)
      return string
    else
      return string.charAt(0).toUpperCase()+string.slice(1)
  }

  renderCard(index){
    let {weekday, day, month, icon, temperature, weather} = this.state.weatherData;
    return (
      <div>
        <div className="row d-flex justify-content-center align-items-center">
          <h3>{weekday[index]}&nbsp;</h3>
          <h5>({day[index]}&nbsp;{month[index]})</h5>
        </div>
        <div className="row d-flex justify-content-center">
          <img src={icon[index]} className="img-fluid" style={{maxWidth:'40%'}}/>
        </div>
        <div className="row d-flex justify-content-center">
          <h5>{temperature[index]} ºC</h5>
        </div>
        <div className="row d-flex justify-content-center">
          <h4>{this.turnFirstCapital(weather[index])}</h4>
        </div>
      </div>
    )
  }

  render() {
    return(
      <div
        style={{
          margin:10,
          padding:5,
          paddingLeft:15,
          paddingRight:15,
          background:'rgba(128,128,128,0.7)',
          borderRadius:15,
          color:'#fff'
        }}>
        {this.renderCard(0)}
        <hr style={{background:'#fff'}}/>
        {this.renderCard(1)}
        <hr style={{background:'#fff'}}/>
        {this.renderCard(2)}
      </div>
    );
  }
}
