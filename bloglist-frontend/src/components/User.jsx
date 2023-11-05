import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { useParams, useLocation, Link } from "react-router-dom";
import { Box, List, Loader } from "@mantine/core";
const UserView = () => {
  const { userId } = useParams();
  const historyState = useLocation().state;
  const userResult = useQuery({
    queryKey: ["users", userId],
    queryFn: () => userService.get(userId),
    refetchOnWindowFocus: false,
    placeholderData: historyState ? historyState.user : null,
  });
  const user = userResult.data;

  if (userResult.isLoading || (!user && !historyState)) {
    console.log("loading user");
    return (
      <Box>
        <h2>Loading user data...</h2>
        <Loader color="blue" />
      </Box>
    );
  }

  return (
    <Box>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <List>
        {user.blogs.map((blog) => (
          <List.Item key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};

export default UserView;
