import { Button, Form, Modal, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/commonAPI";
import {
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
  LockFilled,
} from "@ant-design/icons";
import { GetColumnSearchProps } from "../../helpers/Search";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [accountStatus, setAccountStatus] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const [id, setId] = useState(null);
  const [nic, setNIC] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();
//define table column
  const columns = [
    {
      title: "USERNAME",
      dataIndex: "username",
      render: (_, record) => (
        <div>
          {record.username}{" "}
          {localStorage.getItem("username") === record.username && "(You)"}
        </div>
      ),
      ...GetColumnSearchProps("username"),
    },
    { title: "NIC", dataIndex: "nic", ...GetColumnSearchProps("nic") },
    { title: "EMAIL", dataIndex: "email", ...GetColumnSearchProps("email") },
    { title: "PHONE", dataIndex: "phone", ...GetColumnSearchProps("phone") },
    {
      title: "ADDRESS",
      dataIndex: "address",
      ...GetColumnSearchProps("address"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (_, record) => (
        <span
          style={{
            backgroundColor: `${
              record.status === "ACTIVE" ? "gray" : "orange"
            }`,
            color: "white",
            padding: "4px 8px",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          {record.status}
        </span>
      ),
      ...GetColumnSearchProps("status"),
    },
    { title: "CREATED", dataIndex: "createdAt" },
    { title: "LAST UPDATED", dataIndex: "updatedAt" },
    {
      title: "ACTIONS",
      render: (_, record) => (
        <div style={{ display: "flex" }}>
          {record.type === "back-office" ? (
            "Back Officer"
          ) : (
            <>
              <Button
                style={{ marginRight: "5px" }}
                onClick={() => {
                  setId(record.id);
                  setNIC(record.nic);
                  setEmail(record.email);
                  setUsername(record.username);
                  setPhone(record.phone);
                  setAddress(record.address);
                  setOpen(true);
                }}
              >
                <EditFilled style={{ color: "green" }} />
              </Button>
              <Button
                onClick={() => {
                  setId(record.id);
                  setAccountStatus(record.status);
                  setActivateOpen(true);
                }}
              >
                {record.status === "ACTIVE" ? "Deactivate" : "Activate"}
              </Button>
              &nbsp;
              <Button
                style={{ backgroundColor: "red", color: "white" }}
                onClick={() => {
                  setId(record.id);
                  setAccountStatus("delete");
                  setActivateOpen(true);
                }}
              >
                <DeleteOutlined />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      await api.allUsers().then((res) => setData(res.data));
      setIsUpdated(false);
      setLoading(false);
    })();
  }, [isUpdated]);

  //Handle update function
  const onSubmit = async (e) => {
    if (nic && email && username && phone && address) {
      try {
        await api.updateUser(id, { nic, email, username, phone, address });
        notification.success({
          message: "User Profile Updated.",
          placement: "topRight",
        });
        setIsUpdated(true);
        setOpen(false);
        setId(null);
      } catch (error) {
        notification.error({
          message: "Something went wrong.",
          placement: "topRight",
        });
      }
    } else
      notification.error({
        message: "Please fill all the required fields.",
        placement: "topRight",
      });
  };

  //Handle Activate, deactivate and delete
  const onAccount = async () => {
    try {
      if (accountStatus === "delete") {
        await api.deleteAccount(id);
        notification.success({
          message: `Account Deleted.`,
          placement: "topRight",
        });
        setId(null);
        setAccountStatus(null);
        setConfirm(null);
        setIsUpdated(true);
        setActivateOpen(false);
      } else {
        await api.account(id, {
          status: accountStatus === "DEACTIVATED" ? "ACTIVE" : "DEACTIVATED",
        });
        notification.success({
          message: `Account ${
            accountStatus === "DEACTIVATED" ? "ACTIVATED" : "DEACTIVATED"
          }.`,
          placement: "topRight",
        });
        setId(null);
        setAccountStatus(null);
        setConfirm(null);
        setIsUpdated(true);
        setActivateOpen(false);
      }
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )}
        loading={isUpdated || loading}
        scroll={{
          x: 1300,
        }}
      />
      <Modal
        title={`EDIT PROFILE`}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose={true}
      >
        <Form
          style={{ width: "100%", background: "none" }}
          form={form}
          onFinish={onSubmit}
        >
          <div className="form-wrapper" style={{ width: "100%" }}>
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> NIC
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setNIC(e.target.value)}
              value={nic}
              style={{ color: "black" }}
            />
          </div>

          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Name
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setUsername(e.target.value)}
              style={{ color: "black" }}
              value={username}
            />
          </div>
          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Email
            </label>
            <input
              type="email"
              className="form-control"
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{ color: "black" }}
              value={email}
            />
          </div>

          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Phone
            </label>
            <input
              type="number"
              className="form-control"
              required
              onChange={(e) => setPhone(e.target.value)}
              style={{ color: "black" }}
              value={phone}
            />
          </div>
          <br />
          <div className="form-wrapper">
            <label for="" className="label-comment" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Address
            </label>
            <textarea
              name=""
              id=""
              className="form-control"
              style={{ height: "", color: "black" }}
              required
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            ></textarea>
          </div>

          <center>
            <button type="primary" className="button">
              Update
            </button>
          </center>
        </Form>
      </Modal>
      <Modal
        title={`${
          accountStatus === "DEACTIVATED"
            ? "ACTIVATE"
            : accountStatus === "delete"
            ? "DELETE"
            : "DEACTIVATE"
        } ACCOUNT`}
        open={activateOpen}
        footer={null}
        onCancel={() => {
          setActivateOpen(false);
          setConfirm(null);
        }}
        destroyOnClose={true}
      >
        <br />
        <br />
        <center>
          <div className="form-wrapper">
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setConfirm(e.target.value)}
              style={{
                color: "black",
                marginLeft: "80px",
                textAlign: "center",
              }}
              placeholder="type CONFIRM"
              value={confirm}
            />
          </div>
          <Button
            className="button"
            disabled={confirm !== "CONFIRM" ? true : false}
            onClick={() => onAccount()}
          >
            {accountStatus === "DEACTIVATED"
              ? "ACTIVATE"
              : accountStatus === "delete"
              ? "DELETE"
              : "DEACTIVATE"}
          </Button>
        </center>
      </Modal>
      <br /> <sup style={{ fontSize: "6px" }}>🔴</sup> Represents the required
      fields
    </div>
  );
};

export default Profile;
