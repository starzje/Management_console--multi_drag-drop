import * as React from "react";
import { render } from "@testing-library/react";
import { Spinner } from "../Spinner";
import "@testing-library/jest-dom/extend-expect";

describe("Spinner", () => {
  it("should render correctly with the spinner classname and data-testid attribute", () => {
    const { getByTestId } = render(<Spinner />);

    const spinner = getByTestId("spinner");
    expect(spinner).toBeDefined();
    expect(spinner).toHaveClass("spinner");
  });
});
