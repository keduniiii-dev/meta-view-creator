import { expect, it } from "vitest";
import { renameLeadCsvHeaders } from "@/lib/lead-csv";

it("renames temperature and distinguishes sales status without changing data", () => {
  expect(renameLeadCsvHeaders('Company,Status,Temperature\r\nVibely,won,hot\r\n'))
    .toBe('Company,Sales status,Status\r\nVibely,won,hot\r\n');
});
it("preserves BOM, quoted headers, embedded commas and multiline data", () => {
  const rows = '\r\n"Vibely, Inc",won,"hot\ncool"';
  expect(renameLeadCsvHeaders('\uFEFF"Company, name","status","temperature"' + rows))
    .toBe('\uFEFF"Company, name",Sales status,Status' + rows);
});
it("leaves exports without temperature unchanged", () => {
  expect(renameLeadCsvHeaders('Company,Status\nVibely,won')).toBe('Company,Status\nVibely,won');
});
