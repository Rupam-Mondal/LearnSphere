import React from "react";
import Dashboard from "./component/Dashboard";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-purple-100">
      
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-blue-700 tracking-tight drop-shadow-sm">
            🚀 Admin Panel
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="p-6 sm:p-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
