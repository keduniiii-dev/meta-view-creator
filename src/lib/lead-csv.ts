// Change display headers only; preserve every exported data row verbatim.
export function renameLeadCsvHeaders(csv: string): string {
  const bom = csv.startsWith("\uFEFF") ? "\uFEFF" : "";
  const text = csv.slice(bom.length);
  const fields: string[] = [];
  let quoted = false;
  let start = 0;
  let end = text.length;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"') {
      if (quoted && text[i + 1] === '"') { i++; continue; }
      quoted = !quoted;
    } else if (!quoted && text[i] === ",") {
      fields.push(text.slice(start, i));
      start = i + 1;
    } else if (!quoted && (text[i] === "\r" || text[i] === "\n")) {
      end = i;
      break;
    }
  }
  if (quoted) return csv;
  fields.push(text.slice(start, end));
  const name = (field: string) => field.trim().replace(/^"|"$/g, "").replace(/""/g, '"').trim().toLowerCase();
  if (!fields.some(field => name(field) === "temperature")) return csv;
  return bom + fields.map(field => {
    if (name(field) === "temperature") return "Status";
    if (name(field) === "status") return "Sales status";
    return field;
  }).join(",") + text.slice(end);
}
