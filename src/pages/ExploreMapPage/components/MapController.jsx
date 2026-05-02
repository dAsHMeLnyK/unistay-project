import { useEffect } from 'react'; 
import { useMap } from 'react-leaflet'; 
import L from 'leaflet'; // Додаємо імпорт самого Leaflet для створення попапа

const MapController = ({ selectedLandmark, compareListings, mainCoord }) => { 
    const map = useMap(); 
 
    useEffect(() => { 
        if (selectedLandmark) {
            map.closePopup();

            L.popup({
                offset: [0, -10],
                className: 'custom-selected-popup'
            })
            .setLatLng(selectedLandmark.coords)
            .setContent(`<strong>${selectedLandmark.name}</strong>`)
            .openOn(map);

            if (compareListings.length === 2) { 
                const points = [ 
                    selectedLandmark.coords, 
                    ...compareListings.map(l => [l.latitude, l.longitude]) 
                ]; 
                map.fitBounds(points, { padding: [70, 70], maxZoom: 16 }); 
            } else {
                map.flyTo(selectedLandmark.coords, 16);
            }
        } else { 
            map.closePopup();
            map.setView(mainCoord, 16); 
        } 
    }, [selectedLandmark, compareListings, mainCoord, map]); 
 
    return null; 
}; 
 
export default MapController;