import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersView from "./components/UsersView";
import UserView from "./components/User";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogListView from "./components/BlogListView";
import Menu from "./components/Header";
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
import { Collapse, Container, Group, Loader, Button } from "@mantine/core";

const UserLogin = () => {
  const user = useLoggedInUser();
  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <LoginForm />
      </div>
    );
  }
  return <></>;
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return (
    <div>
      <Menu />
      <Container>
        <UserLogin />
        <Routes>
          <Route path="/blogs/:blogId" element={<Blog />} />
          <Route path="/users/:userId" element={<UserView />} />
          <Route path="/users" element={<UsersView />} />
          <Route path="/" element={<BlogListView />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
