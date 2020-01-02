import React from 'react';
import { } from 'reactstrap';
import './Styles/weather.css'
import apiConfig from './apiKeys'
import dateFormater from './Helpers/dateFormaters'

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
    `http://api.openweathermap.org/data/2.5/forecast?id=3471291&units=metric&APPID=${apiConfig.openWeatherKey}`

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
        this.state.weatherData.icon.push(this.formateWeatherIcon(dailyData[i].weather[0].id));
        this.state.weatherData.temperature.push(Math.floor(dailyData[i].main.temp));
        this.state.weatherData.weather.push(dailyData[i].weather[0].description);
      }
      })
      .catch(error => console.dir(error));
  }

  formateWeatherIcon(id){
    let iconURL = "http://openweathermap.org/img/wn/";
    if(id == 804 || id == 803) iconURL += "04d";
    else if(id == 800) iconURL += "01d";
    else if(id == 802) iconURL += "03d";
    else if(id == 801) iconURL += "02d";
    else if(id > 700 && id < 782) iconURL += "50d";
    else if((id > 599 && id < 623) || (id == 511)) iconURL += "13d";
    else if(id > 519 && id < 532) iconURL += "09d";
    else if(id > 499 && id < 505) iconURL += "10d";
    else if(id > 299 && id < 322) iconURL += "09d";
    else iconURL += "11d";
    return iconURL+"@2x.png";
  }

  renderCard(index){
    return [
      <div className="day">
        <h3>{this.state.weatherData.weekday[index]}</h3>
        <h6>{this.state.weatherData.day[index]}&nbsp;{this.state.weatherData.month[index]}</h6>
        <img src={this.state.weatherData.icon[index]} height="80" width="80" className="wimg"/>
        <h4>{this.state.weatherData.temperature[index]} ºC</h4>
        <h4>{this.state.weatherData.weather[index]}</h4>
      </div>
    ]
  }

  render() {
    return(
      <div id="weather">
        {this.renderCard(0)}
        <div className="separator"></div>
        {this.renderCard(1)}
        <div className="separator"></div>
        {this.renderCard(2)}
      </div>
    );
  }
}
