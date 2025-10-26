import React from 'react';

import '../styles/globals.css';
import axios from 'axios';
import Store from 'electron-store'

const store = new Store()

const baseURLLink = store.get("base_url")


// axios.defaults.baseURL = 'http://13.49.67.188:8800/api/'
axios.defaults.baseURL = `http://${baseURLLink}:8800/api/`
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'

function MyApp({ Component, pageProps }) {

  return (
    <Component {...pageProps} />
  )
}

export default MyApp;
