var Challenge = require('../model/fileSchema.js'),
    express = require("express"),
    router = express(),
    obj = {};

const request = require('request');
const csv = require('csvtojson');

var test = [];


csv({
    trim: true, 
    noheaders: false
})
.fromStream(request.get("http://web.mta.info/developers/data/nyct/fares/fares_170506.csv"))
.on('csv', (data) =>{
     obj = new Challenge({
        station: data[1],
        remote: data[0],
        start_date: '',
        end_date: '',
        fares: {
            "FF": parser(data[2]),
            "SEN/DIS":  parser(data[3]),
            "7-D AFAS UNL":  parser(data[4]),
            "30-D AFAS/RMF UNL":  parser(data[5]),
            "JOINT RR TKT":  parser(data[6]),
            "7-D UNL": parser(data[7]),
            "30-D UNL": parser(data[8]),
            "14-D RFM UNL": parser(data[9]),
            "1-D UNL": parser(data[10]),
            "14-D UNL": parser(data[11]),
            "7D-XBUS PASS": parser(data[12]),
            "TCMC": parser(data[13]),
            "RF 2 TRIP": parser(data[14]),
            "RR UNL NO TRADE": parser(data[15]),
            "TCMC ANNUAL MC": parser(data[16]),
            "MR EZPAY EXP": parser(data[17]),
            "MR EZPAY UNL": parser(data[18]),
            "PATH 2-T": parser(data[19]),
            "AIRTRAIN FF": parser(data[20]),
            "AIRTRAIN 30-D": parser(data[21]),
            "AIRTRAIN 10-T": parser(data[22]),
            "AIRTRAIN MTHLY": parser(data[23]),
            "STUDENTS": parser(data[24]),
            "NICE 2-T": parser(data[25]),
            "CUNY-120": parser(data[26]),
            "CUNY-60" : parser(data[27])
        }
    });
    //console.log(obj);
    test.push(obj);
})
.on('done', (error) => {
    console.log('done');
    console.log(test[0].station.split("-"));
    var date = test[0].station.split("-");
    
  
  for(var i = 2; i < test.length; i++){
    var items = test[i];
    //console.log(items);  
    test[i].start_date = date[0];
    test[i].end_date = date[1];
    
    test[i].save(function(err){
        if(err) throw err;
        console.log('save sucessful');
    });
  }
});

function parser(content){
    return parseInt( content );
}


