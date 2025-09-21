import { Button, Form, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/commonAPI";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [nic, setNIC] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    (async () =>
      await api.getAcccount(localStorage.getItem("id")).then(({ data }) => {
        setNIC(data[0].nic);
        setEmail(data[0].email);
        setUsername(data[0].username);
        setPhone(data[0].phone);
        setAddress(data[0].address);
      }))();
  }, [isUpdated]);

  const onSubmit = async (e) => {
    if (nic && username && email && phone && address)
      try {
        await api.updateUser(localStorage.getItem("id"), {
          nic,
          email,
          username,
          phone,
          address,
        });
        notification.success({
          message: "Profile Updated Successfully.",
          placement: "topRight",
        });
        setIsUpdated(true);
      } catch (error) {
        notification.error({
          message: "Something went wrong.",
          placement: "topRight",
        });
      }
    else
      notification.error({
        message: "Please fill all the required fields",
        placement: "topRight",
      });
  };

  const onAccount = async () => {
    try {
      await api.account(localStorage.getItem("id"), { status: "DEACTIVATED" });
      notification.success({
        message: "Profile Deactivated Successfully.",
        placement: "topRight",
      });
      setOpen(false);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  return (
    <div>
      <Form
        style={{
          width: "100%",
          background: "none",
          paddingLeft: "20%",
          paddingRight: "20%",
        }}
        onFinish={onSubmit}
        form={form}
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
          <Button
            type="primary"
            className="button"
            disabled={!nic}
            onClick={() => form.submit()}
          >
            Update
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={() => setOpen(true)} disabled={!nic}>
            Deactivate
          </Button>
        </center>
      </Form>
      <Modal
        title={`DEACTIVATE ACCOUNT`}
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
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
            Deactivate
          </Button>
        </center>
      </Modal>
      <br /> <sup style={{ fontSize: "6px" }}>🔴</sup> Represents the required
      fields
    </div>
  );
};

export default UserProfile;
