import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
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
import { loadFromStorage, logout } from "./reducers/loggedUserReducer";

const App = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const blogResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = blogResult.data;
  const user = useSelector((state) => state.loggedUser);

  const createBlogFormToggleRef = useRef();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const handleLogout = async (target) => {
    target.preventDefault();
    dispatch(logout());
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
        <LoginForm />
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
        <CreateBlogForm />
      </Togglable>
      {blogResult.isLoading ? (
        <div>Loading blogs...</div>
      ) : (
        blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              showDelete={user.username === blog.user.username}
            />
          ))
      )}
    </div>
  );
};

export default App;
