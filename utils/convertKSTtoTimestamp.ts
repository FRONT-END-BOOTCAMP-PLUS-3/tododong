const convertKSTtoTime = (KSTdate: string) => {
  const formattedDate = KSTdate.replace(
    /(\d{4})\.\s*(\d{2})\.\s*(\d{2})/,
    '$1-$2-$3'
  ) // YYYY. MM. DD → YYYY-MM-DD
    .replace(/\s*AM|\s*PM/, '') // AM/PM 제거 (24시간제로 변환)
    .replace('KST', '+09:00'); // KST → +09:00

  return new Date(formattedDate).getTime();
};

export default convertKSTtoTime;
