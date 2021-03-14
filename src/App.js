import './App.css';
import React, { useState,useEffect } from 'react';
import axios from 'axios';

const fetchWeatherdata = (location)=> {
  return axios.get(`https://www.metaweather.com/api/location/search/?query=${location}`)
 .then((response)=> {
  return (response.data);
}).catch((error) =>{
  console.error(error);
});

}

const getLocationWeather = (woeid) =>{
 return axios.get(`https://www.metaweather.com/api/location/${woeid}/`)
 .then((response)=> {
  return (response.data.consolidated_weather);
}).catch((error) =>{
  console.error(error);
});

}

function App() {
  const [Searchresult, SetSearchresult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherdata,Setweatherdata] = useState([]);
  const handleChange = (event)=>{
    setSearchTerm(event.target.value);
  }
  
  useEffect(()=>{
    if(searchTerm.length===0 ){
      SetSearchresult([])
    }
    else{
    fetchWeatherdata(searchTerm).then((res)=>{
      res = res.filter(element => {
        return (element.title.toUpperCase().startsWith(searchTerm.toUpperCase()))
      });
      SetSearchresult(res || [])
    })  
    }
  },[searchTerm])


  useEffect(()=> {
    if(Searchresult.length===1 && Searchresult[0].title===searchTerm){
    SetSearchresult([])
    getLocationWeather(Searchresult[0].woeid).then((res)=>{
      Setweatherdata(res || [])
    }) 
  }
  },[Searchresult]);

  return (
    <div className="App">

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e)=>handleChange(e)}
        list = "Searchresult"
      />
    <datalist id="Searchresult">
      {Searchresult.map((item, key) =>
      <option key={key} value={item.title} />
      )}
      </datalist>

      <div>
        <ul>
       {weatherdata.map((item,key)=>{
         let {applicable_date: date,
             max_temp:max,
             min_temp:min,
             the_temp:current,
             weather_state_name:state,
             wind_direction_compass:wind} = item
             min = Math.floor(min);
             max = Math.floor(max);
             current =  Math.floor(current);
         return <li key={key}>{date} Temp:{min}-{max}°C  current : {current} °C {state} Wind: {wind}</li>
       })}
      </ul>
    </div>
    </div>
  );
}




export default App;
