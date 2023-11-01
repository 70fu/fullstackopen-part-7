import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import UsersView from "./components/UsersView";
import UserView from "./components/User";
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
import { useLoggedInUser } from "./hooks";
import {
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
  Navigate,
} from "react-router-dom";

const BlogListView = () => {
  const blogResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = blogResult.data;

  const createBlogFormToggleRef = useRef();
  return (
    <>
      <h2>blogs</h2>
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
            <div className="blog" key={blog.id}>
              <Link to={`/blogs/${blog.id}`} state={{ blog }}>
                {blog.title} {blog.author}
              </Link>
            </div>
          ))
      )}
    </>
  );
};

const UserLogin = () => {
  const dispatch = useDispatch();
  const user = useLoggedInUser();
  const handleLogout = async (target) => {
    target.preventDefault();
    dispatch(logout());
  };
  return (
    <>
      {user === null ? (
        <div>
          <h2>Log in to the application</h2>
          <LoginForm />
        </div>
      ) : (
        <div>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </div>
      )}
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  const userMatch = useMatch("/users/:id");

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

  return (
    <div>
      {generateNotifications()}
      <UserLogin />
      <Routes>
        <Route path="/blogs/:blogId" element={<Blog />} />
        <Route path="/users/:userId" element={<UserView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/" element={<BlogListView />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
