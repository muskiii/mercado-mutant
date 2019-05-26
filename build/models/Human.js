"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose"); //insted of import beacuse of problem with @types
const HumanSchema = new mongoose.Schema({
    sequense: { type: [String], required: true },
    isMutant: { type: Boolean },
    hash: { type: String }
});
HumanSchema.index({ hash: 1 }, { unique: true });
exports.default = mongoose.model('Human', HumanSchema);
