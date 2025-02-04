const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sampleAirbnbSchema = new Schema({
  _id: {type: String, requiered:true},
  name: { type: String, required: true },
  description: { type: String },
  property_type: { type: String, required: true },
  cleaning_fee: { type: Number, required: true },  
  address: {
    street: { type: String, required: true },
    suburb: { type: String, required: true },
    country: { type: String, required: true },
  }
});

let SampleAirbnb = mongoose.model('SampleAirbnb', sampleAirbnbSchema,'listingsAndReviews');

module.exports = SampleAirbnb;
