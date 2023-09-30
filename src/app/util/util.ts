import { Number } from "./RegExp";

export function getCookie(key: string) {
  const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

// export function currencyFormat(amount: number) {
//   return "$" + (amount / 100).toFixed(2);
// }

export function currencyFormat(amount: number) {
  return amount + " تومان";
}

export const enNumberConvertor = (e: React.KeyboardEvent<HTMLDivElement>) => {
  let regex = new RegExp(Number);
  let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (regex.test(str)) return true;
  e.preventDefault();
  return false;
};
