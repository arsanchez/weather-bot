// Bot api utility to interpret the user input
const axios    = require('axios');
const publicIp = require('public-ip');
const iplocation = require('iplocation');
var bot_api = function () {};

function get_weather(city) {
    var weather_url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=c514062dcc0746686ae0c0af1101301f"
    return axios.get(weather_url).then(response => {
        // Getting the weather message
        var msg = "The weather for "+city+" is "+response.data.weather[0].description+" with a temperature of "+response.data.main.temp+" °F";
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
        //  Validate the response s
        if(typeof response.data.entities !== 'undefined'    ) {
            // Processing the entities 
            if(typeof response.data.entities.intent !== 'undefined') {
                if(response.data.entities.intent[0].confidence > 0.80) {
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
                else {
                    return "It doesn't seem like you're looking for the weather report";
                }
            }
            else if(typeof response.data.entities.location !== 'undefined') {
                var location = response.data.entities.location[0].value;

                // Getting the location
                var w  = get_weather(location).then(weather => {
                    return weather;
                });

                return w;
            }
            // Provide context feedback
            else {
                return "Sorry i can only answer weather related questions";
            }
        }
        else {
            return "It doesn't seem like you're looking for the weather report";
        }

    })
    .catch((error) => {
         console.log('error ' + error);
         return "Ummmm.. i can't understand what you just said, please try again";
    });    


    return answer;
}

module.exports = new bot_api();