/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes } from "react-router-dom";
import GuestRoute from "./theme/layout/GuestRoute";
import ProtectedRoute from "./theme/layout/ProtectedRoute";
import { Suspense, useEffect } from "react";
import CardLoader from "./theme/components/preloaders/CardLoader";
import { pages } from "./routes";
import { useDispatch } from "react-redux";
import { collection } from "./services/requests/controllers";
import { fetchSiteConfig } from "./features/config/configSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      collection("load/settings")
        .then((res) => {
          const data = res.data;

          dispatch(fetchSiteConfig(data));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Suspense fallback={<CardLoader />}>
      <Routes>
        {pages.guests.map((guestPage, i) => (
          <Route
            key={i}
            exact
            path={guestPage.path}
            element={<GuestRoute>{guestPage.component}</GuestRoute>}
          />
        ))}

        {pages.protected.map((authPage, i) => (
          <Route
            key={i}
            exact
            path={authPage.path}
            element={<ProtectedRoute>{authPage.component}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;
