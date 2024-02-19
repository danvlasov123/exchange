export const numberValidate = (num: string) => {
  if (num.includes("00") && num.length === 2) {
    return "0";
  }
  return num;
};
