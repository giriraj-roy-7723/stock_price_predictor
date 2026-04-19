import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignIn from "./pages/signin.jsx";
import SignUp from "./pages/signup.jsx";
import Profile from "./pages/profile.jsx";

import ProtectedRoute from "./components/protected_route.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/signup" replace />} />
          {/* 
              path="*" is a catch-all route that matches any undefined URL 
              If we render <SignUp />, the SignUp page shows but the URL remains incorrect 
              (e.g., /randompage still appears in the address bar)
              Using <Navigate to="/signup" replace /> performs an actual redirect,
              updating the browser URL to /signup and keeping the route and UI consistent 
          */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
