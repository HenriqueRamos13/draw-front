import React from "react";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Dashboard from "./app/pages/Dashboard";
import NotFoundPage from "./app/pages/NotFound";
import LayoutBase from "./components/Layouts/LayoutBase";
import CreateChallenge from "./app/pages/CreateChallenge";
import Challenge from "./app/pages/Challenge";
import Ranking from "./app/pages/Ranking";
import UserPage from "./app/pages/User";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutBase />}>
        <Route path={"/"} element={<Dashboard />} />
        <Route path={"/challenge/:id"} element={<Challenge />} />
        <Route path={"/user/:name"} element={<UserPage />} />
        <Route path={"/ranking"} element={<Ranking />} />
        <Route path={"/challenge"} element={<CreateChallenge />} />
        <Route path={"/*"} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
