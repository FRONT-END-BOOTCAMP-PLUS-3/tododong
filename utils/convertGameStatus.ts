const convertGameStatus = (status: string) => {
  switch (status) {
    case '1':
      return 'scheduled';
    case '2':
      return 'live';
    case '3':
      return 'final';
    default:
      return '';
  }
};

export default convertGameStatus;
