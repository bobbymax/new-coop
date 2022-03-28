export const search = (str = "", data = []) => {
  let filtered = [];
  if (str !== "" && data.length > 0) {
    filtered = data.filter((row) => {
      return Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(str.toLowerCase());
    });
  } else {
    filtered = data;
  }

  return filtered;
};

export const money = (fig) => {
  let currency = Intl.NumberFormat("en-US");
  return "NGN " + currency.format(fig);
};

export const formatConfig = (arr) => {
  const obt = {};

  if (arr.length > 0) {
    arr.forEach((el) => {
      obt[el.key] = el.value;
    });
  }

  return obt;
};

export const getRange = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export const getMonthsArr = () => {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
};

export const eligibilityCheck = (auth, amount, category) => {};
