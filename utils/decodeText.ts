const entityMap: { [key: string]: string } = {
  '&#39;': "'",
  '&quot;': '"',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
};

export const decodeHtmlEntities = (text: string): string => {
  return text.replace(
    /&#39;|&quot;|&amp;|&lt;|&gt;/g,
    (match) => entityMap[match] || match
  );
};

export const decodeText = (text: string): string => {
  return decodeHtmlEntities(decodeURIComponent(text));
};
