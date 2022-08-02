import React from "react";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Dashboard from "./app/pages/Dashboard";
import NotFoundPage from "./app/pages/NotFound";
import LayoutBase from "./components/Layouts/LayoutBase";
// import Challenge from "./pages/Challenge/index";
// import CreateChallenge from "./pages/CreateChallenge/index";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutBase />}>
        <Route path={"/"} element={<Dashboard />} />
        {/* <Route path={"/challenge/:id"} element={<Challenge />} />
        <Route path={"/challenge"} element={<CreateChallenge />} /> */}
        <Route path={"/*"} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
