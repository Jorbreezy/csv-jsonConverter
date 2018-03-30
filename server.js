var express = require('express'),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    port = process.env.PORT || 1337,
    methodOverride = require("method-override"),
    app = express(),
    csv = require("csvtojson"),
    request = require("request"),
    fs = require("fs"),
    Challenge = require('./model/fileSchema.js');
    
    
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');
    return next();
});

app.use(express.static(__dirname + '/client'));

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://jkelly:deserteagle5@ds125481.mlab.com:25481/mindsurf',  { useMongoClient: true });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vdn.api+json' }));
app.use(methodOverride());


// app.use('/mta', require('./controller/file'));

// app.use('/challenge', require('./controller/csvConvert'));


// INDEX
app.get('/', function(req, res){
   res.render('converter'); 
});

// POST DATA TO INDEX
app.post('/', function(req, res){
    var param = req.body;
    
    // PROCESS URL
    processRequest(param.file, res);
});

app.get('/Results', function(req, res){
  Challenge.find({}, function(err, c){
    res.send(c);
    // console.log('reached');
    // res.send(challenges);
  });
});

// DISPLAY ALL FROM MONGO
app.get('/Get', function(req, res){
    // QUERY MONGODB FOR RESULTS
    Challenge.find({}, function(err, c){
    res.json(c);
    // console.log('reached');
    // res.send(challenges);
  });
    //next line can be changed!
    // res.send("This is to see if this works!!");
});


var table = [];

function processRequest(url, response){
    // http://web.mta.info/developers/data/nyct/fares/fares_170506.csv
    
    csv({
        trim: true, 
        noheaders: false
    })
    .fromStream(request.get(url))
    .on('csv', (data) =>{
         var obj = new Challenge({
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
        table.push(obj);
    })
    .on('done', (error) => {
        console.log('done');
        
        //console.log(table[0].station.split("-"));
        var date = table[0].station.split("-");
        
      
      for(var i = 2; i < table.length; i++){
        var items = table[i];
        //console.log(items);  
        table[i].start_date = date[0];
        table[i].end_date = date[1];
        
        table[i].save(function(err){
            if(err) throw err;
            console.log('save sucessful');
        });
        console.log(table);
      }
      
      response.json({ status: 1 });
       
    })
    
}

function parser(content){
    return parseInt( content );
}

app.listen(port, function(){
  console.log("Server listening at " + port);
  //console.log("Server Is Running: " + process.env.PORT + ":" + process.env.IP);
});


