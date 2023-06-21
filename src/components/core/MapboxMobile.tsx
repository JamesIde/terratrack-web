import { Map } from "mapbox-gl";
import { useEffect, useRef } from "react";
import { Activity } from "../../@types/activity";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { CONFIG } from "../../config/config";
import { addSourceAndLayer, flyToMap } from "./MapboxUtils";
mapboxGL.accessToken = import.meta.env
  .VITE_REACT_APP_MAPBOX_ACCESS_KEY as string;
function MapboxMobile({ activity }: { activity: Activity }) {
  const mapContainer = useRef(null);
  const map = useRef<Map>();
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxGL.Map({
      container: mapContainer.current as any,
      style: CONFIG.MAP.MAP_URL,
      center: CONFIG.MAP.MAP_DEFAULT_COORDS as any,
      zoom: CONFIG.MAP.MAP_DEFAULT_ZOOM,
    });
    map.current.addControl(new mapboxGL.NavigationControl());

    map.current.addControl(new mapboxGL.FullscreenControl());
    map.current.on("load", () => {
      addSourceAndLayer(map.current as Map, activity);
      flyToMap(map.current as Map, activity, 10);
    });
  }, [activity]);

  return <div ref={mapContainer} className="relative h-48" />;
}
export default MapboxMobile;
