export function isValidBDPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/.test(cleaned);
}

export function formatPhoneForBD(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("01") && cleaned.length === 11) {
    return `+880${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("+880") && cleaned.length === 14) {
    return cleaned;
  }
  return phone;
}
