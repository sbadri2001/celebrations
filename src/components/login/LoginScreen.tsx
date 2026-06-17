import React, { useState, useRef } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  ArrowLeft,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AuthService } from "../../services/auth/authService";

interface LoginScreenProps {
  onLoginSuccess: (userName: string) => void;
  communityName: string;
  triggerToast: (msg: string) => void;
}

export default function LoginScreen({
  onLoginSuccess,
  communityName,
  triggerToast,
}: LoginScreenProps) {
  // Navigation between login sub-screens
  const [authScreen, setAuthScreen] = useState<
    "login" | "phone" | "otp" | "reset-password" | "check-email"
  >("login");

  // Input fields state
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("(555) 000-0000");
  const [countryCode] = useState("+1");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  // Custom states for interactive simulation
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showInlineErrors, setShowInlineErrors] = useState(false);

  // OTP input refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password reset email state
  const [resetEmail, setResetEmail] = useState("name@example.com");
  const [isLoading, setIsLoading] = useState(false);

  const isFirstNameError = showInlineErrors && !firstName.trim();
  const isLastNameError = showInlineErrors && !lastName.trim();
  const isEmailError = showInlineErrors && (!email || !email.includes("@"));
  const isPasswordError =
    showInlineErrors && (!password || password.length < 6);

  // Multi-step mock handler
  const handleEmailSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate error dialog flow first if requested
    if (email === "fail@example.com" || password === "error") {
      setShowErrorDialog(true);
      return;
    }

    // Default simulation behavior:
    // If name, email, or password are invalid/empty, show validation errors
    const isFirstNameInvalid = !firstName || !firstName.trim();
    const isLastNameInvalid = !lastName || !lastName.trim();
    const isEmailInvalid = !email || !email.includes("@");
    const isPasswordInvalid = !password || password.length < 6;

    if (
      isFirstNameInvalid ||
      isLastNameInvalid ||
      isEmailInvalid ||
      isPasswordInvalid
    ) {
      setShowInlineErrors(true);
      setShowErrorDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // Save details to the DB via registration
      const response = await AuthService.register({
        email: email,
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (response && response.success) {
        onLoginSuccess(response.user?.name || fullName || email || "Admin");
        triggerToast("Logged in successfully!");
      } else {
        setShowErrorDialog(true);
      }
    } catch (err) {
      console.error("Registration/Login failed:", err);
      // Fallback for offline mode or standard mocks
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      onLoginSuccess(fullName || email || "Admin");
      triggerToast("Logged in successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.trim() === "") {
      triggerToast("Please provide a valid phone number");
      return;
    }
    setAuthScreen("otp");
    triggerToast(
      `Sent 6-digit verification code to ${countryCode} ${phoneNumber}`,
    );
  };

  const handleOtpValueChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-focus next field
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      triggerToast("Please complete the 6-digit verification code.");
      return;
    }
    onLoginSuccess("Phone User (555)");
    triggerToast("Phone verified. Welcome to Celebrations!");
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.includes("@")) {
      triggerToast("Please provide a valid email address.");
      return;
    }
    setAuthScreen("check-email");
    triggerToast(`Password reset link sent to ${resetEmail}!`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-tr from-slate-50 via-[#fcfcfc] to-[#f4f7f9] relative font-sans pt-8 pb-4 px-4 overflow-hidden select-none">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP REGULAR HEADER (Centered Brand) EXCEPT when phone/otp screens have back arrow */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-25">
        {/* Sub-Header Navigation for Back Actions */}
        <div className="w-full flex items-center justify-between px-2 mb-2">
          {authScreen === "phone" ||
          authScreen === "otp" ||
          authScreen === "reset-password" ? (
            <button
              type="button"
              onClick={() => {
                if (authScreen === "otp") setAuthScreen("phone");
                else setAuthScreen("login");
              }}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/80 bg-white"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="flex items-center gap-1.5 py-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="#a83200"
                strokeWidth="2.5"
              />
              <circle cx="12" cy="12" r="3" fill="#fb923c" />
              <circle cx="6" cy="12" r="1.5" fill="#a83200" />
              <circle cx="18" cy="12" r="1.5" fill="#a83200" />
              <circle cx="12" cy="6" r="1.5" fill="#a83200" />
              <circle cx="12" cy="18" r="1.5" fill="#a83200" />
            </svg>
            <span className="font-sans font-extrabold text-[22px] tracking-tight bg-gradient-to-r from-[#a83200] to-[#e04f00] bg-clip-text text-transparent">
              {communityName}
            </span>
          </div>

          <div className="w-9 h-9" />
        </div>
      </div>

      {/* CORE WRAPPER CONTAINER */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        {/* INTERACTIVE SANITIZE / TEST PANEL */}
        <div className="mb-4 bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 shadow-xs font-sans text-xs text-amber-900 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Mode &
              Validation Controls:
            </span>
            <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Simulation
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => {
                setShowInlineErrors(!showInlineErrors);
                triggerToast(
                  showInlineErrors
                    ? "Inline errors disabled"
                    : "Inline errors enabled",
                );
              }}
              className={`py-1.5 px-2 rounded-lg text-left font-semibold border flex items-center justify-between ${showInlineErrors ? "bg-amber-100 border-amber-300 text-amber-900" : "bg-white border-slate-200 text-slate-500"}`}
            >
              <span>Inline Error Messages</span>
              <span
                className={`w-2 h-2 rounded-full ${showInlineErrors ? "bg-amber-600" : "bg-slate-300"}`}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowErrorDialog(true);
                triggerToast("Failure overlay triggered");
              }}
              className="py-1.5 px-2 rounded-lg text-left font-semibold border bg-white hover:bg-slate-50 border-slate-200 text-slate-700 flex items-center justify-between whitespace-nowrap"
            >
              <span>Trigger Error Dialog</span>
              <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-between pt-1 font-sans border-t border-amber-200/50 mt-1">
            <span className="font-bold text-[10px] text-amber-800">
              Quick view templates:
            </span>
            <div className="flex items-center gap-1">
              {[
                { id: "login", label: "Email" },
                { id: "phone", label: "Phone" },
                { id: "otp", label: "OTP" },
                { id: "reset-password", label: "Reset" },
                { id: "check-email", label: "Check" },
              ].map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setAuthScreen(view.id as any)}
                  className={`px-2 py-1 rounded text-[10px] font-bold ${authScreen === view.id ? "bg-amber-600 text-white" : "bg-amber-100/60 hover:bg-amber-200/60 text-amber-950"}`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTAINER BOX WITH SHADOW AND BLURRED COVERS */}
        <div className="bg-white/95 rounded-[2.2rem] border border-[#f5ded7] shadow-xl p-8 relative overflow-hidden transition-all duration-300 min-h-[510px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* VIEW 1: EMAIL SIGN IN */}
            {authScreen === "login" && (
              <motion.div
                key="email-login-screen"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6 flex flex-col justify-between h-full"
              >
                {/* Intro Headers */}
                <div className="text-center space-y-1.5">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Welcome back
                  </h2>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    Sign in to your {communityName} account to continue
                  </p>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleEmailSignInSubmit} className="space-y-4">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="login-firstname"
                        className="text-xs font-bold text-slate-500 tracking-wide block"
                      >
                        First name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          id="login-firstname"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full bg-white border ${isFirstNameError ? "border-[#a83200] focus:ring-[#a83200]" : "border-slate-200 focus:ring-amber-500"} focus:ring-2 focus:outline-none rounded-2xl pl-12 pr-4 py-3.5 text-[15px] font-sans font-medium text-slate-800 transition-all shadow-xs`}
                          placeholder="John"
                        />
                      </div>
                      {isFirstNameError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#a83200] text-[13px] font-semibold tracking-wide mt-1 ml-1"
                        >
                          First name is required
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="login-lastname"
                        className="text-xs font-bold text-slate-500 tracking-wide block"
                      >
                        Last name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          id="login-lastname"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full bg-white border ${isLastNameError ? "border-[#a83200] focus:ring-[#a83200]" : "border-slate-200 focus:ring-amber-500"} focus:ring-2 focus:outline-none rounded-2xl pl-12 pr-4 py-3.5 text-[15px] font-sans font-medium text-slate-800 transition-all shadow-xs`}
                          placeholder="Doe"
                        />
                      </div>
                      {isLastNameError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[#a83200] text-[13px] font-semibold tracking-wide mt-1 ml-1"
                        >
                          Last name is required
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Email address box */}
                  <div className="space-y-1">
                    <label
                      htmlFor="login-email"
                      className="text-xs font-bold text-slate-500 tracking-wide block"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="login-email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full bg-white border ${isEmailError ? "border-[#a83200] focus:ring-[#a83200]" : "border-slate-200 focus:ring-amber-500"} focus:ring-2 focus:outline-none rounded-2xl pl-12 pr-4 py-3.5 text-[15px] font-sans font-medium text-slate-800 transition-all shadow-xs`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {/* Simulated Inline static red warning shown in Image 1 */}
                    {isEmailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#a83200] text-[13px] font-semibold tracking-wide mt-1 ml-1"
                      >
                        Please enter a valid email address
                      </motion.p>
                    )}
                  </div>

                  {/* Password box */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="text-xs font-bold text-slate-500 tracking-wide block"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthScreen("reset-password")}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 focus:outline-none transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full bg-white border ${isPasswordError ? "border-[#a83200] focus:ring-[#a83200]" : "border-slate-200 focus:ring-amber-500"} focus:ring-2 focus:outline-none rounded-2xl pl-12 pr-11 py-3.5 text-[15px] font-sans font-medium text-slate-800 transition-all shadow-xs`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Inline password failure message shown in Image 1 */}
                    {isPasswordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#a83200] text-[13px] font-semibold tracking-wide mt-1 ml-1"
                      >
                        Password must be at least 6 characters
                      </motion.p>
                    )}
                  </div>

                  {/* Sign In Primary Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#a83200] hover:bg-[#c03c05] active:bg-[#902900] text-white py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a83200] focus:ring-offset-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>

                {/* Sign in with phone option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthScreen("phone")}
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-extrabold text-sm transition-all py-1 cursor-pointer focus:outline-none"
                  >
                    <Smartphone className="w-4.5 h-4.5" />
                    Sign in with phone number
                  </button>
                </div>

                {/* OR divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-slate-400 font-extrabold text-[10px] tracking-widest uppercase">
                    OR SIGN IN WITH
                  </span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      onLoginSuccess("Google User");
                      triggerToast("Signed in with Google!");
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-200 hover:border-slate-300 rounded-2xl bg-white hover:bg-slate-50 text-[14px] font-bold text-slate-700 shadow-3xs cursor-pointer transition-all"
                  >
                    <div className="w-4.5 h-4.5 bg-black rounded-xs flex items-center justify-center text-white text-[9px] font-black">
                      G
                    </div>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoginSuccess("Apple User");
                      triggerToast("Signed in with Apple ID!");
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-slate-200 hover:border-slate-300 rounded-2xl bg-white hover:bg-slate-50 text-[14px] font-bold text-slate-700 shadow-3xs cursor-pointer transition-all"
                  >
                    <div className="w-4.5 h-4.5 bg-black rounded-xs flex items-center justify-center text-white text-[9px] font-sans">
                      
                    </div>
                    Apple
                  </button>
                </div>

                {/* Footer sign up prompt */}
                <div className="text-center text-xs text-slate-500 font-medium">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      triggerToast("Registration is managed by administrators.")
                    }
                    className="text-[#a83200] font-black hover:underline focus:outline-none cursor-pointer"
                  >
                    Sign up for free
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: PHONE CODE REQUEST */}
            {authScreen === "phone" && (
              <motion.div
                key="phone-request-screen"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-7 flex flex-col justify-between"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Sign in with Phone
                  </h2>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    Enter your mobile number to receive a 6-digit verification
                    code.
                  </p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  {/* Phone input row */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 tracking-wide block">
                      Phone Number
                    </label>
                    <div className="flex bg-white border border-slate-200 rounded-2xl pr-4 pl-3 py-1 items-center focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all shadow-3xs">
                      {/* Flag dropdown */}
                      <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-50 px-2 py-2.5 rounded-xl border-r border-slate-100 mr-3">
                        <span className="text-lg">🇺🇸</span>
                        <span className="text-sm font-bold text-slate-700">
                          {countryCode}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {/* Live input */}
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 border-none outline-none focus:outline-none focus:ring-0 text-[16px] font-sans font-bold text-slate-800 py-2.5 bg-transparent"
                        placeholder="(555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  {/* Send Code Action block */}
                  <button
                    type="submit"
                    className="w-full bg-[#a83200] hover:bg-[#c03c05] active:bg-[#902900] text-white py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#a83200] cursor-pointer flex items-center justify-center gap-2"
                  >
                    Send Code <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </form>

                {/* OR divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-slate-400 font-extrabold text-[10px] tracking-widest uppercase">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Switch back to email */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setAuthScreen("login")}
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 border border-blue-200/50 hover:border-blue-400 px-5 py-3 rounded-2xl bg-white font-bold text-sm transition-all cursor-pointer shadow-3xs focus:outline-none"
                  >
                    <Mail className="w-4.5 h-4.5" />
                    Sign in with Email
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 3: OTP VERIFICATION BOX (Login View 4) */}
            {authScreen === "otp" && (
              <motion.div
                key="otp-screen"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex flex-col justify-between"
              >
                {/* Visual phone badge in center */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-[1.3rem] bg-[#fdf2ee] border border-[#fae3d9] flex items-center justify-center text-orange-600 shadow-inner">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-4 bg-orange-300 rounded-full animate-pulse" />
                      <div className="w-1 h-6 bg-[#a83200] rounded-full" />
                      <div className="w-2.5 h-9 border-2 border-orange-600 rounded-sm flex items-center justify-center text-[10px] font-black shrink-0">
                        •
                      </div>
                      <div className="w-1 h-6 bg-[#a83200] rounded-full" />
                      <div className="w-1 h-4 bg-orange-300 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="text-center space-y-1.5">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                      Verify Phone
                    </h2>
                    <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-xs mx-auto">
                      Enter the 6-digit code sent to{" "}
                      <span className="text-orange-900 font-black">
                        {countryCode} {phoneNumber}
                      </span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-6">
                  {/* Grid of 6 blocks */}
                  <div className="grid grid-cols-6 gap-2 px-1">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpValueChange(i, e.target.value)
                        }
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-full text-center aspect-square text-xl font-bold bg-[#fafafa]/50 focus:bg-white border border-[#fae4dc] focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none rounded-xl text-slate-800 transition-all shadow-3xs"
                      />
                    ))}
                  </div>

                  {/* Submit OTP */}
                  <button
                    type="submit"
                    className="w-full bg-[#a83200] hover:bg-[#c03c05] active:bg-[#902900] text-white py-4 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    Verify & Proceed <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </form>

                {/* Back Link or Resend timer */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400 font-semibold">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        triggerToast("New verification code sent!")
                      }
                      className="text-[#a83200] font-bold hover:underline focus:outline-none cursor-pointer"
                    >
                      Resend code
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* VIEW 4: RESET PASSWORD REQUEST (Login View 5) */}
            {authScreen === "reset-password" && (
              <motion.div
                key="reset-password-screen"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex flex-col justify-between"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Reset Password
                  </h2>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSendResetLink} className="space-y-6">
                  {/* Email address field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 tracking-wide block">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none rounded-xl pl-12 pr-4 py-3.5 text-[15px] font-sans font-medium text-slate-800 transition-all shadow-3xs"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Proceed Action button */}
                  <button
                    type="submit"
                    className="w-full bg-[#a83200] hover:bg-[#c03c05] active:bg-[#902900] text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    Send Reset Link <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </form>

                {/* Back back link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthScreen("login")}
                    className="text-slate-500 hover:text-slate-700 font-extrabold text-xs cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}

            {/* VIEW 5: RESET EMAILED CONFIRMATION (Login View 6) */}
            {authScreen === "check-email" && (
              <motion.div
                key="check-email-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 flex flex-col justify-between"
              >
                {/* Big centered orange circle with center dot exactly as in Image 6 */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner relative">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl animate-pulse">
                      •
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                      Check your email
                    </h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                      We've sent a password reset link to your email address{" "}
                      <span className="font-bold text-slate-800">
                        {resetEmail}
                      </span>
                      . Please follow the instructions to secure your account.
                    </p>
                  </div>
                </div>

                {/* Action button returning to Login */}
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthScreen("login");
                      triggerToast("Ready to sign in!");
                    }}
                    className="w-full bg-[#a83200] hover:bg-[#c03c05] text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg focus:outline-none cursor-pointer text-center block"
                  >
                    Back to Login
                  </button>
                </div>

                {/* Resend trigger */}
                <div className="text-center pt-2 text-xs text-slate-500 font-semibold">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      triggerToast("Reset code resent successfully.")
                    }
                    className="text-blue-700 hover:text-blue-950 font-black focus:outline-none cursor-pointer"
                  >
                    Resend
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BACKGROUND DIALOG OVERLAY PORTAL (Simulated login failed shown in Login View 2) */}
          <AnimatePresence>
            {showErrorDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-white/70 backdrop-blur-md flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 10 }}
                  className="bg-white rounded-3xl border border-red-100 shadow-2xl p-6.5 max-w-xs w-full text-center space-y-6 relative flex flex-col items-center"
                >
                  {/* Warning Exclamation Badge Circle shown in Image 2 */}
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner animate-bounce">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight font-sans">
                      Sign-in Failed
                    </h3>
                    <p className="text-slate-500 font-semibold text-[13px] leading-relaxed">
                      Sign in to your Celebrations account to continue
                    </p>
                  </div>

                  {/* Dismiss Solid Red Action Button */}
                  <button
                    type="button"
                    onClick={() => setShowErrorDialog(false)}
                    className="w-full bg-[#a83200] hover:bg-[#c03c05] text-white py-3.5 rounded-xl text-sm font-extrabold font-sans cursor-pointer transition-all focus:outline-none flex items-center justify-center"
                  >
                    Dismiss
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER METADATA COPY */}
      <footer className="w-full text-center space-y-1 font-sans text-xs text-slate-400 mt-6 pb-2">
        <p className="font-semibold text-slate-500">Celebrations © 2024</p>
        <div className="flex items-center justify-center gap-1.5 font-bold">
          <button
            type="button"
            className="hover:text-slate-600 focus:outline-none cursor-pointer"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            type="button"
            className="hover:text-slate-600 focus:outline-none cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}
