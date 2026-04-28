import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { GET_ALL_ROOMS } from "@/graphql/queries/room";
import { renderWithRouter } from "@/test/helpers";
import HomePage from "../HomePage";

const navigateMock = vi.fn();

vi.mock("react-star-ratings", () => ({
  default: () => <span data-testid="star-ratings" />,
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>(
    "react-router",
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const roomsMock: MockedResponse = {
  request: {
    query: GET_ALL_ROOMS,
    variables: {
      query: "river",
      filters: { type: "suite", isAvailable: true },
      page: 2,
    },
  },
  result: {
    data: {
      getAllRooms: {
        __typename: "RoomsWithPagination",
        pagination: {
          __typename: "PaginateType",
          perPage: 6,
          totalRoomCount: 12,
        },
        rooms: [
          {
            __typename: "Room",
            id: "room-1",
            title: "River View Suite",
            type: "suite",
            images: [
              {
                __typename: "RoomImage",
                public_id: "room-1-image",
                url: "https://example.com/room.jpg",
              },
            ],
            location: "Bagan",
            pricePerNight: 120,
            ratings: {
              __typename: "Rating",
              value: 4.5,
              count: 8,
            },
          },
        ],
      },
    },
  },
};

describe("HomePage integration", () => {
  test("loads rooms using URL search params and renders pagination", async () => {
    renderWithRouter(
      <MockedProvider mocks={[roomsMock]} addTypename>
        <HomePage />
      </MockedProvider>,
      { route: "/?filter=river&type=suite&available=true&page=2" },
    );

    expect(screen.getByText("Loading ...")).toBeInTheDocument();

    expect(await screen.findByText("River View Suite")).toBeInTheDocument();
    expect(screen.getByText("$ 120")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  test("updates navigation when a user submits a room search", async () => {
    const user = userEvent.setup();

    renderWithRouter(
      <MockedProvider mocks={[roomsMock]} addTypename>
        <HomePage />
      </MockedProvider>,
      { route: "/?filter=river&type=suite&available=true&page=2" },
    );

    await screen.findByText("River View Suite");
    navigateMock.mockClear();
    await user.type(screen.getByPlaceholderText("Type and enter to find"), "garden");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining("filter=garden"));
      expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining("type=suite"));
      expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining("available=true"));
      expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining("page=2"));
    });
  });
});
