import React from "react";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* Your logo or other header content */}
      </div>
      <div className="flex items-center space-x-4">
        <appkit-account-button />
      </div>
    </header>
  );
}
