import React from 'react';
import Header from '../components/Header'; 
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import SpecialityMenu from "../components/SpecialityMenu";
import config from '../config/config';
const Home = () => {
  return (
    <>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </>
  );
}

export default Home;