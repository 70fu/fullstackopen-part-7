import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import {
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
  Navigate,
} from "react-router-dom";

const UsersView = () => {
  const userResult = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  });
  const users = userResult.data;

  if (userResult.isLoading) {
    return (
      <>
        <h2>Users</h2>
        <p>Loading user data...</p>
      </>
    );
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users
            .toSorted((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersView;
