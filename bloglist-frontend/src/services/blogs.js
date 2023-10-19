import axios from "axios";
const baseUrl = "/api/blogs";

let loggedInUser = null;

const setUser = (user) => {
  loggedInUser = user;
};

const getConfig = () => {
  const config = {
    headers: {},
  };
  if (loggedInUser) {
    config.headers.Authorization = `Bearer ${loggedInUser.token}`;
  }
  return config;
};

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (blog) => {
  return axios
    .post(baseUrl, { ...blog, user: loggedInUser.id }, getConfig())
    .then((response) => response.data);
};

const update = (blog) => {
  let requestBody = { ...blog };
  if (blog.user.id) {
    requestBody.user = blog.user.id;
  }

  return axios
    .put(`${baseUrl}/${blog.id}`, requestBody, getConfig())
    .then((response) => response.data);
};

const remove = (blog) => {
  return axios.delete(`${baseUrl}/${blog.id}`, getConfig());
};

export default { getAll, create, setUser, update, remove };
