import { useAuth } from "@clerk/clerk-react";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import * as Turf from "@turf/turf";
import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";

function Mapbox() {
  const [storeActivity, setStoreActivity] = useActivityStore((state) => [
    state.storeActivity,
    state.setStoreActivity,
  ]);

  const { isLoaded, isSignedIn, userId } = useAuth();
  const [stateMap, setStateMap] = useState<Map>();

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
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: longlat,
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
              activities.map((activity, index) => {
                if (!map.current?.getLayer(activity.id)) {
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
                  map.current?.on("click", `${activity.id}-fill`, (ev) => {
                    flyToMap(map.current!, activity);
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
      flyToMap(stateMap!, storeActivity);
    } else {
      resetMapBounds();
    }
  }, [storeActivity]);

  function flyToMap(map: mapboxGL.Map, activity: Activity) {
    let boundary = Turf.lineString(activity.coordinates);
    let bbox = Turf.bbox(boundary);
    map.fitBounds(bbox, {
      padding: 20,
    });
  }

  function resetMapBounds() {
    map.current?.fitBounds(
      [
        // TODO - fix this
        [138.770306, -34.97434],
        [138.770306, -34.97434],
      ],
      {
        padding: 20,
        zoom: 11,
      }
    );
  }

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
