const NodeGeoCoder = require('node-geocoder');
require('dotenv').config({ path: './config/config.env' });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdaptor: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
}

const GeoCoder = NodeGeoCoder(options);

module.exports = GeoCoder;