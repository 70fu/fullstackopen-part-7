import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog";
import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import {
  showSuccessNotification,
  showErrorNotification,
} from "./reducers/notificationReducer";

const userStorageKey = "loggedInBlogUser";

const App = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const createBlogFormToggleRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogs(await blogService.getAll());
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const userString = window.localStorage.getItem(userStorageKey);
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      blogService.setUser(user);
    }
  }, []);

  const addBlog = async (newBlog) => {
    const created = await blogService.create(newBlog);
    createBlogFormToggleRef.current.toggleVisibility();
    setBlogs(blogs.concat(created));
  };

  const handleBlogUpdate = async (changed) => {
    const updated = await blogService.update(changed);
    const newBlogList = blogs.map((blog) =>
      blog.id === updated.id ? updated : blog,
    );
    setBlogs(newBlogList);
  };

  const handleBlogRemove = async (removed) => {
    await blogService.remove(removed);
    setBlogs(blogs.filter((blog) => blog.id !== removed.id));
  };

  const handleLogin = async (target) => {
    target.preventDefault();
    try {
      const token = await loginService.login(username, password);
      if (token) {
        console.log("login successful");
        window.localStorage.setItem(userStorageKey, JSON.stringify(token));
        setUser(token);
        blogService.setUser(token);

        setUsername("");
        setPassword("");

        dispatch(showSuccessNotification("Successfully logged in"));
      } else {
        console.log("login unsuccessful");
        dispatch(showErrorNotification("Login unsuccessful"));
      }
    } catch (error) {
      console.log(error);
      dispatch(showErrorNotification("wrong username or password"));
    }
  };

  const handleLogout = async (target) => {
    console.log("logging out");

    target.preventDefault();
    window.localStorage.removeItem(userStorageKey);
    setUser(null);

    console.log("logged out");
    dispatch(showSuccessNotification("Successfully logged out"));
  };

  const generateNotifications = () => {
    return (
      <div>
        {notifications.map((n) => (
          <Notification
            key={+n.showUntil}
            message={n.text}
            typeClass={n.className}
          />
        ))}
      </div>
    );
  };

  if (user === null) {
    return (
      <div>
        {generateNotifications()}
        <h2>Log in to the application</h2>
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      {generateNotifications()}
      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={createBlogFormToggleRef}>
        <h2>create new</h2>
        <CreateBlogForm addBlog={addBlog} />
      </Togglable>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            showDelete={user.username === blog.user.username}
            handleBlogUpdate={handleBlogUpdate}
            handleBlogRemove={handleBlogRemove}
          />
        ))}
    </div>
  );
};

export default App;
