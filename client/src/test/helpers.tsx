import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export const renderWithRouter = (
  ui: ReactElement,
  { route = "/" }: { route?: string } = {},
) => {
  window.history.pushState({}, "Test page", route);

  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};
