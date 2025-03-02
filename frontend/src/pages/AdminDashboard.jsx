//gmail : lionjumama669@gmail.com
//password : 246810

import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 shadow">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <nav>
            <ul className="space-y-4">
              <li>
                <a href="#dashboard" className="hover:text-blue-300">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#user-management" className="hover:text-blue-300">
                  User Management
                </a>
              </li>
              <li>
                <a href="#chat-logs" className="hover:text-blue-300">
                  Chat Logs & Monitoring
                </a>
              </li>
              <li>
                <a href="#moderation-tools" className="hover:text-blue-300">
                  Moderation Tools
                </a>
              </li>
              <li>
                <a href="#system-settings" className="hover:text-blue-300">
                  System Settings
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-blue-300">
                  Security & Access Control
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto space-y-12">
          {/* Dashboard Section */}
          <section id="dashboard">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white shadow p-4 rounded">
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <div className="bg-white shadow p-4 rounded">
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <p className="text-3xl font-bold">567</p>
              </div>
              <div className="bg-white shadow p-4 rounded">
                <h3 className="text-lg font-semibold">Messages/Day</h3>
                <p className="text-3xl font-bold">8,910</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <div className="bg-white shadow p-8 rounded h-64 flex items-center justify-center">
                <p>Analytics Charts Placeholder</p>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-2">Notifications</h3>
              <div className="bg-white shadow p-4 rounded">
                <p>No critical notifications.</p>
              </div>
            </div>
          </section>

          {/* User Management Section */}
          <section id="user-management">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">User List</h3>
              <p>
                View all registered users, their profiles, and current activity
                status.
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Actions & Role Management</h3>
              <p>
                Edit, suspend, or delete user accounts, view user history, and assign roles such as Admin, Moderator, or User.
              </p>
            </div>
          </section>

          {/* Chat Logs & Message Monitoring Section */}
          <section id="chat-logs">
            <h2 className="text-2xl font-bold mb-4">Chat Logs & Message Monitoring</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p>Search messages by keywords, user, or date.</p>
            </div>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Content Moderation</h3>
              <p>Flag or delete messages containing inappropriate content.</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Audit Trails</h3>
              <p>Maintain logs of moderated content and all admin actions.</p>
            </div>
          </section>

          {/* Moderation Tools Section */}
          <section id="moderation-tools">
            <h2 className="text-2xl font-bold mb-4">Moderation Tools</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Report Handling</h3>
              <p>View and manage user reports for abusive behavior.</p>
            </div>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Live Monitoring</h3>
              <p>Monitor chat activity in real-time for quick intervention.</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Automated Filters</h3>
              <p>Detect and filter spam or abusive language automatically.</p>
            </div>
          </section>

          {/* System Settings Section */}
          <section id="system-settings">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Configurations</h3>
              <p>
                Adjust chat features, notifications, and third-party integrations.
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Maintenance Tools</h3>
              <p>
                Run system diagnostics, backups, and update configurations.
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
              <p>
                Detailed logs of all admin activities for transparency and accountability.
              </p>
            </div>
          </section>

          {/* Security & Access Control Section */}
          <section id="security">
            <h2 className="text-2xl font-bold mb-4">Security & Access Control</h2>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p>
                Secure admin login with two-factor authentication (2FA) and strong password policies.
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded mb-4">
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p>
                Limit access and functionality based on admin roles.
              </p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">IP Whitelisting</h3>
              <p>
                Optionally restrict admin access by IP address or via VPN.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
