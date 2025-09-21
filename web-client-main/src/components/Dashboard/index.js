import React from "react";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import {
  HomeOutlined,
  ProfileFilled,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "./subComponents/Profile";
import UserProfile from "./subComponents/UserProfile";
import Train from "./subComponents/Train";
import Booking from "./subComponents/Booking";
const { Header, Content, Footer } = Layout;
const Dashboard = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const date = new Date();
  const hrs = date.getHours();
//create greetings
  let greet;

  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs < 17) greet = "Good Afternoon";
  else if (hrs >= 17 && hrs < 19) greet = "Good Evening";
  else greet = "Good Night";

  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.search.split("=")[1] ? location.search.split("=")[1] : "0"]}
          onClick={({ key }) => navigate(`/dashboard?tab=${key}`)}
        >
          <Menu.Item key={"0"} style={{ width: "100px" }}>
            <HomeOutlined /> Home
          </Menu.Item>
          <Menu.Item key={"1"} style={{ width: "180px" }}>
            <UserOutlined /> Profile Management
          </Menu.Item>
          <Menu.Item key={"2"} style={{ width: "220px" }}>
            <ScheduleOutlined />{" "}
            {localStorage.getItem("role") === "back-office"
              ? "Train Schedule Management"
              : "Ticket Booking"}
          </Menu.Item>
        </Menu>
        <Button
          style={{ color: "red", marginLeft: "50%" }}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Header>
      <Breadcrumb style={{ paddingTop: "10px", paddingLeft: "10px" }}>
        <Breadcrumb.Item>{greet}</Breadcrumb.Item>
        <Breadcrumb.Item>{localStorage.getItem("username")}</Breadcrumb.Item>
        <Breadcrumb.Item>
          You are viewing {localStorage.getItem("role")} dashboard.
        </Breadcrumb.Item>
      </Breadcrumb>
      <Content
        style={{
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "30px",
        }}
      >
        {(!location.search.split("=")[1] ||
          location.search.split("=")[1] == 0) && (
          <center>
            <iframe
              src="https://player.vimeo.com/video/869784323?background=1&autoplay=1&loop=1&byline=0&title=0&mute=1"
              width="1280"
              height="720"
              frameborder="0"
            ></iframe>
          </center>
        )}

        {localStorage.getItem("role") === "back-office" &&
          location.search.split("=")[1] == 1 && <Profile />}
        {localStorage.getItem("role") === "travel-agent" &&
          location.search.split("=")[1] == 1 && <UserProfile />}
        {localStorage.getItem("role") === "back-office" &&
          location.search.split("=")[1] == 2 && <Train />}
        {localStorage.getItem("role") === "travel-agent" &&
          location.search.split("=")[1] == 2 && <Booking />}
      </Content>
      <Footer
        style={{
          textAlign: "center",
          bottom: 0,
          right: 0,
          left: 0,
          position: "fixed",
        }}
      >
        Ticket Reservation Central © {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
export default Dashboard;
