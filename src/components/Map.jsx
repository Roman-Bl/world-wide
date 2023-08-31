import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const { cities } = useCities();
  const {
    position: positionGeo,
    isLoading: isLoadingGeo,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
      console.log(`in effect`);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (positionGeo) setMapPosition([positionGeo.lat, positionGeo.lng]);
    },
    [positionGeo]
  );

  console.log(`render`);
  return (
    <div className={styles.mapContainer}>
      {!positionGeo && (
        <Button type="position" onClick={getPosition}>
          {isLoadingGeo ? `Loading...` : `Use your position`}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={7}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {/* include our custom component to center the map on our city */}
        <CenterCity position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// custom component to make this component Reactive and center the map on city coordinate
function CenterCity({ position }) {
  // getting current instance of the map form custom leaflet hook
  const map = useMap();
  // set view to custom position
  map.setView(position);
  // since we must return some JSX in any component - we return null
  return null;
}

// custom component to handle click on the map - as default components don`t have onclick prop
function DetectClick() {
  const navigate = useNavigate();
  // one more leaflet hook
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}

export default Map;
