import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Home from "../AdminPage/Home";
import CreateBatch from "../AdminPage/CreateBatch";
import Message from "../AdminPage/Message";
import LeaderBoard from "../AdminPage/LeaderBoard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { key: "Home", label: "Home" },
    { key: "CreateBatch", label: "Create Batch" },
    { key: "Messages", label: "Message & Announcement" },
    { key: "LeaderBoard", label: "LeaderBoard" },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "CreateBatch":
        return <CreateBatch />;
      case "Messages":
        return <Message />;
      case "LeaderBoard":
        return <LeaderBoard />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Navbar onSearch={(query) => console.log(query)} />

      <div className="bg-gray-100 p-4">
        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 bg-white shadow-md rounded-lg px-4 py-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-semibold rounded-md ${
                activeTab === tab.key
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-blue-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wrap dynamic components in context provider */}
       <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        {renderComponent()}
       </div>
      </div>
    </>
  );
};

export default Admin;

