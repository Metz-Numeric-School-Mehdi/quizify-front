const localStorageIsAvailable = () => {
  return typeof window !== "undefined" && window.localStorage;
};

export { localStorageIsAvailable };
