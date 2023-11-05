import { loadFromStorage, logout } from "../reducers/loggedUserReducer";
import { useDispatch, useSelector } from "react-redux";
import { useLoggedInUser } from "../hooks";
import { Link, useMatch } from "react-router-dom";
import { Group, Container, Button, Text } from "@mantine/core";
import classes from "./Header.module.css";

const Menu = () => {
  const dispatch = useDispatch();
  const user = useLoggedInUser();
  const handleLogout = async (target) => {
    target.preventDefault();
    dispatch(logout());
  };

  //matches
  const blogsMatch = useMatch("/");
  const usersMatch = useMatch("/users");
  return (
    <header>
      <Container className={classes.inner}>
        <Group gap={5}>
          <Link
            to="/"
            className={classes.link}
            data-active={blogsMatch || undefined}
          >
            blogs
          </Link>
          <Link
            to="/users"
            className={classes.link}
            data-active={usersMatch || undefined}
          >
            users
          </Link>
        </Group>
        <div>
          {user === null ? (
            <>Not logged in</>
          ) : (
            <>
              <Text fs="italic" span>
                {user.name}
              </Text>{" "}
              logged in{" "}
              <Button
                variant="default"
                size="compact-sm"
                onClick={handleLogout}
              >
                logout
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Menu;
