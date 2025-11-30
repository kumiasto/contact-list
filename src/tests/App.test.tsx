import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { useFetchPersons } from "../hooks/useFetchPersons";
import mockData from "src/mockData.json";

Element.prototype.scrollIntoView = jest.fn();

jest.mock("../hooks/useFetchPersons", () => ({
  useFetchPersons: jest.fn(() => ({
    data: [],
    error: "",
    resetError: jest.fn(),
    loadMore: jest.fn(),
    isLoading: false,
  })),
}));

describe("App", () => {
  beforeEach(() => {
    (useFetchPersons as jest.Mock).mockReturnValue({
      data: mockData,
      error: "",
      resetError: jest.fn(),
      loadMore: jest.fn(),
      isLoading: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render app correctly", () => {
    render(<App />);

    expect(screen.getByText("Selected contacts: 0")).toBeInTheDocument();
  });

  it("should display load more button when data is present", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: /load more/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should not display load more button when data is empty", () => {
    (useFetchPersons as jest.Mock).mockReturnValue({
      data: [],
      error: "",
      resetError: jest.fn(),
      loadMore: jest.fn(),
      isLoading: false,
    });

    render(<App />);

    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  it("should display error notification when error ocurs", () => {
    (useFetchPersons as jest.Mock).mockReturnValue({
      data: mockData,
      error: "Error text",
      resetError: jest.fn(),
      loadMore: jest.fn(),
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByText("Error text")).toBeInTheDocument();
  });
  it("should close error when close button is clicked", async () => {
    const user = userEvent.setup();
    const resetError = jest.fn();

    (useFetchPersons as jest.Mock).mockReturnValue({
      data: mockData,
      error: "Error text",
      resetError,
      loadMore: jest.fn(),
      isLoading: false,
    });

    render(<App />);
    const closeButton = screen.getByRole("button", {
      name: /close error message/i,
    });

    await user.click(closeButton);

    expect(resetError).toHaveBeenCalledTimes(1);
  });
  it("should select and deselect contacts", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Selected contacts: 0")).toBeInTheDocument();

    const firstContact = screen
      .getByText(mockData[0].firstNameLastName)
      .closest("div");

    if (firstContact) {
      await user.click(firstContact);
    }

    expect(screen.getByText("Selected contacts: 1")).toBeInTheDocument();

    if (firstContact) {
      await user.click(firstContact);
    }
    expect(screen.getByText("Selected contacts: 0")).toBeInTheDocument();
  });

  it("should disable button and show loader when loading", () => {
    (useFetchPersons as jest.Mock).mockReturnValue({
      data: mockData,
      error: "",
      resetError: jest.fn(),
      loadMore: jest.fn(),
      isLoading: true,
    });

    const { container } = render(<App />);

    const button = screen.getByRole("button", { name: /load more/i });
    expect(button).toBeDisabled();
    expect(container.querySelector(".loader")).toBeInTheDocument();
  });
  it("should call loadMore when button is clicked", async () => {
    const user = userEvent.setup();
    const loadMore = jest.fn();

    (useFetchPersons as jest.Mock).mockReturnValue({
      data: mockData,
      error: "",
      resetError: jest.fn(),
      loadMore,
      isLoading: false,
    });

    render(<App />);
    const button = screen.getByRole("button", { name: /load more/i });
    await user.click(button);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });
  it("should select multiple contacts", async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstContact = screen
      .getByText(mockData[0].firstNameLastName)
      .closest("div");
    const secondContact = screen
      .getByText(mockData[1].firstNameLastName)
      .closest("div");

    if (firstContact) await user.click(firstContact);
    if (secondContact) await user.click(secondContact);

    expect(screen.getByText("Selected contacts: 2")).toBeInTheDocument();
  });
});
