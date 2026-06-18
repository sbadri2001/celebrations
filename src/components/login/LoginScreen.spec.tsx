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

const mockLogin = jest.fn().mockImplementation((credentials) => {
  return Promise.resolve({
    success: true,
    user: {
      id: "u1",
      name: "John Doe",
      email: credentials.email,
      role: "user",
    },
  });
});

const mockRegister = jest.fn().mockImplementation((payload) => {
  return Promise.resolve({
    success: true,
    user: {
      id: "u2",
      name: payload.name || "Jane Smith",
      email: payload.email,
      role: "user",
    },
  });
});

jest.mock("../../services/auth/authService", () => ({
  AuthService: {
    login: (credentials: any) => mockLogin(credentials),
    register: (payload: any) => mockRegister(payload),
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

  it("renders welcome and sign in form correctly (login screen)", () => {
    render(<LoginScreen {...mockProps} />);

    expect(screen.getByText("Festival Admin")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to your Festival Admin account/i),
    ).toBeInTheDocument();

    // Sign-in page must NOT have Name / Full Name label
    expect(screen.queryByLabelText(/Full name/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("allows entering sign-in credentials and submits successfully using login service", async () => {
    render(<LoginScreen {...mockProps} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInBtn = screen.getByRole("button", { name: /^Sign in$/i });

    fireEvent.change(emailInput, { target: { value: "admin@fest.com" } });
    fireEvent.change(passwordInput, { target: { value: "secretPass123" } });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "admin@fest.com",
        password: "secretPass123",
      });
      expect(mockProps.onLoginSuccess).toHaveBeenCalledWith(
        "John Doe",
        "admin@fest.com",
        "user",
      );
    });
    expect(mockProps.triggerToast).toHaveBeenCalledWith(
      "Logged in successfully!",
    );
  });

  it("renders and supports the registration view", async () => {
    render(<LoginScreen {...mockProps} />);

    // Switch to Register page
    const registerToggle = screen.getByRole("button", {
      name: /Sign up for free/i,
    });
    fireEvent.click(registerToggle);

    // Register screen should lack "Welcome back" as requested
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();

    // Fill registration credentials (single name field)
    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signUpBtn = screen.getByRole("button", { name: /^Sign up$/i });

    fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
    fireEvent.change(emailInput, { target: { value: "jane@fest.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(signUpBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Jane Smith",
        email: "jane@fest.com",
        password: "password123",
      });
      expect(mockProps.onLoginSuccess).toHaveBeenCalledWith(
        "Jane Smith",
        "jane@fest.com",
        "user",
      );
    });
    expect(mockProps.triggerToast).toHaveBeenCalledWith(
      "Registered & logged in successfully!",
    );
  });

  it("shows inline validation error for invalid client-side fields and does not open modal", () => {
    render(<LoginScreen {...mockProps} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Set invalid inputs
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "shrt" } });

    const signInBtn = screen.getByRole("button", { name: /^Sign in$/i });
    fireEvent.click(signInBtn);

    // Should show inline errors
    expect(
      screen.getByText("Please enter a valid email address"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Password must be at least 6 characters"),
    ).toBeInTheDocument();

    // Should NOT open the failed dialog/modal
    expect(screen.queryByText("Sign-in Failed")).not.toBeInTheDocument();
    // Should NOT have called mockLogin endpoint
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("triggers error modal with custom backend failure message on API failure", async () => {
    // Mock login to reject / throw simulated connection error
    mockLogin.mockRejectedValueOnce({
      status: 502,
      message: "Connection to NestJS server lost on port 3001",
    });

    render(<LoginScreen {...mockProps} />);

    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInBtn = screen.getByRole("button", { name: /^Sign in$/i });

    fireEvent.change(emailInput, { target: { value: "valid-email@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "validPassword123" } });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(screen.getByText("Sign-in Failed")).toBeInTheDocument();
      expect(
        screen.getByText("Connection to NestJS server lost on port 3001"),
      ).toBeInTheDocument();
    });
  });
});
