import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import RegistrationForm from "./RegistrationForm";

export default function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path='/' element={<RegistrationForm/>} />
          <Route path='/register' element={<RegistrationForm/>} />
        </Routes>
      </div>
    </Router>
  );
}