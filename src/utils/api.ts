export const API_URL =
  process.env.REACT_APP_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL;
