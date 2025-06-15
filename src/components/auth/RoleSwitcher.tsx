"use client";

interface RoleSwitcherProps {
  currentRole: "admin" | "teacher";
  onRoleChange?: (newRole: "admin" | "teacher") => void;
}

export default function RoleSwitcher({
  currentRole = "teacher",
  onRoleChange,
}: RoleSwitcherProps) {
  const handleRoleChange = () => {
    const newRole = currentRole === "admin" ? "teacher" : "admin";

    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  return (
    <div className="flex items-center space-x-3 mt-5">
      <span className="text-sm font-medium text-gray-700">Teacher</span>
      <button
        type="button"
        role="switch"
        aria-checked={currentRole === "admin"}
        onClick={handleRoleChange}
        className={`${
          currentRole === "admin" ? "bg-indigo-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Toggle role</span>
        <span
          aria-hidden="true"
          className={`${
            currentRole === "admin" ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
      <span className="text-sm font-medium text-gray-700">Admin</span>
    </div>
  );
}
