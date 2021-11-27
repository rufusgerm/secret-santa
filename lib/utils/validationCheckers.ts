type parsedReturn = {
  parsedId: number;
  isIdValid: boolean;
};

export const parseQueryString = (id: string | string[]): parsedReturn => {
  const parsedId = parseInt(id as string);
  const isIdValid = !isNaN(parsedId);
  return { parsedId: isIdValid ? parsedId : -1, isIdValid };
};

export const isValidObject = (obj: Object | undefined): boolean => {
  return obj !== undefined && JSON.stringify(obj) !== "{}";
};
