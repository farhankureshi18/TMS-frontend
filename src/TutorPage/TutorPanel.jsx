import React, { useState } from "react";
import TutNavbar from "../TutorPage/TutorNavbar";
import TutDashBoard from '../TutorPage/TutDashBoard';
import MyBatches from '../TutorPage/Batches';
import Assignments from '../TutorPage/Assig';
import Attendance from '../TutorPage/Attendance';
import Contact from '../TutorPage/Contact';



const StudPanel = () => {
  const [active, setActive] = useState("Dashboard");

  const renderComponent = () => {
    switch (active) {
      case "TutDashBoard":
        return <TutDashBoard />;
      case "MyBatches":
        return <MyBatches />;
      case "Assignments":
        return <Assignments/>;
      case "Attendance": 
        return <Attendance />;
      case "Contact":
        return<Contact/>;
      default:
        return <TutDashBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <TutNavbar active={active} setActive={setActive} />
      <div className="mt-6">{renderComponent()}</div>
    </div>
  );
};

export default StudPanel;
