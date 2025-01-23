// Check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

// Check if two dates are the same month
export const isSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Check if two dates are the same year
export const isSameYear = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear();
};
