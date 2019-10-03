var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    review: {
        type: String,
        required: true
    }
});