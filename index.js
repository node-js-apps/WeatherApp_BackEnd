const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require ("cors");
const mysql = require("mysql2");
const request = require('request');
const { createVerify } = require("crypto");
require('dotenv').config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0


const db = mysql.createPool({
    host: process.env.NODE_APP_DATABASE_HOST,
    user: process.env.NODE_APP_DATABASE_USER,
    password: process.env.NODE_APP_DATABASE_PASSWORD,
    database: process.env.NODE_APP_DATABASE_NAME
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded( {extended: true} ));

//Showing ALL data of country_db table
app.get('/api/get/AllCity', (req, res) => {
    const sqlGet_City_All = 'SELECT * FROM owm_city_list';
    db.query(sqlGet_City_All, (error, result)=> {
        res.send(result);
        
    });
})


//Searching by cityname
app.get('/api/get/city/:owm_city_name', (req, res) => {
    const { owm_city_name } = req.params;
    const sqlGet_Special_City = 'SELECT owm_city_name,owm_country,country_long,owm_latitude,owm_longitude FROM owm_city_list WHERE owm_city_name LIKE ? LIMIT 10' ;
    db.query(sqlGet_Special_City, ['%' + owm_city_name + '%'],(error, result)=> {
        if(error){
            console.log("error", error);
        }
        res.send(result);
    });
})


//searching by countrycode
app.get('/api/get/city/Countrycode/:owm_country', (req, res) => {
    const { owm_country } = req.params;
    const sqlGet_Special_CityByCC = 'SELECT owm_city_name,owm_country,country_long,owm_latitude,owm_longitude FROM owm_city_list WHERE owm_country LIKE ? LIMIT 10' ;
    db.query(sqlGet_Special_CityByCC, ['%' + owm_country + '%'], (error, result)=> {
        if(error){
            console.log("error", error);
        }
        res.send(result);
    });
})


//Fetching API from Openwethermap
app.get('/api/get/weatherdata/', (req, res) => {
    let APIKEY = process.env.NODE_APP_WEATHERMAP_API_KEY;
    let city = req.query.city;
    var request = require('request');

    request(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`,
        function(error,response, body){
                if(error){
                    console.log("Something goes wrong", error);
                }else
                {
                    let data = JSON.parse(body)
                    if(response.statusCode === 200)
                        {
                            res.send(data)
                        }
                }
            }
    );
})


//Fetching API from Openwethermap
app.get('/api/get/weatherdata_search', (req, res) => {
    let APIKEY = process.env.NODE_APP_WEATHERMAP_API_KEY;
    let value = req.query.city;
    console.log(value)
    var request = require('request');

    request(`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${APIKEY}`,
        function(error,response, body){
            if(error){
                res.status(400).json({message:"Incorrect city name."})
                console.log("Something goes wrong", error);
            }
            else
            {
                let data = JSON.parse(body)
                res.send(data)
            }
        }
    );
})


//Fetching Lat, Long
app.get('/api/get/latlong/', (req, res) => {
    let APIKEY = process.env.NODE_APP_WEATHERMAP_API_KEY;
    let lat = req.query.lat;
    let long = req.query.long;
    var request = require('request');

    if(lat === undefined && long === undefined){
        console.log("error");
    }

    request(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${APIKEY}`,
        function(error,response, body){
            if(error){
                console.log("Something goes wrong", error);
            }else
            {
                let datalatlong = JSON.parse(body)
                if(response.statusCode === 200)
                    {
                        res.send(datalatlong)
                    }
            }
        }
    );
})


//Fetching Forecast from Openwethermap
app.get('/api/get/weatherdata/forecast/', (req, res) => {
    let APIKEY = process.env.NODE_APP_WEATHERMAP_API_KEY;
    const {city} = req.query;  
    let cnt = 16;

    var request = require('request');
    request(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${cnt}&appid=${APIKEY}`,
        function(error,response, body){
            if(error){
                console.log("Something goes wrong", error);
            }
            else
            {
                let data = JSON.parse(body)
                if(response.statusCode === 200)
                    {
                        res.send(data)
                    } 
            }
        }
    );
})

app.get('/api/get/countrydata/', (req, res) => {
    const {country} = req.query;  
    //console.log("WOWOWOWOW "+country); 
    var request = require('request');
    request(`https://restcountries.com/v3.1/alpha/${country}`,
        function(error,response, body){
            if(error){
                console.log("Something goes wrong", error);
            }
            else
            {
                let data = JSON.parse(body)
                if(response.statusCode === 200)
                    {
                        res.send(data)

                    } 
            }
        }
    );
})



//Fetching country all citys
app.get('/api/get/countrycity/', (req, res) => {   
    const {cca2} = req.query;  
    let owm_country = cca2;

   const sqlGet_Special_City_2 = 'SELECT owm_city_id, owm_city_name, owm_country from owm_city_list where owm_country LIKE ?' ;
    db.query(sqlGet_Special_City_2, ['%' + owm_country + '%'],(error, result)=> {
        if(error){
            console.log("error", error);
        }
        res.send(result);
         colse
    }); 

})


const httpServer = require('http').createServer(app);
let PORT;
let STATUS = process.env.STATUS;

STATUS === (STATUS) 
    ? (PORT = process.env.PORT)  
    : ('Server port not defined')

httpServer.listen(PORT, () => {
    console.log(`Server in ${STATUS} mode, listenig on:${PORT}`);
})
