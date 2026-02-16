import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import ComparisonBar from "../../components/layout/ComparisonBar/ComparisonBar";
import styles from "./HomeLayout.module.css";

const HomeLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <ComparisonBar />
    </div>
  );
};

export default HomeLayout;