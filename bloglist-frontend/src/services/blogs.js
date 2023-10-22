import axios from "axios";
const baseUrl = "/api/blogs";

const getConfig = (loggedInUser) => {
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

const create = (blog, loggedInUser) => {
  return axios
    .post(baseUrl, { ...blog, user: loggedInUser.id }, getConfig(loggedInUser))
    .then((response) => response.data);
};

const update = (blog, loggedInUser) => {
  let requestBody = { ...blog };
  if (blog.user.id) {
    requestBody.user = blog.user.id;
  }

  return axios
    .put(`${baseUrl}/${blog.id}`, requestBody, getConfig(loggedInUser))
    .then((response) => response.data);
};

const remove = (blog, loggedInUser) => {
  return axios.delete(`${baseUrl}/${blog.id}`, getConfig(loggedInUser));
};

export default { getAll, create, update, remove };
