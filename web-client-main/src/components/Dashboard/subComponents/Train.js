import { Button, Empty, Form, Modal, Table, Tooltip, notification } from "antd";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/commonAPI";
import { EditFilled, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { GetColumnSearchProps } from "../../helpers/Search";
import moment from "moment/moment";

const Train = () => {
   // State variables for managing form inputs and data
  const [form] = Form.useForm();
  const [id, setId] = useState(null);
  const [trainName, setTrainName] = useState(null);
  const [time, setTime] = useState(null);
  const [start, setStart] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [openRes, setOpenRes] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [view, setView] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [ACTIONS, setACTIONS] = useState(null);

  // Function to handle form submission
  const onSubmit = async () => {
    try {
      if (trainName && time && start && departure) {
        // Create a new train schedule via API
        if (type === "create") {
          await api.createSchedule({
            name: trainName,
            time,
            start,
            departure,
            reservations: [],
            references: [],
            status: "ACTIVE",
          });
        } else {
          // Update an existing train schedule via API
          await api.updateSchedule(id, {
            name: trainName,
            time,
            start,
            departure,
          });
        }
        setIsUpdated(true);
        setTrainName(null);
        setTime(null);
        setStart(null);
        setDeparture(null);
        setOpen(false);
        notification.success({
          message: `Train schedule ${
            type === "create" ? "created" : "updated"
          }`,
          placement: "topRight",
        });
      } else
        notification.error({
          message: "Please fill all the required fields.",
          placement: "topRight",
        });
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  // Define columns for the main table
  const columns = [
    // Column for displaying train name and reservations
    {
      title: "TRAIN NAME",
      dataIndex: "name",
      render: (_, record) => (
        <div
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={() => {
            setId(record.id);
            setOpenRes(true);
            setView(true);
          }}
        >
          <Tooltip title={"Click to view reservations"}>
            {record.name} <EyeOutlined />
          </Tooltip>
        </div>
      ),
      ...GetColumnSearchProps("name"),// Helper function for search functionality
    },
    // Column for displaying time
    {
      title: "TIME",
      dataIndex: "time",
      render: (_, record) => (
        <>{moment(record.time).format("MM/DD/YYYY HH:mm:ss A")}</>
      ),
      ...GetColumnSearchProps("time"),
    },
    // Column for displaying start location
    { title: "START", dataIndex: "start", ...GetColumnSearchProps("start") },
    {
      title: "DEPARTURE",
      dataIndex: "departure",
      ...GetColumnSearchProps("departure"),
    },
    { title: "CREATED", dataIndex: "createdAt" },
    { title: "LAST UPDATED", dataIndex: "updatedAt" },
    // Column for displaying status with color coding
    {
      title: "STATUS",
      dataIndex: "status",
      render: (_, record) => (
        <span
          style={{
            backgroundColor: `${
              record.status === "ACTIVE"
                ? "gray"
                : record.status === "CANCELLED"
                ? "red"
                : "green"
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
    // Column for actions (edit, publish, cancel)
    {
      title: "ACTIONS",
      dataIndex: "",
      render: (_, record) => (
        <>
          {record.status === "ACTIVE" ||
          record.status === "ACTIVE & PUBLISHED" ? (
            <>
              <Button
                style={{ color: "green" }}
                onClick={() => {
                  setType("update");
                  setId(record.id);
                  setTrainName(record.name);
                  setTime(record.time);
                  setStart(record.start);
                  setDeparture(record.departure);
                  setOpen(true);
                }}
              >
                <EditFilled />
              </Button>
              &nbsp;
              {record.status === "ACTIVE" && (
                <Button
                  onClick={() => {
                    setId(record.id);
                    setReservations(record.reservations);
                    setACTIONS("publish");
                    setOpenCancel(true);
                  }}
                >
                  PUBLISH
                </Button>
              )}
              &nbsp;
              {!record.reservations?.length && (
                <Button
                  onClick={() => {
                    setId(record.id);
                    setReservations(record.reservations);
                    setOpenCancel(true);
                    setACTIONS("cancel");
                  }}
                >
                  CANCEL
                </Button>
              )}
            </>
          ) : (
            ""
          )}
        </>
      ),
    },
  ];

  // Define columns for the reservations modal
  const rColumns = [
    {
      title: "USERNAME",
      dataIndex: "username",
      ...GetColumnSearchProps("username"),
    },
    { title: "EMAIL", dataIndex: "email", ...GetColumnSearchProps("email") },
    { title: "NIC", dataIndex: "nic", ...GetColumnSearchProps("nic") },
    { title: "PHONE", dataIndex: "phone", ...GetColumnSearchProps("phone") },
    {
      title: "ADDRESS",
      dataIndex: "address",
      ...GetColumnSearchProps("address"),
    },
    { title: "CREATED", dataIndex: "createdAt" },
    { title: "LAST UPDATED", dataIndex: "updatedAt" },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (_, record) => (
        <span
          style={{
            backgroundColor: `${record.status === "ACTIVE" ? "gray" : "red"}`,
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
  ];

  useEffect(() => {
    (async () =>
      await api.getSchedules().then((res) => {
        setData(res.data);
        setLoading(false);
        setIsUpdated(false);
      }))();
  }, [isUpdated]);

  const onAction = async () => {
    try {
      await api.cancelSchedule(id, {
        status: `${ACTIONS === "cancel" ? "CANCELLED" : "ACTIVE & PUBLISHED"}`,
        reservations,
      });
      notification.success({
        message: `Schedule ${ACTIONS === "cancel" ? "cancelled" : "published"}.`,
        placement: "topRight",
      });
      setId(null);
      setOpenCancel(false);
      setIsUpdated(true);
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    if (view)
      (async () =>
        await api.getBookingsForTrain(id).then((res) => {
          setModalContent(res.data);
          setView(false);
        }))();
  }, [view]);

  return (
    <div>
      <Button
        onClick={() => {
          setType("create");
          setOpen(true);
        }}
      >
        <PlusOutlined /> Create Schedule
      </Button>
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )}
        pagination={data.length}
        scroll={{
          x: 1300,
        }}
        loading={loading || isUpdated}
      />
      <Modal
        title={`${type === "create" ? "CREATE" : "UPDATE"} SCHEDULE`}
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
              <sup style={{ fontSize: "4px" }}>🔴</sup> Train Name
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setTrainName(e.target.value)}
              value={trainName}
              style={{ color: "black" }}
            />
          </div>

          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Time
            </label>
            <input
              type="datetime-local"
              className="form-control"
              required
              onChange={(e) => setTime(e.target.value)}
              style={{ color: "black" }}
              value={time}
            />
          </div>
          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Start
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setStart(e.target.value)}
              style={{ color: "black" }}
              value={start}
            />
          </div>

          <div className="form-wrapper">
            <label for="" className="label-input" style={{ color: "black" }}>
              <sup style={{ fontSize: "4px" }}>🔴</sup> Departure
            </label>
            <input
              type="text"
              className="form-control"
              required
              onChange={(e) => setDeparture(e.target.value)}
              style={{ color: "black" }}
              value={departure}
            />
          </div>

          <br />

          <center>
            <button type="primary" className="button">
              {type === "create" ? "Create" : "Update"}
            </button>
          </center>
        </Form>
      </Modal>
      <Modal
        title={`RESERVATIONS • Total ${modalContent?.length}`}
        open={openRes}
        footer={false}
        onCancel={() => setOpenRes(false)}
        destroyOnClose={true}
        width={modalContent?.length ? 1300 : 500}
      >
        {!modalContent?.length ? (
          <Empty
            description={
              <span>{`No reservations found for ${
                modalContent?.name
              } on ${moment(modalContent?.time).format(
                "MM/DD/YYYY HH:mm:ss A"
              )} from ${modalContent?.start} to ${
                modalContent?.departure
              }`}</span>
            }
          />
        ) : (
          <>
            <Table
              columns={rColumns}
              dataSource={modalContent?.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
              )}
              loading={view}
            />
          </>
        )}
      </Modal>
      <Modal
        title={`${ACTIONS === "cancel" ? "CANCEL" : "PUBLISH"} SCHEDULE`}
        open={openCancel}
        footer={null}
        onCancel={() => {
          setOpenCancel(false);
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
            onClick={() => onAction()}
          >
            {`${ACTIONS === "cancel" ? "Cancel" : "Publish"}`}
          </Button>
        </center>
      </Modal>
      <br /> <sup style={{ fontSize: "6px" }}>🔴</sup> Represents the required
      fields
    </div>
  );
};

export default Train;
