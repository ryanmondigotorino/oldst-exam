export const formatMoney = (amount) => {
  const parserNum1 = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(0))).toString();
  const parserCond = parserNum1.length > 3 ? parserNum1.length % 3 : 0;
  return (
    (parserCond ? parserNum1.substr(0, parserCond) + ',' : '')
    + parserNum1.substr(parserCond).replace(/(\d{3})(?=\d)/g, `$1${','}`)
    + (0
      ? '.'
        + Math.abs(amount - Number(parserNum1))
          .toFixed(0)
          .slice(2)
      : '')
  );
};


export const formatDate = (dateParams) => {
  const createdDate = new Date(dateParams);
  const currentDate = new Date();

  const calculateDate   = Math.round((currentDate - createdDate) / (1000 * 60 * 60 * 24));

  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  if (calculateDate > 7) {
    return createdDate.toLocaleDateString(undefined, options)
  }
  return `${calculateDate} day${calculateDate > 1 ? 's' : ''} ago`;
};
