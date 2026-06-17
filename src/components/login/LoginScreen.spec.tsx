import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginScreen from "./LoginScreen";

jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    p: ({ children, className }: any) => (
      <p className={className}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock("../../services/auth/authService", () => ({
  AuthService: {
    register: jest.fn().mockImplementation((payload) => {
      return Promise.resolve({
        success: true,
        user: {
          name: payload.name || "Admin",
          email: payload.email,
          role: "user",
        },
      });
    }),
  },
}));

describe("LoginScreen Component", () => {
  const mockProps = {
    onLoginSuccess: jest.fn(),
    communityName: "Festival Admin",
    triggerToast: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders welcome and sign in form correctly", () => {
    render(<LoginScreen {...mockProps} />);

    expect(screen.getByText("Festival Admin")).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to your Festival Admin account/i),
    ).toBeInTheDocument();
  });

  it("allows entering sign-in credentials and submits successfully", async () => {
    render(<LoginScreen {...mockProps} />);

    const firstNameInput = screen.getByLabelText(/First name/i);
    const lastNameInput = screen.getByLabelText(/Last name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInBtn = screen.getByRole("button", { name: /^Sign in$/i });

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(emailInput, { target: { value: "admin@fest.com" } });
    fireEvent.change(passwordInput, { target: { value: "secretPass123" } });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(mockProps.onLoginSuccess).toHaveBeenCalledWith("Jane Smith");
    });
    expect(mockProps.triggerToast).toHaveBeenCalledWith(
      "Logged in successfully!",
    );
  });

  it("triggers inline errors or dialogs when credentials are empty/invalid", () => {
    render(<LoginScreen {...mockProps} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Set invalid inputs
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "shrt" } });

    const signInBtn = screen.getByRole("button", { name: /^Sign in$/i });
    fireEvent.click(signInBtn);

    // Should open failed dialog or show errors
    expect(screen.getByText("Sign-in Failed")).toBeInTheDocument();
  });
});
