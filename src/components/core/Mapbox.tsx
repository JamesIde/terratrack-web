import { useAuth } from "@clerk/clerk-react";
import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Map } from "mapbox-gl";
import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { processSupabaseActivities } from "../../utils/processActivities";
import * as Turf from "@turf/turf";
import { Activity } from "../../@types/activity";

function Mapbox() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  let longlat = [138.770306, -34.97434];
  let zoom = 11;
  const mapContainer = useRef(null);
  let map: Map = {} as any;
  mapboxGL.accessToken = import.meta.env
    .VITE_REACT_APP_MAPBOX_ACCESS_KEY as string;
  useEffect(() => {
    if (isLoaded) {
      map = new mapboxGL.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v11",
        center: longlat,
        zoom: zoom,
      });
      map.addControl(new mapboxGL.NavigationControl());

      map.addControl(new mapboxGL.FullscreenControl());
      if (isSignedIn) {
        map.on("load", async () => {
          await supabase
            .from("activities")
            .select("*")
            .eq("userId", userId)
            .then((resp) => {
              let activities = processSupabaseActivities(resp.data);
              activities.map((activity, index) => {
                if (!map.getLayer(activity.id)) {
                  map.addSource(activity.id, {
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
                  map.addLayer({
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

                  map.addLayer({
                    id: `${activity.id}-fill`,
                    type: "fill",
                    source: activity.id,
                    paint: {
                      "fill-color": "transparent",
                      "fill-outline-color": "transparent",
                    },
                  });
                  map.on("mouseenter", `${activity.id}-fill`, () => {
                    map.getCanvas().style.cursor = "pointer";
                    map.setPaintProperty(activity.id, "line-width", 6);
                  });
                  map.on("mouseleave", `${activity.id}-fill`, () => {
                    map.getCanvas().style.cursor = "";
                    map.setPaintProperty(activity.id, "line-width", 4);
                  });
                  map.on("click", `${activity.id}-fill`, (ev) => {
                    flyToMap(map, activity);
                  });
                }
              });
            });
        });
      }
    }
    // return () => map.remove();
  }, [userId, isLoaded, isSignedIn]);

  function flyToMap(map: Map, activity: Activity) {
    let boundary = Turf.lineString(activity.coordinates);
    let bbox = Turf.bbox(boundary);
    map.fitBounds(bbox, {
      padding: 20,
    });
  }

  return <div ref={mapContainer} className="h-screen relative w-full" />;
}
export default Mapbox;
