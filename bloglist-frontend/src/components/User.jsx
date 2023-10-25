import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import { useParams, useLocation } from "react-router-dom";
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
    return <h2>Loading user data...</h2>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserView;
