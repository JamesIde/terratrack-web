import { useAuth } from "@clerk/clerk-react";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import * as Turf from "@turf/turf"; // eslint-disable-line
import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";

function Mapbox() {
  const [storeActivity, setStoreActivity] = useActivityStore((state) => [
    state.storeActivity,
    state.setStoreActivity,
  ]);

  const { isLoaded, isSignedIn, userId } = useAuth();
  const [stateMap, setStateMap] = useState<Map>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const mapContainer = useRef(null);
  const map = useRef<Map>();

  let longlat = [138.770306, -34.97434];
  let zoom = 11;

  mapboxGL.accessToken = import.meta.env
    .VITE_REACT_APP_MAPBOX_ACCESS_KEY as string;
  useEffect(() => {
    if (isLoaded) {
      if (map.current) return;
      map.current = new mapboxGL.Map({
        container: mapContainer.current as any,
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: longlat as any,
        zoom: zoom,
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
                  map.current?.addSource(activity.id, {
                    type: "geojson",
                    data: {
                      type: "Feature",
                      geometry: {
                        type: "LineString",
                        coordinates: activity.coordinates,
                      },
                      properties: {},
                    },
                  });
                  // Add the line layer on top of the geojson source
                  map.current?.addLayer({
                    id: activity.id,
                    type: "line",
                    source: activity.id,
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": activity.metadata.color,
                      "line-width": 4,
                    },
                  });
                  map.current?.addLayer({
                    id: `${activity.id}-fill`,
                    type: "fill",
                    source: activity.id,
                    paint: {
                      "fill-color": "transparent",
                      "fill-outline-color": "transparent",
                    },
                  });
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
      flyToMap(stateMap!, storeActivity);
    } else {
      setMapLayerVisibility(null);
      stateMap?.flyTo({
        center: longlat as mapboxGL.LngLatLike,
        zoom: zoom,
        essential: true,
      });
    }
  }, [storeActivity]);

  function flyToMap(map: mapboxGL.Map, activity: Activity) {
    let boundary = Turf.lineString(activity.coordinates);
    let bbox = Turf.bbox(boundary);
    map.fitBounds(bbox, {
      padding: 20,
    });
  }

  /**
   * Toggles map layer visibility based on activityId passed in on 'click'
   */
  function setMapLayerVisibility(activityId: string | null) {
    activities.forEach((act) => {
      if (activityId) {
        // Hide all except 'clicked'
        const visibility = act.id === activityId ? "visible" : "none";
        if (map.current?.getLayer(act.id)) {
          map.current?.setLayoutProperty(act.id, "visibility", visibility);
          map.current?.setLayoutProperty(
            `${act.id}-fill`,
            "visibility",
            visibility
          );
        }
      } else {
        // Show all
        if (map.current?.getLayer(act.id)) {
          map.current?.setLayoutProperty(act.id, "visibility", "visible");
          map.current?.setLayoutProperty(
            `${act.id}-fill`,
            "visibility",
            "visible"
          );
        }
      }
    });
  }

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
