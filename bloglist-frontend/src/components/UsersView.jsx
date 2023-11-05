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
import { Loader, Table } from "@mantine/core";

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
        <Loader color="blue" />
      </>
    );
  }

  return (
    <>
      <h2>Users</h2>
      <Table maw="32rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>blogs created</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users
            .toSorted((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Link to={`/users/${user.id}`} state={{ user: user }}>
                    {user.name}
                  </Link>
                </Table.Td>
                <td>{user.blogs.length}</td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default UsersView;
