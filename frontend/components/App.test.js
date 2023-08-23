// Write your tests here
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AppClass from "./AppClass";
import AppFunctional from "./AppFunctional";

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

it("steps increase by 1", () => {
  render(<AppFunctional />);

  const h1 = screen.getByTestId("steps");
  const buttons = screen.getAllByRole("button");

  expect(h1).toBeInTheDocument();
  fireEvent.click(buttons[2]);
  expect(h1).toHaveTextContent("You moved 1 time");
});

it("renders directionalbuttons", () => {
  render(<AppFunctional />);

  const leftButton = screen.getByRole("button", { name: /left/i });
  expect(leftButton).toBeInTheDocument();

  const rightButton = screen.getByRole("button", { name: /right/i });
  expect(rightButton).toBeInTheDocument();

  const upButton = screen.getByRole("button", { name: /up/i });
  expect(upButton).toBeInTheDocument();

  const downButton = screen.getByRole("button", { name: /down/i });
  expect(downButton).toBeInTheDocument();
});

it("Coordinates update when direction buttons are clicked", () => {
  render(<AppFunctional />);

  const leftButton = screen.getAllByRole("button");
  fireEvent.click(leftButton[0]);

  const coordinates = screen.getByTestId(/coordinates/i);
  expect(coordinates).toHaveTextContent("Coordinates (1,2)");
});

it("values change when types in email input", async () => {
  render(<AppFunctional />);

  const emailInput = screen.getByPlaceholderText(/type email/i);
  fireEvent.change(emailInput, { target: { value: "abc@123.xyz" } });
  expect(emailInput).toHaveValue("abc@123.xyz");
});
