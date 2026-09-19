import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import BidEditor from "@/crm/components/BidEditor";
import type { Bid } from "@/lib/types";
const { create, update } = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }));
vi.mock("@/hooks/use-bids", () => ({
  useCreateBid: () => ({ mutate: create, isPending: false }),
  useUpdateBid: () => ({ mutate: update, isPending: false }),
}));
it.each([["", null], ["0", 0]])("saves amount %s without changing the linked lead", (input, expected) => {
  update.mockClear();
  const bid = { id: "bid1", lead_id: "lead1", project: "Tower", client: "Client", phase: "RFP Review", deadline: "2027-01-01", value: 42, suppliers: ["A"], status: "Active" } as Bid;
  const view = render(<BidEditor bid={bid} onClose={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Bid amount (USD)"), { target: { value: input } });
  fireEvent.click(screen.getByRole("button", { name: "Save bid" }));
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: "bid1", lead_id: "lead1", value: expected }), expect.any(Object));
  expect(create).not.toHaveBeenCalled();
  view.unmount();
});
