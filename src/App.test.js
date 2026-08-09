import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() => new Promise(() => {}));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the MartiRent heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "MartiRent" })).toBeInTheDocument();
});

test("recovers from invalid saved phone data", () => {
  localStorage.setItem("properties", "{not valid JSON");

  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /Properties/ }));
  expect(screen.getByRole("heading", { name: "Eich" })).toBeInTheDocument();
});

test("opens a maintenance editor from property details", () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /Properties/ }));
  fireEvent.click(screen.getAllByRole("button", { name: "View Details" })[0]);
  fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

  expect(
    screen.getByRole("heading", { name: "Edit Maintenance" })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Maintenance/ })).toHaveClass("active");
});
