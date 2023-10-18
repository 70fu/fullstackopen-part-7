import axios from 'axios'
const baseUrl = '/api/blogs'

let loggedInUser = null;

const setUser = (user) => {
  loggedInUser = user;
}

const getConfig = () => {
  const config = {
    headers:{}
  }
  if(loggedInUser){
    config.headers.Authorization = `Bearer ${loggedInUser.token}`;
  }
  return config;
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data;
}

const create = async (blog) => {
  const response = await axios.post(baseUrl,{ ...blog,user:loggedInUser.id },getConfig())
  return response.data;
}

const update = async (blog) => {
  let requestBody = { ...blog };
  if(blog.user.id){
    requestBody.user = blog.user.id;
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, requestBody, getConfig());
  return response.data;
}

const remove = async (blog) => {
  await axios.delete(`${baseUrl}/${blog.id}`,getConfig());
}

export default { getAll, create, setUser, update, remove }