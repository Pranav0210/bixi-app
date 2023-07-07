const mongoose = require('mongoose')

const PriceSchema = mongoose.Schema({
    
},
{timestamp:true});

PriceSchema.pre('save', ()=>{
    this.ev_id = this._id;
});

module.exports = mongoose.model('Ev', PriceSchema)