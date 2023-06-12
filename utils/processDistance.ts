/**
 * Convert distance in meters to a string with the correct unit
 */
export function processDistance(distance: number) {
  if (distance < 1) {
    return `${distance.toFixed(0)} meters`;
  }

  if (distance < 1000) {
    return `${distance.toFixed()} meters`;
  }

  return `${(distance / 1000).toFixed(2)} km`;
}
// See comment on processTime.ts
export function processShortDistance(distance: number) {
  if (distance < 1) {
    return `${distance.toFixed(0)}m`;
  }

  if (distance < 1000) {
    return `${distance.toFixed()}m`;
  }

  return `${(distance / 1000).toFixed(2)}km`;
}
