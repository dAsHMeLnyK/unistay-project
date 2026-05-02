import React from "react";
import { FiNavigation } from "react-icons/fi";
import { OSTROH_LANDMARKS } from "../../../../constants/landmarks";
import styles from './AnalysisPanel.module.css';;

const AnalysisPanel = ({
  selectedLandmark,
  setSelectedLandmark,
  analysisHint,
}) => {
  return (
    <div className={styles.analysisPanel}>
      <div className={styles.analysisHeader}>
        <FiNavigation /> <span>Перевірка локації</span>
      </div>
      <div className={styles.landmarkGrid}>
        {OSTROH_LANDMARKS.map((l) => (
          <button
            key={l.id}
            className={`${styles.landmarkBtn} ${selectedLandmark?.id === l.id ? styles.activeLandmark : ""}`}
            onClick={() =>
              setSelectedLandmark(selectedLandmark?.id === l.id ? null : l)
            }
          >
            {l.name}
          </button>
        ))}
      </div>
      {analysisHint && (
        <div className={styles.analysisHintCard}>
          <div className={styles.hintIcon}>💡</div>
          <div className={styles.hintText}>
            <strong>Порада:</strong> {analysisHint.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
