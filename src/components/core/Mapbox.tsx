import { useAuth } from "@clerk/clerk-react";
import mapboxGL, { LngLatLike, Marker } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";
import { useMarkerStore } from "../../stores/markerStore";
import { CONFIG } from "../../config/config";
import {
  addGpxSourcesAndLayers,
  addStartEndCircles,
  flyToMap,
  hideStartEndCircles,
} from "./MapboxUtils";
import mapboxgl from "mapbox-gl";

function Mapbox({ mViewActivity }: { mViewActivity?: Activity }) {
  const [storeActivity, setStoreActivity] = useActivityStore((state) => [
    state.storeActivity,
    state.setStoreActivity,
  ]);

  const markerIndex = useMarkerStore((state) => state.markerIndex);

  const { isLoaded, isSignedIn, userId } = useAuth();
  const [stateMap, setStateMap] = useState<any>();
  const [activities, setActivities] = useState<Activity[]>([]);

  const mapContainer = useRef(null);
  const map = useRef<Map>();
  const marker = useRef<Marker | null>(null);
  let longlat = [138.770306, -34.97434];
  let zoom = 11;

  mapboxGL.accessToken = import.meta.env
    .VITE_REACT_APP_MAPBOX_ACCESS_KEY as string;
  useEffect(() => {
    if (isLoaded) {
      if (map.current) return;
      map.current = new mapboxGL.Map({
        container: mapContainer.current as any,
        style: CONFIG.MAP.MAP_URL,
        center: CONFIG.MAP.MAP_DEFAULT_COORDS as any,
        zoom: CONFIG.MAP.MAP_DEFAULT_ZOOM,
      });
      map.current.addControl(new mapboxGL.NavigationControl());

      map.current.addControl(new mapboxGL.FullscreenControl());
      if (isSignedIn) {
        map.current.on("load", async () => {
          await supabase
            .from("activities")
            .select("*")
            .eq("userId", userId)
            .then((resp) => {
              let activities = processSupabaseActivities(resp.data);
              // Set in state, but don't use them to render the map
              setActivities(activities);
              activities.map((activity) => {
                if (!map.current?.getLayer(activity.id)) {
                  // Add the geojson source of each activity
                  addGpxSourcesAndLayers(map, activity);
                  map.current?.on("mouseenter", `${activity.id}-fill`, () => {
                    map.current!.getCanvas().style.cursor = "pointer";
                    map.current?.setPaintProperty(activity.id, "line-width", 6);
                  });
                  map.current?.on("mouseleave", `${activity.id}-fill`, () => {
                    map.current!.getCanvas().style.cursor = "";
                    map.current!.setPaintProperty(activity.id, "line-width", 4);
                  });
                  map.current?.on("click", `${activity.id}`, () => {
                    if (!storeActivity) {
                      setStoreActivity(activity);
                    }
                  });
                }
              });
            });
        });
      }
      setStateMap(map.current);
      return () => map.current?.remove();
    }
  }, [userId, isLoaded, isSignedIn]);

  useEffect(() => {
    if (storeActivity) {
      setMapLayerVisibility(storeActivity.id);
      flyToMap(stateMap!, storeActivity, 20);
    } else if (mViewActivity) {
      setMapLayerVisibility(mViewActivity.id);
      flyToMap(stateMap!, mViewActivity, 20);
    } else {
      setMapLayerVisibility(null);
      stateMap?.flyTo({
        center: longlat as mapboxGL.LngLatLike,
        zoom: zoom,
        essential: true,
      });
      if (marker.current) {
        marker.current?.remove();
      }
    }
  }, [storeActivity]);

  useEffect(() => {
    if (marker.current) {
      marker.current?.remove();
    }
    if (markerIndex) {
      const coords = storeActivity?.coordinates[markerIndex!];
      marker.current = new mapboxgl.Marker()
        .setLngLat(coords as LngLatLike)
        .addTo(map.current!);
    }
  }, [markerIndex]);

  /**
   * Toggles map layer visibility based on activityId passed in on 'click'
   */
  function setMapLayerVisibility(activityId: string | null) {
    activities.forEach((act) => {
      const visibility = activityId
        ? act.id === activityId
          ? "visible"
          : "none"
        : "visible";

      map.current?.setLayoutProperty(act.id, "visibility", visibility);

      if (act.id === activityId) {
        addStartEndCircles(
          map as any,
          act.id,
          act.coordinates[0],
          act.coordinates.pop()!
        );
      } else {
        hideStartEndCircles(map as any, act.id);
      }
    });
  }

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
