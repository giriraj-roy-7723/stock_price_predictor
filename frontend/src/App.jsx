import React from "react";
import {
  BrowserRouter as MainRouter,
  Routes as RouteContainer,
  Route as RoutePath,
  Navigate as RedirectPage,
} from "react-router-dom";

import LoginScreen from "./pages/signin.jsx";
import RegisterScreen from "./pages/signup.jsx";
import UserDashboard from "./pages/profile.jsx";

import SecureRoute from "./components/protected_route.jsx";

function MainApplication() {
  return (
    <>
      <MainRouter>
        <RouteContainer>

          <RoutePath
            path="/signup"
            element={<RegisterScreen />}
          />

          <RoutePath
            path="/signin"
            element={<LoginScreen />}
          />

          <RoutePath
            path="/profile"
            element={
              <SecureRoute>
                <UserDashboard />
              </SecureRoute>
            }
          />

          <RoutePath
            path="*"
            element={
              <RedirectPage
                to="/signup"
                replace
              />
            }
          />

        </RouteContainer>
      </MainRouter>
    </>
  );
}

export default MainApplication;
