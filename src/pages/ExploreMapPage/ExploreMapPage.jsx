import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Polyline,
  Tooltip,
  Circle, // Додано імпорт Circle
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { FiList, FiBookOpen, FiX } from "react-icons/fi";
import ReactDOMServer from "react-dom/server";

import { ListingService } from "../../api/services/ListingService";
import { OSTROH_LANDMARKS } from "../../constants/landmarks";
import { calculateDistance } from "../../utils/geoUtils";
import { useListings } from "../../context/ListingContext";

import MapController from "./components/MapController";
import AnalysisPanel from "./components/AnalysisPanel/AnalysisPanel";
import ListingCard from "../../components/listings/ListingCard/ListingCard";
import LoadingPage from "../LoadingPage/LoadingPage";
import styles from "./ExploreMapPage.module.css";

const MapActions = ({ setCloseAction }) => {
  const map = useMap();
  useEffect(() => {
    setCloseAction(() => () => map.closePopup());
  }, [map, setCloseAction]);
  return null;
};

const ExploreMapPage = () => {
  const navigate = useNavigate();
  const { compareIds, compareListings } = useListings();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [closePopupFunc, setClosePopupFunc] = useState(null);

  const MAIN_COORD = OSTROH_LANDMARKS.find((l) => l.id === "old_academy")
    ?.coords || [50.329, 26.512];

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const data = await ListingService.getAll();
        setListings(data);
      } catch (err) {
        console.error("Data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const academyIcon = (isNew) =>
    L.divIcon({
      className: styles.academyMarkerWrapper,
      html: ReactDOMServer.renderToString(
        <div className={isNew ? styles.newAcademyMarker : styles.academyMarker}>
          <FiBookOpen color="white" size={20} />
        </div>,
      ),
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

  const landmarkIcon = useMemo(
    () =>
      L.divIcon({
        className: styles.landmarkMarkerWrapper,
        html: `<div class="${styles.landmarkDot}"><div class="${styles.landmarkPulse}"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    [],
  );

  // Додано параметр isUnfocused
  const createPriceIcon = (price, isSelected, isUnfocused) =>
    L.divIcon({
      className: styles.customMarkerContainer,
      html: `<div class="${styles.priceTag} ${isSelected ? styles.priceTagSelected : ""} ${isUnfocused ? styles.priceTagUnfocused : ""}">${price.toLocaleString()} ₴</div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });

  const analysisHint = useMemo(() => {
    if (!selectedLandmark || compareListings.length !== 2) return null;
    const d = compareListings.map((l) =>
      calculateDistance(
        l.latitude,
        l.longitude,
        selectedLandmark.coords[0],
        selectedLandmark.coords[1],
      ),
    );
    return {
      text:
        d[0] < d[1]
          ? `Об'єкт №1 ближче до "${selectedLandmark.name}" на ${Math.abs(d[0] - d[1]).toFixed(2)} км`
          : `Об'єкт №2 ближче до "${selectedLandmark.name}" на ${Math.abs(d[0] - d[1]).toFixed(2)} км`,
    };
  }, [selectedLandmark, compareListings]);

  if (loading) return <LoadingPage />;

  return (
    <div className={styles.explorePage}>
      {compareIds.length === 2 && (
        <AnalysisPanel
          selectedLandmark={selectedLandmark}
          setSelectedLandmark={setSelectedLandmark}
          analysisHint={analysisHint}
        />
      )}

      <button
        className={`${styles.listFloatingBtn} ${compareIds.length > 0 ? styles.listBtnRaised : ""}`}
        onClick={() => navigate("/listings")}
      >
        <FiList /> Список
      </button>

      <MapContainer
        center={MAIN_COORD}
        zoom={16}
        zoomControl={false}
        className={styles.mapCanvas}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="bottomright" />

        <MapController
          selectedLandmark={selectedLandmark}
          compareListings={compareListings}
          mainCoord={MAIN_COORD}
        />
        <MapActions setCloseAction={setClosePopupFunc} />

        {/* Радіус доступності (1 км) */}
        {selectedLandmark && (
          <Circle
            center={selectedLandmark.coords}
            radius={1000}
            pathOptions={{
              fillColor: "var(--accent-color)",
              color: "var(--accent-color)",
              weight: 1,
              fillOpacity: 0.08, // Ледь помітний фон
            }}
          />
        )}

        {OSTROH_LANDMARKS.map((landmark) => {
          const isAcademy =
            landmark.id === "old_academy" || landmark.id === "new_academy";
          return (
            <Marker
              key={landmark.id}
              position={landmark.coords}
              icon={
                isAcademy
                  ? academyIcon(landmark.id === "new_academy")
                  : landmarkIcon
              }
              eventHandlers={{ click: () => setSelectedLandmark(landmark) }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                className={styles.landmarkNameTooltip}
              >
                {landmark.name}
              </Tooltip>
              <Popup className={styles.landmarkPopup}>
                <strong>{landmark.name}</strong>
              </Popup>
            </Marker>
          );
        })}

        {selectedLandmark &&
          compareListings.map((listing, index) => (
            <Polyline
              key={`analysis-${selectedLandmark.id}-${listing.id}`}
              positions={[
                selectedLandmark.coords,
                [listing.latitude, listing.longitude],
              ]}
              pathOptions={{
                // Використовуємо fallbacks, щоб Leaflet точно зрозумів колір
                color:
                  index === 0
                    ? "var(--analysis-line-1, #607D8B)"
                    : "var(--analysis-line-2, #7E897B)",
                weight: 4,
                dashArray: "10, 15",
                className: styles.animatedLine,
              }}
            >
              <Tooltip
                permanent
                direction="top"
                className={styles.distanceTooltip}
              >
                №{index + 1}:{" "}
                {calculateDistance(
                  listing.latitude,
                  listing.longitude,
                  selectedLandmark.coords[0],
                  selectedLandmark.coords[1],
                )}{" "}
                км
              </Tooltip>
            </Polyline>
          ))}

        {listings.map((listing) => {
          const compareIndex = compareIds.indexOf(listing.id);
          const isSelected = compareIndex !== -1;
          
          // Логіка Режиму Фокусу
          const isUnfocused = compareIds.length === 2 && !isSelected;
          
          const distToOld = calculateDistance(
            listing.latitude,
            listing.longitude,
            MAIN_COORD[0],
            MAIN_COORD[1],
          );

          return (
            <React.Fragment key={listing.id}>
              <Marker
                position={[listing.latitude, listing.longitude]}
                // Передаємо isUnfocused у функцію
                icon={createPriceIcon(listing.price, isSelected, isUnfocused)}
                zIndexOffset={isSelected ? 1000 : 0}
              >
                <Popup className={styles.mapPopup} closeButton={false}>
                  <div
                    className={`${styles.popupCardWrapper} ${isSelected ? styles.wrapperSelected : ""}`}
                  >
                    <div className={styles.distanceHeader}>
                      <div className={styles.distanceInfo}>
                        {isSelected && (
                          <span className={styles.compareBadge}>
                            №{compareIndex + 1}
                          </span>
                        )}
                        <FiBookOpen size={14} />
                        <span>{distToOld} км до Академії</span>
                      </div>
                      <div
                        className={styles.customCloseBtn}
                        onClick={() => closePopupFunc && closePopupFunc()}
                      >
                        <FiX size={18} />
                      </div>
                    </div>
                    <div className={styles.cardInternalWrapper}>
                      <ListingCard listing={listing} />
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ExploreMapPage;