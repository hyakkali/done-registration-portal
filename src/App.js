import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import AppointmentTable from "./AppointmentTable";
import RegistrationForm from "./RegistrationForm";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<RegistrationForm/>} />
          <Route path='/register' element={<RegistrationForm/>} />
          <Route path='/appointments' element={<AppointmentTable/>} />
        </Routes>
      </div>
    </Router>
  );
}