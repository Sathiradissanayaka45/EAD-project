import { get, post, put, deleteRequest } from "./httpMethods";

// Define an API object with various endpoints for making HTTP requests
export const api = {
  // Endpoint for user login
  loginUser: (payload) => {
    return post(`/api/auth/login`, payload);
  },

  // Endpoint for user registration
  register: (payload) => {
    return post(`/api/auth/register`, payload);
  },

  // Endpoint to retrieve all users
  allUsers: () => {
    return get(`/api/all-users`);
  },

  // Endpoint to update user profile
  updateUser: (id, payload) => {
    return put(`/api/profile/update/${id}`, payload);
  },

  // Endpoint to update user account
  account: (id, payload) => {
    return put(`/api/account/${id}`, payload);
  },

  // Endpoint to get user account details
  getAcccount: (id) => {
    return get(`/api/user/${id}`);
  },

  // Endpoint to retrieve train schedules
  getSchedules: () => {
    return get(`/api/train/schedules`);
  },

  // Endpoint to create a new train schedule
  createSchedule: (payload) => {
    return post("/api/train/create", payload);
  },

  // Endpoint to update a train schedule
  updateSchedule: (id, payload) => {
    return put(`/api/train/schedule/update/${id}`, payload);
  },

  // Endpoint to cancel a train schedule
  cancelSchedule: (id, payload) => {
    return put(`/api/train/schedule/cancel/${id}`, payload);
  },

  // Endpoint to book a reservation for a train
  bookReservation: (id, name, time, start, departure, payload) => {
    return post(
      `/api/booking/my/${id}/${name}/${time}/${start}/${departure}`,
      payload
    );
  },

  // Endpoint to retrieve bookings for a specific train
  getBookingsForTrain: (id) => {
    return get(`/api/booking/train/${id}`);
  },

  // Endpoint to retrieve bookings for a specific user and reference ID
  getBookingsForUser: (id, refId) => {
    return get(`/api/booking/user/${id}/${refId}`);
  },

  // Endpoint to cancel a booking
  cancelBooking: (id, payload) => {
    return put(`/api/booking/cancel/${id}`, payload);
  },

  // Endpoint to retrieve booking history for a user
  bookingHistory: (id) => {
    return get(`/api/booking/history/${id}`);
  },

  // Endpoint to get assistance for a specific name
  getAssistance: (name) => {
    return get(`/api/booking/assistant/${name}`);
  },

  // Endpoint to assign a user
  assignUser: (id, payload) => {
    return put(`/api/booking/assign/${id}`, payload);
  },

  // Endpoint to accept or reject an assistant's status
  acceptOrReject: (id, payload) => {
    return put(`/api/booking/assistant/status/${id}`, payload);
  },

  // Endpoint to delete a user account
  deleteAccount: (id) => {
    return deleteRequest(`/api/user/${id}`);
  },
};
