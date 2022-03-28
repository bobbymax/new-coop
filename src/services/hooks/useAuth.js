import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth.value.user);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth !== null) {
      setUser(auth);
    } else {
      setUser(null);
    }
  }, [auth]);

  return user;
};

export default useAuth;
