import mapboxGL from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Activity, Position } from "../../@types/activity";
import * as Turf from "@turf/turf"; // eslint-disable-line
import { CONFIG } from "../../config/config";

// ####################### //
// # Common Mapbox Utils # //
// ####################### //

/**
 * Converts the activity coordinates into a Turf.js LineString
 * and then uses Turf.js to calculate the bounding box of the
 * activity. The map is then panned and zoomed to fit the
 * activity into the viewport.
 */
export function flyToMap(
  map: mapboxGL.Map,
  activity: Activity,
  padding: number
) {
  let boundary = Turf.lineString(activity.coordinates);
  let bbox = Turf.bbox(boundary);
  map.fitBounds(bbox, {
    padding: padding,
  });
}

/**
 * Adds the activity as a source and layer to the map.
 */
export function addSourceAndLayer(map: mapboxGL.Map, activity: Activity) {
  map.addSource(activity.id, {
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
}

/**
 * Adds green and red marker for start/end of activity
 */
export function addStartEndCircles(
  map: any,
  id: string,
  startCoord: Position,
  endCoord: Position
) {
  const startCircleSourceId = `${id}-start-circle`;
  const startCircleLayerId = `${id}-start`;

  const endCircleSourceId = `${id}-end-circle`;
  const endCircleLayerId = `${id}-end`;

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
          coordinates: startCoord,
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
          coordinates: endCoord,
        },
        properties: {
          description: "End Circle of a gps track",
        },
      },
    });

    map.current?.addLayer({
      id: startCircleLayerId,
      type: "circle",
      source: startCircleSourceId,
      layout: {
        visibility: "visible",
      },
      paint: CONFIG.PAINT.START,
    });
    map.current?.addLayer({
      id: endCircleLayerId,
      type: "circle",
      source: endCircleSourceId,
      layout: {
        visibility: "visible",
      },
      paint: CONFIG.PAINT.END,
    });
  }
}

/**
 * To remove start/end layers if the selected activity is deselected
 */
export function hideStartEndCircles(map: any, id: string) {
  map.current?.setLayoutProperty(`${id}-fill`, "visibility", "visible");
  const startCircleSourceId = `${id}-start-circle`;
  const startCircleLayerId = `${id}-start`;

  const endCircleSourceId = `${id}-end-circle`;
  const endCircleLayerId = `${id}-end`;
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

/**
 * Plots a GPX file on the map.
 * The source is the array of coordinates
 * The line layer is plotted on top of the source
 */
export function addGpxSourcesAndLayers(map: any, activity: Activity) {
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
}
