import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useConfirmation } from "@/hooks/use-confirmation";
import SupplierManager from "@/crm/components/SupplierManager";

vi.mock("@/hooks/use-suppliers", () => ({
  useSuppliers: (page: number) => ({ isSuccess: true, data: { suppliers: [], pagination: { page, pages: 2, total: 21 } } }),
  useLinkSupplier: () => ({ isPending: false }),
  useSaveSupplier: () => ({ isPending: false }),
}));

it("requires explicit confirmation and supports cancellation", async () => {
  const action = vi.fn();
  function Harness() {
    const { confirm, confirmation } = useConfirmation();
    return <><button onClick={async () => { if (await confirm("Delete test record?")) action(); }}>Delete</button>{confirmation}</>;
  }
  const view = render(<Harness />);
  fireEvent.click(screen.getByText("Delete"));
  expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Cancel"));
  expect(action).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Delete"));
  fireEvent.click(screen.getByText("Confirm"));
  await waitFor(() => expect(action).toHaveBeenCalledOnce());
  view.unmount();
});

it("navigates supplier pages and indicates the current page", () => {
  const view = render(<SupplierManager bids={[]} onClose={vi.fn()} />);
  expect(screen.getByText("Page 1 of 2 · 21 suppliers")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Page 2 of 2 · 21 suppliers")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByText("Page 1 of 2 · 21 suppliers")).toBeInTheDocument();
  view.unmount();
});
