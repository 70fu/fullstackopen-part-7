import { useSelector } from "react-redux";

export const useLoggedInUser = () => {
  return useSelector((state) => state.loggedUser);
};
