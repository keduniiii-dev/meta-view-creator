import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ProjectEditor from "@/crm/components/ProjectEditor";
import type { Project } from "@/lib/types";
vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
const { create, update } = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn() }));
vi.mock("@/hooks/use-projects", () => ({
  useCreateProject: () => ({ mutate: create, isPending: false }),
  useUpdateProject: () => ({ mutate: update, isPending: false }),
}));
it("saves edited project details including zero progress and supplier names", () => {
  const project = { id: "p1", project: "Tower", client: "Client", start_date: "2026-01-01", end_date: "2027-01-01", progress: 42, suppliers: ["A"], uses_3d: true, competitor: null, issue: null } as Project;
  const view = render(<ProjectEditor project={project} onClose={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Progress (%)"), { target: { value: "0" } });
  fireEvent.change(screen.getByLabelText("Suppliers"), { target: { value: "A\nB\nA" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: "p1", progress: 0, suppliers: ["A", "B"], start_date: "2026-01-01" }), expect.any(Object));
  expect(create).not.toHaveBeenCalled();
  view.unmount();
});
it("requires dates before creating a project", () => {
  const view = render(<ProjectEditor project={null} onClose={vi.fn()} />);
  fireEvent.change(screen.getByLabelText("Project name"), { target: { value: "Tower" } });
  fireEvent.change(screen.getByLabelText("Client"), { target: { value: "Client" } });
  fireEvent.click(screen.getByRole("button", { name: "Create project" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Choose both dates");
  expect(create).not.toHaveBeenCalled();
  view.unmount();
});
