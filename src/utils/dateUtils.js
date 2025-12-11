/**
 * Calculate how many days ago a date was
 * @param {string} dateString - ISO date string
 * @returns {number} - Number of days ago
 */
export function getDaysAgo(dateString) {
  const commentDate = new Date(dateString);
  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - commentDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
}

/**
 * Format date to display (e.g., "5 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted string
 */
export function formatDaysAgo(dateString) {
  const days = getDaysAgo(dateString);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
