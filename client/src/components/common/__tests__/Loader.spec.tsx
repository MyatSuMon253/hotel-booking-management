import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Loader from "../Loader";

describe("Loader", () => {
  test("renders loading spinner container", () => {
    const { container } = render(<Loader />);

    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.firstChild).toHaveClass("fixed");
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
