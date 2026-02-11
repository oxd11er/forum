const patterns = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(?:\+7|8)\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}/,
  /\b\d{4}\s?\d{6}\b/, // passport rough
  /\b\d{3}-\d{3}-\d{3}\s\d{2}\b/, // SNILS
  /\b\d{10}|\d{12}\b/, // INN
  /(улица|ул\.|проспект|пр-т|дом|квартира|street|st\.)\s+[\p{L}\d\-. ]+/iu,
  /(vk\.com|ok\.ru|facebook\.com|instagram\.com)\/[\w.]+/i
];

const violenceKeywords = /(kill|lynch|attack|burn|убить|избить|сжечь)/i;

export function hasPersonalData(text: string): boolean {
  return patterns.some((p) => p.test(text));
}

export function hasViolenceCall(text: string): boolean {
  return violenceKeywords.test(text);
}
