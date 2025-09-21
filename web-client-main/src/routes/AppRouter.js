import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import Onboard from "../components/Onboard";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../components/Dashboard";

const AppRouter = () => {
  const navigation = useNavigate();

  return (
    <>
      <Routes>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<Onboard />} />
        {/* <Route path="/register" element={<Onboard />} /> */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRouter;
