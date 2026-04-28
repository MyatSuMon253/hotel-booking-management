import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import Pagination from "../Pagination";
import { renderWithRouter } from "@/test/helpers";

const navigateMock = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Pagination", () => {
  test("renders page controls from room count", () => {
    renderWithRouter(<Pagination totalRoomCount={12} perPage={5} />, {
      route: "/rooms?page=1",
    });

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  test("navigates to selected page", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Pagination totalRoomCount={12} perPage={5} />, {
      route: "/rooms?page=1",
    });

    await user.click(screen.getByText("2"));

    expect(navigateMock).toHaveBeenCalledWith("/rooms?page=2");
  });
});
