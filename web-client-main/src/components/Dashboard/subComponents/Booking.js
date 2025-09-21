import { Button, Modal, Table, Tooltip, notification } from "antd";
import React, { useEffect, useState } from "react";
import { GetColumnSearchProps } from "../../helpers/Search";
import moment from "moment";
import { api } from "../../../api/commonAPI";
import {
  CustomerServiceOutlined,
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Booking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [view, setView] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [refId, setRefId] = useState(null);
  const [isSure, setIsSure] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [tableChanged, setTableChanged] = useState(null);
  const [openAssigned, setOpenAssigned] = useState(false);
  const [assignedUser, setAssignedUser] = useState(null);
  const [acceptOrReject, setAcceptOrReject] = useState(false);

  const [id, setId] = useState(null);
  //   const [trainName, setTrainName] = useState(null);
  //   const [time, setTime] = useState(null);
  //   const [start, setStart] = useState(null);
  //   const [departure, setDeparture] = useState(null);

  //Method for handling reservations
  const onAction = async ({ id, name, time, start, departure }) => {
    try {
      await api.bookReservation(id, name, time, start, departure, {
        id: localStorage.getItem("id"),
        username: localStorage.getItem("username"),
        nic: localStorage.getItem("nic"),
        email: localStorage.getItem("email"),
        phone: localStorage.getItem("phone"),
        address: localStorage.getItem("address"),
      });
      setIsUpdated(true);
      notification.success({
        message: "Reservation Added",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  //Table Columns
  const columns = [
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
            setView(true);
            setOpen(true);
            setRefId(record.id);
            setTableChanged("ref");
          }}
        >
          <Tooltip title={"Click to see your reservations"}>
            {record.name} <EyeOutlined />
          </Tooltip>
        </div>
      ),
      ...GetColumnSearchProps("name"),
    },
    {
      title: "TIME",
      dataIndex: "time",
      render: (_, record) => (
        <>{moment(record.time).format("MM/DD/YYYY HH:mm:ss A")}</>
      ),
      ...GetColumnSearchProps("time"),
    },
    { title: "START", dataIndex: "start", ...GetColumnSearchProps("start") },
    {
      title: "DEPARTURE",
      dataIndex: "departure",
      ...GetColumnSearchProps("departure"),
    },
    { title: "CREATED", dataIndex: "createdAt" },
    { title: "LAST UPDATED", dataIndex: "updatedAt" },
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
    {
      title: "MY RESERVATIONS",
      dataIndex: "",
      render: (_, record) => (
        <>
          {
            record.reservations?.filter(
              ({ userId }) => userId === localStorage.getItem("id")
            )?.length
          }
        </>
      ),
    },
    {
      title: "ACTIONS",
      dataIndex: "",
      render: (_, record) => (
        <>
          <Tooltip
            title={
              moment().diff(record.createdAt, "days") > 30
                ? "Closed"
                : record.reservations?.filter(
                    ({ userId }) => userId === localStorage.getItem("id")
                  )?.length === 4
                ? "Limited to 4 reservations"
                : "Add a reservation"
            }
          >
            <Button
              style={{ color: "green" }}
              onClick={async () => {
                // await Promise.all([
                //   setId(record.id),
                //   setTrainName(record.name),
                //   setDeparture(record.departure),
                //   setStart(record.start),
                //   setTime(record.time),
                // ]);
                onAction(record);
              }}
              disabled={
                moment().diff(record.createdAt, "days") > 30 ||
                record.reservations?.filter(
                  ({ userId }) => userId === localStorage.getItem("id")
                )?.length === 4
              }
            >
              <PlusOutlined />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  //Table columns
  const uColumns = [
    { title: "TRAIN", dataIndex: "train", ...GetColumnSearchProps("train") },
    { title: "TIME", dataIndex: "time", ...GetColumnSearchProps("time") },
    { title: "START", dataIndex: "start", ...GetColumnSearchProps("start") },
    {
      title: "DEPARTURE",
      dataIndex: "departure",
      ...GetColumnSearchProps("departure"),
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
    {
      title: "ASSIGNEE",
      dataIndex: "assignee",
      render: (_, record) => (
        <>{record.assignee ? record.assignee : <span>NOT ASSIGNED</span>}</>
      ),
    },
    {
      title: "ACTIONS",
      render: (_, record) => (
        <>
          <Tooltip
            title={
              moment().diff(record.createdAt, "days") <= 5
                ? "You have to wait at least 5 days to cancel the reservations."
                : ""
            }
          >
            {record.status === "ACTIVE" ? (
              <Button
                disabled={moment().diff(record.createdAt, "days") <= 5}
                onClick={() => {
                  setId(record.id);
                  setActionType("cancel");
                  setIsSure(true);
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setId(record.id);
                  setActionType("reserve");
                  setIsSure(true);
                }}
              >
                Reserve
              </Button>
            )}
            &nbsp;
          </Tooltip>
          {!record.assignee && (
            <Button
              onClick={() => {
                setId(record.id);
                setOpenAssigned(true);
              }}
            >
              Assign
            </Button>
          )}
        </>
      ),
    },
  ];

  //Table Columns
  const aColumns = [
    {
      title: "USERNAME",
      dataIndex: "username",
      ...GetColumnSearchProps("username"),
    },
    { title: "EMAIL", dataIndex: "email", ...GetColumnSearchProps("email") },
    { title: "PHONE", dataIndex: "phone", ...GetColumnSearchProps("phone") },
    { title: "TRAIN", dataIndex: "train", ...GetColumnSearchProps("train") },
    { title: "TIME", dataIndex: "time", ...GetColumnSearchProps("time") },
    { title: "START", dataIndex: "start", ...GetColumnSearchProps("start") },
    {
      title: "DEPARTURE",
      dataIndex: "departure",
      ...GetColumnSearchProps("start"),
    },
    {
      title: "ACTIONS",
      dataIndex: "",
      render: (_, record) => (
        <>
          {record.status === "ACTIVE" ? (
            <>
              <Button onClick={() => onAcceptOrReject(record.id, "RESOLVED")}>
                Resolve
              </Button>
              &nbsp;
              <Button onClick={() => onAcceptOrReject(record.id, "FILLED")}>
                Mark as Filled
              </Button>
            </>
          ) : (
            record.status
          )}
        </>
      ),
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

  useEffect(() => {
    if (view)
      (async () =>
        await api
          .getBookingsForUser(localStorage.getItem("id"), refId)
          .then((res) => {
            setModalContent(res.data);
            setView(false);
          }))();
  }, [view]);

  useEffect(() => {
    if (tableChanged === "history")
      (async () =>
        await api.bookingHistory(localStorage.getItem("id")).then((res) => {
          setModalContent(res.data);
          setView(false);
        }))();
  }, [tableChanged === "history"]);

  useEffect(() => {
    if (tableChanged === "assistance" || acceptOrReject)
      (async () =>
        await api
          .getAssistance(localStorage.getItem("username"))
          .then((res) => {
            setModalContent(res.data);
            setView(false);
          }))();
  }, [tableChanged === "assistance", acceptOrReject]);

  //method for confirmations
  const onConfirm = async () => {
    try {
      await api.cancelBooking(id, {
        status: actionType === "cancel" ? "CANCELLED" : "ACTIVE",
      });
      notification.success({
        message: `Booking ${
          actionType === "cancel" ? "cancelled." : "reserved."
        }`,
        placement: "topRight",
      });
      setId(null);
      setIsSure(false);
      setView(true);
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  //method for assign user
  const onAssign = async () => {
    try {
      await api.assignUser(id, { assignee: assignedUser });
      setAssignedUser(null);
      setOpenAssigned(false);
      setView(true);
      notification.success({
        message: "User Assigned",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  //Method for accept or reject
  const onAcceptOrReject = async (id, type) => {
    try {
      await api.acceptOrReject(id, { status: type });
      notification.success({
        message: "Proceeded",
        placement: "topRight",
      });
      setAcceptOrReject(true);
    } catch (error) {
      notification.error({
        message: "Something went wrong.",
        placement: "topRight",
      });
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          setTableChanged("history");
          setOpen(true);
        }}
      >
        <HistoryOutlined />
        Booking History
      </Button>
      <Button
        onClick={() => {
          setTableChanged("assistance");
          setOpen(true);
        }}
        style={{ float: "right" }}
      >
        <CustomerServiceOutlined />
        My Assistance
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
        loading={loading}
      />
      <Modal
        title={`${
          tableChanged === "history"
            ? "MY RESERVATION HISTORY"
            : tableChanged === "assistance"
            ? "ASSISTANT"
            : "MY RESERVATIONS"
        }`}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        width={1300}
      >
        <Table
          columns={
            tableChanged === "history"
              ? uColumns.slice(0, -1)
              : tableChanged === "assistance"
              ? aColumns
              : uColumns
          }
          dataSource={modalContent?.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )}
          loading={view}
        />
      </Modal>
      <Modal
        title={`${
          actionType === "cancel"
            ? "CANCEL"
            : actionType === "assistance"
            ? "ASSISTANT"
            : "RESERVE"
        } RESERVATION`}
        open={isSure}
        footer={null}
        onCancel={() => setIsSure(false)}
      >
        <center>
          <br />
          <Button onClick={() => onConfirm()}>Confirm</Button>
        </center>
      </Modal>
      <Modal
        title="ASSIGN USER"
        open={openAssigned}
        destroyOnClose={true}
        onCancel={() => setOpenAssigned(false)}
        footer={null}
      >
        <center>
          <input
            type="text"
            style={{ textAlign: "center" }}
            onChange={(e) => setAssignedUser(e.target.value)}
          />
          <br />
          <br />
          <Button onClick={() => onAssign()}>Submit</Button>
        </center>
      </Modal>
    </div>
  );
};

export default Booking;
