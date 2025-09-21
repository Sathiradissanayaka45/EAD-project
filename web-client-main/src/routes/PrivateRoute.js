import { Spin } from "antd";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

//private route logic
const PrivateRoute = ({ children, userType }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (!localStorage.getItem("accessToken")) {
    return (
      <>
        {loading ? (
          <center>
            <div style={{ marginTop: "200px" }}>
              <h2 style={{ color: "red" }}>Unauthorized Access Detected.</h2>
              <h2 style={{ color: "gray" }}>Rolling back to the Login...</h2>
              <Spin size="large" />
            </div>
          </center>
        ) : (
          <Navigate to="/" />
        )}
      </>
    ); //if user not login or not authorized to the restricted routes, it may be navigated to the login
  }

  return children;
};

export default PrivateRoute;
