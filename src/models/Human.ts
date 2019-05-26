const mongoose = require("mongoose");//insted of import beacuse of problem with @types

const HumanSchema = new mongoose.Schema({
    sequense: {type: [String], required: true},
    isMutant: {type: Boolean},
    hash: {type:String}
});
HumanSchema.index({hash: 1}, {unique: true});
  
export default mongoose.model('Human', HumanSchema);