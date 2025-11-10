import React, { useState } from "react";
import StudNavbar from "./StudNavbar";
import DashBoard from "../StudentPage/DashBoard";
import Assignments from "./Assignments";
import Contact from "./Contact";
import Profile from "./Profile";

const StudPanel = () => {
  const [active, setActive] = useState("Dashboard");

  const renderComponent = () => {
    switch (active) {
      case "Dashboard":
        return <DashBoard />;
      case "Assignments":
        return <Assignments />;
      case "Contact":
        return <Contact />;
      case "Profile": 
        return <Profile />;
      default:
        return <DashBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <StudNavbar active={active} setActive={setActive} />
      <div className="mt-6">{renderComponent()}</div>
    </div>
  );
};

export default StudPanel;
