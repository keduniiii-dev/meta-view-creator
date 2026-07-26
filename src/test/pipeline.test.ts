import { describe, expect, it } from "vitest";
import { getPipelineData } from "@/lib/pipeline";

describe("getPipelineData", () => {
  it("returns a structured pipeline payload with bids and projects", () => {
    const pipeline = getPipelineData();

    expect(pipeline.bids).toHaveLength(2);
    expect(pipeline.projects).toHaveLength(2);
    expect(pipeline.bids[0]).toMatchObject({
      project: "Northwind Retail Expansion",
      phase: "RFP Review",
    });
    expect(pipeline.projects[0]).toMatchObject({
      project: "Contoso HQ Visualisation",
      uses_3d: true,
    });
  });
});
