"use client";
import { useEffect, useRef } from "react";
import { CONFIG } from "../../../config/config";
import mapboxGL from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
function Mapbox() {
  let longlat = [138.778, -35.054];
  let zoom = 13;
  const mapContainer = useRef(null);
  mapboxGL.accessToken = CONFIG.MAPBOX.ACCESS_TOKEN as string;
  // console.log(CONFIG.MAPBOX.ACCESS_TOKEN);
  useEffect(() => {
    const map: Map = new mapboxGL.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: longlat,
      zoom: zoom,
    });
    map.addControl(new mapboxGL.NavigationControl());

    map.addControl(new mapboxGL.FullscreenControl());
    map.on("move", () => {
      console.log(
        map.getCenter().lat + " " + map.getCenter().lng + " " + map.getZoom()
      );
    });
  }, []);

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
