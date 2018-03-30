var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var fileSchema = new Schema({
   start_date: String,
   end_date: String,
   station: String,
   remote: String,
   fares: {
      "FF": Number,
      "SEN/DIS":  Number,
      "7-D AFAS UNL": Number,
      "30-D AFAS/RMF UNL": Number,
      "JOINT RR TKT": Number,
      "7-D UNL": Number,
      "30-D UNL": Number,
      "14-D RFM UNL": Number,
      "1-D UNL": Number,
      "14-D UNL": Number,
      "7D-XBUS PASS": Number,
      "TCMC": Number,
      "RF 2 TRIP": Number,
      "RR UNL NO TRADE": Number,
      "TCMC ANNUAL MC":  Number,
      "MR EZPAY EXP":  Number,
      "MR EZPAY UNL":  Number,
      "PATH 2-T":  Number,
      "AIRTRAIN FF":  Number,
      "AIRTRAIN 30-D": Number,
      "AIRTRAIN 10-T":  Number,
      "AIRTRAIN MTHLY":  Number,
      "STUDENTS":  Number,
      "NICE 2-T":  Number,
      "CUNY-120":  Number,
      "CUNY-60" :  Number, 
   }
});

var file = mongoose.model('challenge', fileSchema);

module.exports = file;