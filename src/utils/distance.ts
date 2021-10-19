const radius = 6371; // 지구 반지름(km)
const radian = Math.PI / 180;

export const calculateDistance = (
  baseCoordinate: (string | number)[],
  targetCoordinate: (string | number)[],
) => {
  const baseLat = Number(baseCoordinate[0]);
  const baseLng = Number(baseCoordinate[1]);

  const targetLat = Number(targetCoordinate[0]);
  const targetLng = Number(targetCoordinate[1]);

  const deltaLat = Math.abs(baseLat - targetLat) * radian;
  const deltaLng = Math.abs(baseLng - targetLng) * radian;

  const sinDeltaLat = Math.sin(deltaLat / 2);
  const sinDeltaLng = Math.sin(deltaLng / 2);

  const squareRoot = Math.sqrt(
    sinDeltaLat * sinDeltaLat +
      Math.cos(baseLat * radian) *
        Math.cos(targetLat * radian) *
        sinDeltaLng *
        sinDeltaLng,
  );

  const distance = 2 * radius * Math.asin(squareRoot);

  return distance;
};
