import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamsView from "./TeamsView";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the common Modal component so we can test TeamsView inside standard Jest environment
jest.mock("../common/Modal", () => ({
  __esModule: true,
  default: function MockModal({ isOpen, children, title }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        {children}
      </div>
    );
  },
}));

describe("TeamsView Component", () => {
  const mockProps = {
    teams: [
      {
        id: "t1",
        name: "Thunder Cats",
        block: "AN",
        logoUrl: "https://cats.com/logo.png",
        captainName: "James Carter",
        captainUrl: "https://cats.com/james.png",
        viceCaptainName: "Lily Moore",
        viceCaptainUrl: "https://cats.com/lily.png",
        // participantCount: 12,
        dateCreated: "Jun 10, 2026",
        email: "contact@thundercats.org",
      },
      {
        id: "t2",
        name: "Solar Flares",
        block: "KH",
        logoUrl: "https://flares.com/logo.png",
        captainName: "Zara Ali",
        captainUrl: "https://flares.com/zara.png",
        viceCaptainName: "Leo Fritz",
        viceCaptainUrl: "https://flares.com/leo.png",
        // participantCount: 8,
        dateCreated: "Jun 11, 2525",
        email: "solar@flares.org",
      },
    ],
    onAddTeam: jest.fn(),
    onUpdateTeam: jest.fn(),
    onDeleteTeam: jest.fn(),
    triggerToast: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders team directory list entries correctly", () => {
    render(<TeamsView {...mockProps} />);

    expect(screen.getByText("Community Teams Register")).toBeInTheDocument();

    // Team Names
    expect(screen.getByText("Thunder Cats")).toBeInTheDocument();
    expect(screen.getByText("Solar Flares")).toBeInTheDocument();

    // Block values
    expect(screen.getByText("AN")).toBeInTheDocument();
    expect(screen.getByText("KH")).toBeInTheDocument();

    // Captain Names
    expect(screen.getByText("James Carter")).toBeInTheDocument();
    expect(screen.getByText("Zara Ali")).toBeInTheDocument();

    // Participant counter badges
    expect(screen.getByText("12 members")).toBeInTheDocument();
    expect(screen.getByText("8 members")).toBeInTheDocument();
  });

  it("filters based on searched keyword queries", () => {
    render(<TeamsView {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(/search by team name/i);
    fireEvent.change(searchInput, { target: { value: "Solar" } });

    expect(screen.getByText("Solar Flares")).toBeInTheDocument();
    expect(screen.queryByText("Thunder Cats")).not.toBeInTheDocument();
  });

  it("triggers onDeleteTeam when disband button is clicked", () => {
    render(<TeamsView {...mockProps} />);

    const disbandBtn = screen.getAllByTitle("Disband Team Record")[0];
    fireEvent.click(disbandBtn);

    expect(mockProps.onDeleteTeam).toHaveBeenCalledWith("t1", "Thunder Cats");
  });

  it("submits create payload with captainUrl, viceCaptainUrl, email, and editionId keys", () => {
    const activeEditionId = "0a534af4-8703-4ca7-bc8b-682c706e5d7b";
    const { container } = render(
      <TeamsView {...mockProps} activeEditionId={activeEditionId} />,
    );

    // Open create team modal
    const createBtn = screen.getByText("Create Team");
    fireEvent.click(createBtn);

    // Fill in required fields
    const nameInput = container.querySelector(
      'input[placeholder="E.g., Westend Strikers"]',
    ) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Blue Team" } });

    // Block field - in the create form, block input is of type="text"
    // Let's find index/names of form input tags
    const inputs = container.querySelectorAll("form input");
    // inputs[0] is name, inputs[1] is block
    const blockInput = inputs[1] as HTMLInputElement;
    fireEvent.change(blockInput, { target: { value: "A Block" } });

    const emailInput = container.querySelector(
      'form input[type="email"]',
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "blue@test.com" } });

    // Click submit
    const submitBtn = screen.getByText("Save Team");
    fireEvent.click(submitBtn);

    expect(mockProps.onAddTeam).toHaveBeenCalled();
    const passedPayload = mockProps.onAddTeam.mock.calls[0][0];
    expect(passedPayload).toEqual(
      expect.objectContaining({
        name: "Blue Team",
        block: "A Block",
        email: "blue@test.com",
        email: "blue@test.com",
        captainUrl: expect.stringContaining("http"),
        viceCaptainUrl: expect.stringContaining("http"),
        editionId: "0a534af4-8703-4ca7-bc8b-682c706e5d7b",
      }),
    );
  });

  it("submits update payload with captainUrl, viceCaptainUrl, email, and editionId keys", () => {
    const activeEditionId = "0a534af4-8703-4ca7-bc8b-682c706e5d7b";
    const { container } = render(
      <TeamsView {...mockProps} activeEditionId={activeEditionId} />,
    );

    // Click edit team on first team
    const editBtn = screen.getAllByTitle("Edit Team Parameters")[0];
    fireEvent.click(editBtn);

    // Since the Edit Modal is open, we query the email input inside the active form
    const emailInput = container.querySelector(
      'form input[type="email"]',
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "new-email@team.com" } });

    // Submit form
    const submitBtn = screen.getByText("Apply Changes");
    fireEvent.click(submitBtn);

    expect(mockProps.onUpdateTeam).toHaveBeenCalled();
    const passedPayload = mockProps.onUpdateTeam.mock.calls[0][0];
    expect(passedPayload).toEqual(
      expect.objectContaining({
        email: "new-email@team.com",
        email: "new-email@team.com",
        captainUrl: expect.stringContaining("http"),
        viceCaptainUrl: expect.stringContaining("http"),
        editionId: "0a534af4-8703-4ca7-bc8b-682c706e5d7b",
      }),
    );
  });
});
