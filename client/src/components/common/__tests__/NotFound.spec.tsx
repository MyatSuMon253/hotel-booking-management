import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NotFound from "../NotFound";
import { renderWithRouter } from "@/test/helpers";

describe("NotFound", () => {
  test("renders 404 message and home link", () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Go back HomePage" }),
    ).toHaveAttribute("href", "/");
  });
});
