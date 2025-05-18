

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import UserDetails from "../components/UserDetails";

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeItem) {
      case "dashboard":
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Dashboard Overview</h1>
              
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Users</div>
              <div className="text-2xl font-bold">2,853</div>
              <p className="text-xs text-gray-500 mt-1">+12.5% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500 mb-1">Active Users</div>
              <div className="text-2xl font-bold">1,459</div>
              <p className="text-xs text-gray-500 mt-1">+4.3% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500 mb-1">New Signups</div>
              <div className="text-2xl font-bold">385</div>
              <p className="text-xs text-gray-500 mt-1">+28.1% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</div>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-gray-500 mt-1">+2.2% from last month</p>
            </div>
          </div>
            {/* <div className="mt-6">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Users</h2>
                  <p className="text-sm text-gray-500">Latest user registrations</p>
                </div>
                <div className="p-6">
                  <UserDetails/>
                </div>
              </div>
            </div> */}
          </>
        );
      case "users":
        return <UserDetails />;
      case "products":
        return <div>Products Component</div>; // Replace with actual component
      case "analytics":
        return <div>Analytics Component</div>; // Replace with actual component
      case "settings":
        return <div>Settings Component</div>; // Replace with actual component
      case "help":
        return <div>Help Component</div>; // Replace with actual component
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="border-r bg-white transition-all duration-300 ease-in-out shrink-0 lg:w-64 w-20">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold lg:block hidden">Admin Panel</h2>
            <div className="lg:hidden text-center">
              <LayoutDashboard className="h-6 w-6 mx-auto" />
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "users", icon: Users, label: "Users" },
              { id: "products", icon: Package, label: "Products" },
              { id: "analytics", icon: BarChart3, label: "Analytics" },
            ].map((item) => (
              <Link
                key={item.id}
                to="#"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all ${
                  activeItem === item.id ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.id);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span className="lg:block hidden">{item.label}</span>
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t">
              {[
                { id: "settings", icon: Settings, label: "Settings" },
                { id: "help", icon: HelpCircle, label: "Help" },
              ].map((item) => (
                <Link
                  key={item.id}
                  to="#"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all ${
                    activeItem === item.id ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item.id);
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="lg:block hidden">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-4 mt-auto">
              <Link
                to="#"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="lg:block hidden">Logout</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderMainContent()}</div>
      </div>
    </div>
  );
}