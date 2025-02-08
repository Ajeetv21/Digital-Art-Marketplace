import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ArtUploadForm from "./components/ArtUploadForm";
import ArtDetail from "./components/ArtDetail";
import EditArt from "./components/EditArt";
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/forgot-password" element={<PrivateRoute><ForgotPassword/></PrivateRoute>} />
          <Route path="/reset-password" element={<PrivateRoute><ResetPassword/></PrivateRoute>} />
          <Route path="/upload-art" element={<PrivateRoute><ArtUploadForm/></PrivateRoute>} />
          <Route path="/art/:id" element={<PrivateRoute><ArtDetail/></PrivateRoute>} />
          <Route path="/edit-art/:id" element={<PrivateRoute><EditArt/></PrivateRoute>} />

          
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;