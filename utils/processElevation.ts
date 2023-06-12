import { ElevationMetadata } from "../@types/activity";

/**
 * Converts the array of elevation points into an object with metadata about the elevation.
 * To be used for chart + stats
 */
export function processElevation(
  elevationPoints: Array<number>
): ElevationMetadata {
  var maxElevation = Math.max(...elevationPoints);
  var minElevation = Math.min(...elevationPoints);

  var elevationGain = 0;
  for (var i = 1; i < elevationPoints.length; i++) {
    var elevationDiff = elevationPoints[i] - elevationPoints[i - 1];
    if (elevationDiff > 0) {
      elevationGain += elevationDiff;
    }
  }

  return {
    maxElevation,
    minElevation,
    elevationGain,
    elevationPoints,
  };
}

export function formatElevation(elevation: number) {
  return elevation.toFixed(0) + "m";
}
