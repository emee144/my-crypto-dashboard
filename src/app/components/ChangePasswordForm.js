"use client";
import { useState } from "react";
import { z } from "zod";  // Import Zod for validation

// Define the Zod schema for validation
const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters long"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
});

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate using Zod schema
    try {
      changePasswordSchema.parse({ oldPassword, newPassword, confirmPassword });

      // Check if newPassword and confirmPassword match
      if (newPassword !== confirmPassword) {
        return setMessage("Passwords do not match.");
      }

      // Send request to backend
      const res = await fetch("/api/auth/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for cookie auth
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error changing password.");
      } else {
        setMessage("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const validationErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(validationErrors);
      } else {
        console.error("Change password error:", err);
        setMessage("Something went wrong.");
      }
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
      {/* Old Password */}
      <div>
        <label>Old Password</label>
        <div className="flex items-center">
          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="ml-2 text-sm text-blue-500"
          >
            {showOld ? "Hide" : "Show"}
          </button>
        </div>
        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
      </div>

      {/* New Password */}
      <div>
        <label>New Password</label>
        <div className="flex items-center">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="ml-2 text-sm text-blue-500"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label>Confirm Password</label>
        <div className="flex items-center">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="ml-2 text-sm text-blue-500"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" className="bg-blue-600 p-2 rounded text-white">
        Change Password
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default ChangePasswordForm;