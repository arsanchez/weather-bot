// Bot api utility to interpret the user input
const axios    = require('axios');
const publicIp = require('public-ip');
const iplocation = require('iplocation');
var bot_api = function () {};

function get_weather(city) {
    var weather_url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=c514062dcc0746686ae0c0af1101301f"
    return axios.get(weather_url).then(response => {
        // Getting the weather message
        var msg = "The weather for "+city+" is "+response.data.weather[0].description+" with a temperature of "+response.data.main.temp+" &deg;F";
        return msg;
    }); 

}

// Function to send a request to wit.ai and get the interpreted response
bot_api.prototype.read_msg =  function(msg) {
    // Setting the request
    msg = encodeURIComponent(msg);

    const AuthStr = 'Bearer '+'LJ2XFGQUSYDQS476PQHYEQIPW7RJCLA7'; 
    const URL = 'https://api.wit.ai/message?v=15/02/2018&q='+msg;
    var answer= axios.get(URL, { headers: { Authorization: AuthStr } })
    .then(response => {
        // If request is good...
        //  Validate the response 
        if(typeof response.data.entities !== 'undefined') {
            // Processing the entities 
            if(typeof response.data.entities.intent !== undefined) {
                var intent = response.data.entities.intent;
                
                if(typeof intent !== 'undefined') {
                    if(intent[0].value != "weather") {
                        return "Sorry i can only answer weather related questions";
                    }
                    else {
                        if(typeof response.data.entities.location !== 'undefined') {
                            var location = response.data.entities.location[0].value;
                            // Getting the location
                            var w  = get_weather(location).then(weather => {
                                return weather;
                            });
                            
                            return w;
                            
                        }
                        // If no location is provided we use the user ip
                        else {
                            var ip = publicIp.v4().then(ip => {
                                return ip;
                            });
                             
                            return iplocation(ip)
                            .then(res => {  
                                var w  = get_weather(res.city).then(weather => {
                                   return weather;
                                });
                                return w;
                            })
                            .catch(err => {
                                console.error(err)
                            });

                           
                        }
                    }
                }
                // Checking for location 
                else if(typeof response.data.entities.location !== 'undefined') {
                    var location = response.data.entities.location[0].value;

                    // Getting the location
                    var w  = get_weather(location).then(weather => {
                        return weather;
                    });

                    return w;
                }
               
            }
            if(entity[0].value == "weather") {
                return "here";
            }
            // Provide context feedback
            else {
                return "Sorry i can only answer weather related questions";
            }
        }
        else {
            return "none";
        }

    })
    .catch((error) => {
         console.log('error ' + error);
    });    


    return answer;
}

module.exports = new bot_api();