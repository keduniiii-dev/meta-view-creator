import { useState } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { OutreachField, OutreachForm } from "@/crm/components/OutreachForm";
import { Button } from "@/components/ui/button";

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: vi.fn() });
Object.defineProperty(HTMLElement.prototype, "hasPointerCapture", { configurable: true, value: () => false });
Object.defineProperty(HTMLElement.prototype, "releasePointerCapture", { configurable: true, value: vi.fn() });
afterEach(cleanup);
function Harness({ submit }: { submit: (value: string) => void }) {
  const [value, setValue] = useState("2026-09-13T09:00");
  return <OutreachForm onSubmit={() => submit(value)}><OutreachField name="date" label="Follow-up time" required dateTime value={value} onChange={setValue} /><Button type="submit">Save</Button></OutreachForm>;
}
it("uses a shadcn calendar and time selects without submitting until Save", async () => {
  const submit = vi.fn();
  render(<Harness submit={submit} />);
  expect(screen.getByLabelText("Follow-up time")).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: "Choose date and time for Follow-up time" }));
  fireEvent.click(screen.getByRole("button", { name: "15" }));
  fireEvent.keyDown(screen.getByRole("combobox", { name: "Follow-up time hour" }), { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: "14" }));
  fireEvent.keyDown(screen.getByRole("combobox", { name: "Follow-up time minute" }), { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: "45" }));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.getByLabelText("Follow-up time")).toHaveValue("2026-09-15 14:45");
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  await waitFor(() => expect(submit).toHaveBeenCalledWith("2026-09-15T14:45"));
});
it("shows an inline shadcn validation error for an invalid typed date", async () => {
  const submit = vi.fn();
  render(<Harness submit={submit} />);
  fireEvent.change(screen.getByLabelText("Follow-up time"), { target: { value: "2026-02-30 10:00" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Choose a valid date and time");
  expect(screen.getByLabelText("Follow-up time")).toHaveAttribute("aria-invalid", "true");
  expect(submit).not.toHaveBeenCalled();
});
