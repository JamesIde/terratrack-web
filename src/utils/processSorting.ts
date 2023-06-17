export function processActivitySorting(
  activities: any[],
  sort: string,
  search: string
) {
  // We could make this a lot more sophisticated, but for now, this will do.
  if (search && search.length > 0) {
    return activities.filter((activity) => {
      return activity.description.toLowerCase().includes(search.toLowerCase());
    });
  }

  if (sort === "date") {
    return activities.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  } else if (sort === "distance") {
    return activities.sort((a, b) => b.distance - a.distance);
  } else if (sort === "duration") {
    return activities.sort((a, b) => b.duration - a.duration);
  } else if (sort === "elevationGain") {
    return activities.sort(
      (a, b) => b.elevation.elevationGain - a.elevation.elevationGain
    );
  } else {
    return activities;
  }
}
