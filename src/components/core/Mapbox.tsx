import { useAuth } from "@clerk/clerk-react";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import * as Turf from "@turf/turf"; // eslint-disable-line
import { Activity } from "../../@types/activity";
import { useActivityStore } from "../../stores/activityStore";
import { LAYER_CONFIG } from "./Paint";

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
                      properties: {
                        description: "Activity",
                      },
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
      const visibility = activityId
        ? act.id === activityId
          ? "visible"
          : "none"
        : "visible";

      map.current?.setLayoutProperty(act.id, "visibility", visibility);

      const startCircleSourceId = `${activityId}-start-circle`;
      const startCircleLayerId = `${activityId}-start`;

      const endCircleSourceId = `${activityId}-end-circle`;
      const endCircleLayerId = `${activityId}-end`;

      if (act.id === activityId) {
        setCircleLayers({
          endCircle: endCircleLayerId,
          startCircle: startCircleLayerId,
        });
        if (
          !map.current?.getSource(startCircleSourceId) &&
          !map.current?.getSource(endCircleSourceId)
        ) {
          map.current?.addSource(startCircleSourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: act.coordinates[0],
              },
              properties: {
                description: "Start Circle of a gps track",
              },
            },
          });

          map.current?.addSource(endCircleSourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: act.coordinates.pop()!,
              },
              properties: {
                description: "End Circle of a gps track",
              },
            },
          });
        }
        map.current?.addLayer({
          id: startCircleLayerId,
          type: "circle",
          source: startCircleSourceId,
          layout: {
            visibility: "visible",
          },
          paint: LAYER_CONFIG.paint.start,
        });
        map.current?.addLayer({
          id: endCircleLayerId,
          type: "circle",
          source: endCircleSourceId,
          layout: {
            visibility: "visible",
          },
          paint: LAYER_CONFIG.paint.end,
        });
      } else {
        // Show all layers
        map.current?.setLayoutProperty(
          `${act.id}-fill`,
          "visibility",
          "visible"
        );
        // Duplication of above, because we don't know which activity was previously selected, we need to re-assign for each track
        // THEN check if the layer exists, if it does, then it was the previously selected activity, so remove it + source
        const startCircleSourceId = `${act.id}-start-circle`;
        const startCircleLayerId = `${act.id}-start`;

        const endCircleSourceId = `${act.id}-end-circle`;
        const endCircleLayerId = `${act.id}-end`;
        if (
          map.current?.getLayer(startCircleLayerId) &&
          map.current?.getLayer(endCircleLayerId)
        ) {
          map.current?.removeLayer(startCircleLayerId);
          map.current?.removeLayer(endCircleLayerId);
          map.current?.removeSource(startCircleSourceId);
          map.current?.removeSource(endCircleSourceId);
        }
      }
    });
  }

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
