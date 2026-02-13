import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import ComparisonBar from "../../components/layout/ComparisonBar/ComparisonBar"; // ДОДАНО
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
      {/* Додаємо бар сюди — він з'являтиметься лише коли в compareIds є об'єкти */}
      <ComparisonBar /> 
    </div>
  );
};

export default MainLayout;