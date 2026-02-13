import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapController = ({ selectedLandmark, compareListings, mainCoord }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedLandmark && compareListings.length === 2) {
            const points = [
                selectedLandmark.coords,
                ...compareListings.map(l => [l.latitude, l.longitude])
            ];
            map.fitBounds(points, { padding: [70, 70], maxZoom: 16 });
        } else {
            map.setView(mainCoord, 16);
        }
    }, [selectedLandmark, compareListings, mainCoord, map]);

    return null;
};

export default MapController;