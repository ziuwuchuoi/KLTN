import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/Authentication/LogoutPage/LogoutPage";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" index element={ <LoginPage/>} />
    </Routes>
  );
}