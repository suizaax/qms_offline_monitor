import React from 'react';
import Head from 'next/head';
import Login from './pages/Login/Login';

function Home() {


  return (
    <React.Fragment>
      <Head>
        <title>Home - Ignite QMS</title>
      </Head>
      <Login />
    </React.Fragment>
  );
}

export default Home;
