const convertUTCtoKST = (date: string) => {
  const startTimeUTC = new Date(date);
  const startTimeKST = new Date(startTimeUTC.getTime() + 9 * 60 * 60 * 1000);

  const dateKST = startTimeKST.toISOString().split('T')[0]; // YYYY-MM-DD

  const startTimeFormatted = startTimeUTC
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Seoul',
    })
    .replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$3. $1. $2'); // MM/DD/YYYY → YYYY. MM. DD 00:00 AM

  return { dateKST: dateKST, startTimeKST: `${startTimeFormatted} KST` };
};

export default convertUTCtoKST;
