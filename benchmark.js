"use strict";

const autocannon = require("autocannon");

var endpoint = process.argv[2];
var connections = process.argv[3];
var duration = process.argv[4];

console.log("server is under siege...")
autocannon(
  {
    title: "stats",
    url: "http://localhost:5000/" + endpoint,
    connections, //default 10
    pipelining: 1, // default
    duration // default 1
  },
  console.log
);
