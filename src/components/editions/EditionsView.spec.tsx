import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditionsView from "./EditionsView";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("EditionsView Component", () => {
  const mockProps = {
    editions: [
      {
        id: "ed-1",
        name: "Summer Festival 2024",
        year: 2024,
        description: "Last years gorgeous collection",
        isActive: false,
        status: "draft" as const,
        createdAt: "2024-06-15T08:00:00.000Z",
      },
      {
        id: "ed-2",
        name: "Autumn Gala 2025",
        year: 2025,
        description: "Active autumn competitions",
        isActive: true,
        status: "active" as const,
        createdAt: "2025-09-10T14:30:00.000Z",
      },
    ],
    isAdmin: true,
    onAddEdition: jest.fn(),
    onActivateEdition: jest.fn(),
    onDeactivateEdition: jest.fn(),
    onDeleteEdition: jest.fn(),
    triggerToast: jest.fn(),
    colorAccentClass: "text-orange-600",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and editions lists correctly", () => {
    render(<EditionsView {...mockProps} />);
    expect(screen.getByText("Festival Editions")).toBeInTheDocument();
    expect(screen.getByText("Summer Festival 2024")).toBeInTheDocument();
    expect(screen.getAllByText("Autumn Gala 2025")[0]).toBeInTheDocument();
  });

  it("displays the creation form when clicking button (admin only)", () => {
    render(<EditionsView {...mockProps} />);
    const createBtn = screen.getByRole("button", {
      name: /Create New Edition/i,
    });
    fireEvent.click(createBtn);
    expect(screen.getByText("Define New Edition")).toBeInTheDocument();
  });

  it("submits the form to add a new edition", () => {
    render(<EditionsView {...mockProps} />);
    const createBtn = screen.getByRole("button", {
      name: /Create New Edition/i,
    });
    fireEvent.click(createBtn);

    const nameInput = screen.getByPlaceholderText("e.g., Summer Festival 2026");
    fireEvent.change(nameInput, { target: { value: "Winter Gala 2026" } });

    const submitBtn = screen.getByRole("button", {
      name: /Create Edition Draft/i,
    });
    fireEvent.click(submitBtn);

    expect(mockProps.onAddEdition).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Winter Gala 2026",
        year: 2026,
      }),
    );
  });

  it("allows activating an edition (admin only)", () => {
    render(<EditionsView {...mockProps} />);
    const activateBtn = screen.getByRole("button", { name: /^Activate$/i });
    fireEvent.click(activateBtn);
    expect(mockProps.onActivateEdition).toHaveBeenCalledWith(
      "ed-1",
      "Summer Festival 2024",
    );
  });

  it("allows deactivating an edition (admin only)", () => {
    render(<EditionsView {...mockProps} />);
    const deactivateBtn = screen.getByRole("button", { name: /^Deactivate$/i });
    fireEvent.click(deactivateBtn);
    expect(mockProps.onDeactivateEdition).toHaveBeenCalledWith(
      "ed-2",
      "Autumn Gala 2025",
    );
  });

  it("allows deleting an edition from the card list and details modal (admin only)", () => {
    // 1. Test delete from the card list (inactive edition: ed-1)
    const { rerender } = render(<EditionsView {...mockProps} />);
    const deleteButtons = screen.getAllByTitle("Delete Edition");
    expect(deleteButtons.length).toBeGreaterThan(0);

    // Click delete on inactive ed-1
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete the festival edition/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Warning: You are going to delete an active edition/i),
    ).not.toBeInTheDocument();

    // Click Cancel first
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText("Confirm Deletion")).not.toBeInTheDocument();
    expect(mockProps.onDeleteEdition).not.toHaveBeenCalled();

    // Click Delete again, then click Confirm
    fireEvent.click(deleteButtons[0]);
    const confirmBtn = screen.getByRole("button", { name: /Yes, Delete/i });
    fireEvent.click(confirmBtn);
    expect(mockProps.onDeleteEdition).toHaveBeenCalledWith(
      "ed-1",
      "Summer Festival 2024",
    );

    // 2. Test delete on an active edition (ed-2)
    jest.clearAllMocks();
    fireEvent.click(deleteButtons[1]);
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Warning: You are going to delete an active edition and no edition will be active/i,
      ),
    ).toBeInTheDocument();

    const confirmActiveBtn = screen.getByRole("button", {
      name: /Yes, Delete/i,
    });
    fireEvent.click(confirmActiveBtn);
    expect(mockProps.onDeleteEdition).toHaveBeenCalledWith(
      "ed-2",
      "Autumn Gala 2025",
    );

    // 3. Test delete from the details modal for ed-1
    jest.clearAllMocks();
    const editionCard = screen
      .getByText("Summer Festival 2024")
      .closest(".cursor-pointer");
    if (editionCard) {
      fireEvent.click(editionCard);
    }
    const deleteModalBtn = screen.getByText("Delete Edition");
    fireEvent.click(deleteModalBtn);

    // Now confirm deletion modal should be open, let's see if we see the text
    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    const finalConfirmBtn = screen.getByRole("button", {
      name: /Yes, Delete/i,
    });
    fireEvent.click(finalConfirmBtn);
    expect(mockProps.onDeleteEdition).toHaveBeenCalledWith(
      "ed-1",
      "Summer Festival 2024",
    );

    // 4. Test non-admin does not see delete buttons
    const nonAdminProps = { ...mockProps, isAdmin: false };
    rerender(<EditionsView {...nonAdminProps} />);
    expect(screen.queryByTitle("Delete Edition")).not.toBeInTheDocument();
  });

  it("opens details modal when clicking on an edition card and checks view-only permissions for non-admin", () => {
    // 1. Test clicking opens the modal
    const { rerender } = render(<EditionsView {...mockProps} />);
    const editionCard = screen
      .getByText("Summer Festival 2024")
      .closest(".cursor-pointer");
    expect(editionCard).toBeInTheDocument();

    if (editionCard) {
      fireEvent.click(editionCard);
    }

    // The details modal should now show up
    expect(
      screen.getByText("Edition Details • Scoped for 2024"),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("Last years gorgeous collection")[0],
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have administrator permissions. You can activate or delete this edition.",
      ),
    ).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole("button", { name: /Close Details/i });
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText("Edition Details • Scoped for 2024"),
    ).not.toBeInTheDocument();

    // 2. Test view-only for non-admin user
    const nonAdminProps = { ...mockProps, isAdmin: false };
    rerender(<EditionsView {...nonAdminProps} />);

    // Creation button should not be present
    expect(
      screen.queryByRole("button", { name: /Create New Edition/i }),
    ).not.toBeInTheDocument();

    // Activate button should not be present
    expect(
      screen.queryByRole("button", { name: /^Activate$/i }),
    ).not.toBeInTheDocument();

    // Re-trigger click on the card to check modal content under non-admin role
    const editionCardNonAdmin = screen
      .getByText("Summer Festival 2024")
      .closest(".cursor-pointer");
    if (editionCardNonAdmin) {
      fireEvent.click(editionCardNonAdmin);
    }
    expect(
      screen.getByText(
        "This edition information is view-only. Only administrators can activate or modify configurations.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /🚀 Activate/i }),
    ).not.toBeInTheDocument();
  });

  it("displays the creation date on the edition cards and in the details modal", () => {
    render(<EditionsView {...mockProps} />);

    // Mock editions have createdAt dates:
    // ed-1: '2024-06-15T08:00:00.000Z' => formatted: Jun 15, 2024 (roughly, depending on timezone) or contains '2024' and 'Jun 15'
    // Let's expect 'Created:' and the date text in the card.
    expect(screen.getAllByText(/Created:/i).length).toBeGreaterThan(0);

    // Click on the card to open details modal
    const editionCard = screen
      .getByText("Summer Festival 2024")
      .closest(".cursor-pointer");
    if (editionCard) {
      fireEvent.click(editionCard);
    }

    // Modal should show "Created Date" header/label
    expect(screen.getByText("Created Date")).toBeInTheDocument();
    // And should show the formatted date or part of it
    expect(
      screen.getAllByText(/Jun 15, 2024|Jun 14, 2024/i).length,
    ).toBeGreaterThan(0);
  });
});
