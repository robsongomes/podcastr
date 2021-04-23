export const convertDurationToTimeString = (duration: number): string => {
  const hours: number = Math.floor(duration / 3600);
  const minutes: number = Math.floor((duration % 3600) / 60);
  const seconds: number = Math.floor(duration % 60);
  const time = [hours, minutes, seconds];
  return time.map((t) => String(t).padStart(2, "0")).join(":");
};
