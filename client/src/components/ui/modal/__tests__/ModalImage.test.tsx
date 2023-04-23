import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { ModalImage } from "../ModalImage";
// Import "@testing-library/jest-dom/extend-expect" to extend Jest's `expect` function with additional matchers.
import "@testing-library/jest-dom/extend-expect";
// Import the custom hooks used in the `ModalImage` component.
import * as hooks from "../../../../hooks";
import { renderWithReduxStore } from "../__testUtils__/reduxTestWrapper";
// Mock the hooks module to control their return values during testing.
jest.mock("../../../../hooks");

// Destructure the hooks from the mocked module for easier usage.
const { useImageDisplay, useImageUploader } = hooks;

// Start the test suite for the "ModalImage component". (describe = grouping test suits / it = testing individual components: https://stackoverflow.com/questions/32055287/what-is-the-difference-between-describe-and-it-in-jest )
describe("ModalImage component", () => {
  // `beforeEach` block runs before each test case in this test suite. It sets up the mock return values for `useImageDisplay` and `useImageUploader`.
  beforeEach(() => {
    (useImageDisplay as jest.Mock).mockReturnValue({
      imageUrl: "testImageUrl",
      handleError: jest.fn(), // jest mocks the function to become a dummy function that jest can
    });

    (useImageUploader as jest.Mock).mockReturnValue({
      handleImageChange: jest.fn(),
      loading: false,
      handleCloseModal: jest.fn(),
      isImageUploaded: false,
    });
  });

  // Test case: "renders without crashing"
  it("renders without crashing", () => {
    // Renders the `ModalImage` component wrapped in a Redux `Provider`.
    renderWithReduxStore(<ModalImage />);
    // Expects the component to render an image element with the "Preview" alt text.
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
  });

  // Test case: "renders Spinner when loading is true"
  it("renders Spinner when loading is true", () => {
    // Updates the mocked `useImageUploader` to have a `loading` value of `true`.
    (useImageUploader as jest.Mock).mockReturnValue({
      handleImageChange: jest.fn(),
      loading: true,
      handleCloseModal: jest.fn(),
      isImageUploaded: false,
    });

    // Renders the `ModalImage` component wrapped in a Redux `Provider`.
    renderWithReduxStore(<ModalImage />);
    // Expects the component to render a Spinner element.
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  // Test case: "handles image change"
  it("handles image change", () => {
    const handleImageChange = jest.fn();
    (useImageUploader as jest.Mock).mockReturnValue({
      handleImageChange,
      loading: false,
      handleCloseModal: jest.fn(),
      isImageUploaded: false,
    });

    // Renders the `ModalImage` component wrapped in a Redux `Provider`.
    renderWithReduxStore(<ModalImage />);
    // Simulates a change event on the file input element.
    const input = screen.getByLabelText(/odaberi novu sliku/i);
    fireEvent.change(input, { target: { files: ["image.jpg"] } });
    expect(handleImageChange).toHaveBeenCalled();
  });

  it("handles closing the modal", () => {
    const handleCloseModal = jest.fn();
    (useImageUploader as jest.Mock).mockReturnValue({
      handleImageChange: jest.fn(),
      loading: false,
      handleCloseModal,
      isImageUploaded: true,
    });

    renderWithReduxStore(<ModalImage />);
    const closeButton = screen.getByText(/u redu/i);
    fireEvent.click(closeButton);
    expect(handleCloseModal).toHaveBeenCalled();
  });

  it("removes the button and displays new label when the image is uploaded", () => {
    (useImageUploader as jest.Mock).mockReturnValue({
      handleImageChange: jest.fn(),
      loading: false,
      handleCloseModal: jest.fn(),
      isImageUploaded: true,
    });

    renderWithReduxStore(<ModalImage />);
    expect(screen.queryByText("Odaberi novu sliku")).toBeNull();
    expect(screen.getByText(/u redu/i)).toBeInTheDocument();
  });

  it("displays the correct text in modal-image__info when the image is not uploaded", () => {
    renderWithReduxStore(<ModalImage />);

    expect(screen.getByText("Slika mora biti JPEG formata široke 540px i visoke 450px")).toBeInTheDocument();
  });

  it("triggers the handleError function on image error", () => {
    const handleError = jest.fn();
    (useImageDisplay as jest.Mock).mockReturnValue({
      imageUrl: "testImageUrl",
      handleError,
    });

    renderWithReduxStore(<ModalImage />);
    const image = screen.getByAltText("Preview");
    fireEvent.error(image);
    expect(handleError).toHaveBeenCalled();
  });
});
