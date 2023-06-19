const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('./config/mongoose');
const path = require('path');
const ENV = process.env.NODE_ENV || "development";
const HOST = "appoint-service.azurewebsites.net";
const PORT = 81;
const serviceName = process.env.SERVICE_NAME || "appointment-service";
const apiGatewayHost = process.env.API_GATEWAY_HOST || "gateway.e-nomads.com";
const apiGatewayPort = process.env.API_GATEWAY_PORT || 3030;

// Create Express service
const service = express();

// Parse requests of content-type 'application/json'
service.use(express.urlencoded({ extended: true }));
service.use(express.json());

// Enable cross-origin resource sharing for frontend must be registered before api
service.options('*', cors());
service.use(cors());

// Connect to database
mongoose.connect();

// Import entity models
const db = require("./models");

// Import routes
service.get('/', function(req, res) {
    res.json({'message': 'Welcome to Appointment-service'});
});
require("./routes/appointment.routes")(service);

// Catch all non-error handler for api (i.e., 404 Not Found)
service.use('/*', function (req, res) {
    res.status(404).json({ 'message': 'Endpoint not found!' });
});

service.listen(PORT, function(err) {
    axios({
        method: "POST",
        url: `http://${apiGatewayHost}:${apiGatewayPort}/register`,
        headers: {
            "Content-Type": "application/json"
        },
        data: {
            serviceName: serviceName,
            protocol: "http",
            host: HOST,
            port: PORT,
            enabled: true
        },
    }).then((response) => {
        console.log(response.data);
    });

    if (err) throw err;
    console.log(`${serviceName} started on port ` + PORT);
});

module.exports = service;
