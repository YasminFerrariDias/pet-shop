export const TIME_OPTION = (() => {
  const times = [];
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 21 && minute > 0) break;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times.filter((time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return (
      (hour >= 9 && hour < 12) ||
      (hour >= 13 && hour < 18) ||
      (hour >= 19 && hour < 21)
    );
  });
})();
