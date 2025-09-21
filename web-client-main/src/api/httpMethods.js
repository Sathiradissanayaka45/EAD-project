import { axiosInstance } from "./axiosInstance";

// Define common headers for HTTP requests
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

// Function to make a GET request
export const get = async (path, config) =>
  await axiosInstance
    .get(`${path}`, {
      headers, // Include common headers in the request
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });

// Function to make a POST request
export const post = async (path, body) =>
  await axiosInstance
    .post(`${path}`, body, {
      headers, // Include common headers in the request
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });

// Function to make a PUT request
export const put = async (path, body) =>
  await axiosInstance
    .put(`${path}`, body, { headers }) // Include common headers in the request
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });

// Function to make a PATCH request
export const patch = async (path, body) =>
  await axiosInstance
    .patch(`${path}`, body, { headers }) // Include common headers in the request
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });

// Function to make a DELETE request
export const deleteRequest = async (path, payload, config) =>
  await axiosInstance
    .delete(`${path}`, { data: payload, headers }) // Include common headers in the request
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });
