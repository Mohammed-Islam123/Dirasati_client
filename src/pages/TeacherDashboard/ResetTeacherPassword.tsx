import Image1 from "../../assets/images/image copy 2.png";
import React, { useState } from "react";
import requests from "../../apis/agent";
import { PasswordChangePayload } from "../../types/types";

const ResetTeacherPassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
      valid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload: PasswordChangePayload = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    };

    try {
      await requests.post<void>("/api/Accounts/change-password", payload);

      // Simple toast notification without library
      const toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.top = "20px";
      toast.style.right = "20px";
      toast.style.padding = "12px 24px";
      toast.style.background = "#4CAF50";
      toast.style.color = "white";
      toast.style.borderRadius = "4px";
      toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      toast.style.zIndex = "1000";
      toast.textContent = "Password changed successfully!";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      const toast = document.createElement("div");
      toast.style.position = "fixed";
      toast.style.top = "20px";
      toast.style.right = "20px";
      toast.style.padding = "12px 24px";
      toast.style.background = "#F44336";
      toast.style.color = "white";
      toast.style.borderRadius = "4px";
      toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      toast.style.zIndex = "1000";
      toast.textContent = errorMessage;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Eye icon SVG
  const EyeIcon = ({ show }: { show: boolean }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </>
      )}
    </svg>
  );

  // Loading spinner SVG
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[var(--color-yousra)] mb-8">
        Teacher Profile
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-6">Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div className="space-y-2">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={showPassword.old ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-[var(--color-yousra)] transition"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon show={showPassword.old} />
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-[var(--color-yousra)] transition"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon show={showPassword.new} />
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-yousra)] focus:border-[var(--color-yousra)] transition"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon show={showPassword.confirm} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[var(--color-yousra)] text-white rounded-md hover:bg-[var(--color-yousra)] transition flex items-center justify-center disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>

              <a
                href="#"
                className="text-sm text-[var(--color-yousra)] hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <img
            src={Image1}
            alt="Teacher profile illustration"
            className="max-h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetTeacherPassword;
