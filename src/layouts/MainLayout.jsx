import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
// import Footer from '../components/layout/Footer/Footer'; // Якщо є Footer

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}> {/* Додайте відступ, якщо Navbar фіксований */}
        <Outlet /> {/* Тут будуть рендеритись компоненти сторінок */}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default MainLayout;