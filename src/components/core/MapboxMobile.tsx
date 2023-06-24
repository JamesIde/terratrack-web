import { LngLatLike, Map, Marker } from "mapbox-gl";
import { useEffect, useRef } from "react";
import { Activity } from "../../@types/activity";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { CONFIG } from "../../config/config";
import { addSourceAndLayer, addStartEndCircles, flyToMap } from "./MapboxUtils";
import { useMarkerStore } from "../../stores/markerStore";
import mapboxgl from "mapbox-gl";
mapboxGL.accessToken = import.meta.env
  .VITE_REACT_APP_MAPBOX_ACCESS_KEY as string;
function MapboxMobile({ activity }: { activity: Activity }) {
  const markerIndex = useMarkerStore((state) => state.markerIndex);

  const mapContainer = useRef(null);
  const map = useRef<Map>();
  const marker = useRef<Marker | null>(null);

  /**
   * Add the map to the page
   */
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
      addStartEndCircles(
        map as any,
        activity.id,
        activity.coordinates[0],
        activity.coordinates.pop()!
      );
    });
  }, [activity]);

  /**
   * Add the marker to the map
   */
  useEffect(() => {
    if (marker.current) {
      marker.current?.remove();
    }
    if (markerIndex) {
      const coords = activity?.coordinates[markerIndex!];
      marker.current = new mapboxgl.Marker()
        .setLngLat(coords as LngLatLike) // coords is just typed as Position (its fine)
        .addTo(map.current!);
    }
  }, [markerIndex]);

  return <div ref={mapContainer} className="relative h-48" />;
}
export default MapboxMobile;
