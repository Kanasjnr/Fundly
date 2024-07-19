export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  if (remainingDays <= 0) {
    return 0; // Deadline has passed, return 0 days left
  } else {
    return remainingDays.toFixed(0); // Return remaining days
  }
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  if (raisedAmount === 0) {
    return { percentage: 0, status: "ongoing" };
  } else if (raisedAmount >= goal) {
    return { percentage: 100, status: "completed" };
  } else {
    const percentage = Math.round((raisedAmount * 100) / goal);
    return { percentage, status: "ongoing" };
  }
};


export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;
  if (img.complete) callback(true);
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};