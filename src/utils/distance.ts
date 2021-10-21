import { ICoordinate } from '../types/Ride';

const radius = 6371; // 지구 반지름(km)
const radian = Math.PI / 180;

export const calculateDistance = (
  baseCoordinate: ICoordinate,
  targetCoordinate: ICoordinate,
) => {
  const baseLat = baseCoordinate.lat;
  const baseLng = baseCoordinate.lng;

  const targetLat = targetCoordinate.lat;
  const targetLng = targetCoordinate.lng;

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

  return 2 * radius * Math.asin(squareRoot);
};
