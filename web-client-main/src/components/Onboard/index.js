import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { api } from "../../api/commonAPI";
import jwtDecode from "jwt-decode";

const Onboard = () => {
  const [nic, setNIC] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  //handle login / register
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (location.pathname === "/register") {
        await api.register({
          nic,
          username,
          email,
          password,
          phone,
          address,
          type: "travel-agent",
          status: "ACTIVE",
        });
        notification.success({
          message: "You are successfully registered.",
          placement: "topRight",
        });
        setNIC(null);
        setEmail(null);
        setUsername(null);
        setPassword(null);
        setPhone(null);
        setAddress(null);
        navigate("/");
      } else {
        const { data } = await api.loginUser({
          nic: !nic.includes("@") ? nic : null,
          email: nic.includes("@") ? nic : null,
          password,
        });
        const decodedToken = jwtDecode(data.accessToken);
        //SET the localstorage Items
        await Promise.all([
          localStorage.setItem("accessToken", data.accessToken),
          localStorage.setItem("id", decodedToken.id),
          localStorage.setItem("username", decodedToken.username),
          localStorage.setItem("email", decodedToken.email),
          localStorage.setItem("role", decodedToken.role),
          localStorage.setItem("nic", decodedToken.nic),
          localStorage.setItem("address", decodedToken.address),
          localStorage.setItem("phone", decodedToken.phone),
        ]);
        if (decodedToken.role === "user") {
          notification.error({
            message: "Invalid User",
            placement: "topRight",
          });
        } else navigate("/dashboard");
      }
    } catch (error) {
      notification.error({
        message: error.response.data,
        placement: "topRight",
      });
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="inner">
          <form onSubmit={onSubmit}>
            <h3>Ticket Reservation Central</h3>
            <div className="form-wrapper">
              <label for="" className="label-input">
                NIC {location.pathname === "/" && "/ Email"}
              </label>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) => setNIC(e.target.value)}
              />
            </div>
            {location.pathname === "/register" && (
              <>
                <div className="form-wrapper">
                  <label for="" className="label-input">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-wrapper">
                  <label for="" className="label-input">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-wrapper">
              <label for="" className="label-input">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {location.pathname === "/register" && (
              <>
                <div className="form-wrapper">
                  <label for="" className="label-input">
                    Phone
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-wrapper">
                  <label for="" className="label-comment">
                    Address
                  </label>
                  <textarea
                    name=""
                    id=""
                    className="form-control"
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
              </>
            )}

            <button type="submit" className="button">
              {location.pathname === "/" ? "Login" : "Register"}
            </button>
            {/* <Link
              to={location.pathname === "/register" ? "/" : "/register"}
              style={{ float: "right", color: "gray" }}
            >
              {location.pathname === "/" ? "Register" : "Login"}
            </Link> */}
          </form>
          <div className="image-holder">
            <img
              src={`images/${
                location.pathname === "/" ? "registration-form-5" : "login"
              }.jpg`}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
