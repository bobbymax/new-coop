export const authHeader = () => {
  const access = JSON.parse(localStorage.getItem("token"));

  if (access && access.token) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + access.token,
    };
  } else {
    return {};
  }
};

export default authHeader;
