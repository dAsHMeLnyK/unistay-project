import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={styles.mainContainer}>
        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;