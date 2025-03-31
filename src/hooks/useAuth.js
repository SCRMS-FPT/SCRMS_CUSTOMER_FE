import { useDispatch, useSelector } from "react-redux";
import { login, loginWithGoogle, logout } from "@/store/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, userProfile, status, error } = useSelector(
    (state) => state.user
  );

  return {
    token,
    userProfile,
    status,
    error,
    login: async (email, password) => dispatch(login({ email, password })),
    loginWithGoogle: async (googleToken) =>
      dispatch(loginWithGoogle(googleToken)),
    logout: () => dispatch(logout()),
  };
};
