import React, { useState,useEffect } from "react";
import { adminAuthStore } from "../store/adminAuthStore";
import { Users, MessageCircle, Folder, Flag, Settings } from "lucide-react";




export default function AdminDashboard() {

  const [selectedCategory, setSelectedCategory] = useState("documents");
    const {totalUsers,totalGroups, userMessages,groupMessages, getAllUsers,getAllGroups , getAllMessages, getAllGroupsMessages } = adminAuthStore(); 
  
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await getAllUsers();
        setUsers(res.data); // make sure this is the array
      };
      fetchData();
    }, []);

    useEffect(() => {
      const fetchData = async () => {
        const users =  await getAllUsers();
        console.log("users",users);
        
        const groups =  await getAllGroups();
        console.log("groups ad",groups);
        console.log("groups",totalGroups);
        await getAllMessages();
        console.log("messages",userMessages);
        await getAllGroupsMessages();
        console.log("groups messages",groupMessages);
      };

    
      fetchData();
    }, [getAllUsers, getAllGroups, getAllMessages, getAllGroupsMessages]);

  const fileData = {
    documents: { name: "Documents", count: 34, color: "blue" },
    images: { name: "Images", count: 58, color: "green" },
    videos: { name: "Videos", count: 12, color: "yellow" },
    audios: { name: "Audios", count: 22, color: "purple" },
    pdfs: { name: "PDFs", count: 10, color: "red" },
  };

  const handleSelect = (type) => {
    setSelectedCategory(type);
  };
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F2937] text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-4 text-base">
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><Users size={20} />  <a href="#user-management" className="hover:text-blue-300">
            Users
                </a></div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><MessageCircle size={20} />  <a href="#chats" className="hover:text-blue-300">
            Chats
                </a></div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><MessageCircle size={20} /> <a href="#groups" className="hover:text-blue-300">
            Group Chats
                </a></div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><Folder size={20} /> Files <a href="#files" className="hover:text-blue-300">
            Files
                </a></div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><Flag size={20} />  <a href="#reports" className="hover:text-blue-300">
            Reports
                </a></div>
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-400"><Settings size={20} />  <a href="#setting" className="hover:text-blue-300">
            Settings
                </a></div>
          </nav>
        </div>
      </aside>


      

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-10 overflow-y-auto">
      <div id="user-management" >
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Admin 👋</h1>
          <p className="text-gray-500 mt-1">Here's the overview of your chat system</p>
        </header>

      
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Active Chats</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{userMessages}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Group Chats</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{totalGroups}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition-all">
            <p className="text-gray-500 text-sm">Reports</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{groupMessages}</p>
          </div>
        </div>

     
          {/* Header */}
          <header className="mt-5 mb-10">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users</p>
        </header>

      {/* User Table */}
      <section className="bg-white shadow rounded-lg p-6 mx-4 md:mx-1 mb-10 overflow-x-auto w-full ">
  <table className="w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profile</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {users && users.map((user, index) => (
        <tr key={user._id || index}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id|| "N/A"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username || "N/A"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email || "N/A"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || "N/A"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <img
              src={user.profileImage || "https://via.placeholder.com/40"}
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-900">Online</span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">N/A</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className="text-green-600 font-semibold">
              {user.account ? user.account.charAt(0).toUpperCase() + user.account.slice(1) : "Active"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {user.role || "User"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>

</div>

<div id="chats">
        {/* Recent Chats */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent Chats</h2>
          <div className="bg-white rounded-xl shadow overflow-auto">
            <table className="w-full min-w-max text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4">Avatar</th>
                  <th className="p-4">Chat ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Participants</th>
                  <th className="p-4">Last Message</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <img src="https://i.pravatar.cc/40?img=1" className="w-10 h-10 rounded-full" alt="avatar" />
                  </td>
                  <td className="p-4">c123</td>
                  <td className="p-4">One-to-One</td>
                  <td className="p-4">Kamlesh, Aryan</td>
                  <td className="p-4">"Hey bro"</td>
                  <td className="p-4">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition">View</button>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <img src="https://i.pravatar.cc/40?img=5" className="w-10 h-10 rounded-full" alt="avatar" />
                  </td>
                  <td className="p-4">g456</td>
                  <td className="p-4">Group</td>
                  <td className="p-4">Dev Team (8)</td>
                  <td className="p-4">"Meeting @3"</td>
                  <td className="p-4">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        </div>

        <div id="groups">
           {/* Content Header */}
           <header className=" py-6 md-10 mt-5">
          <h1 className="text-3xl font-bold text-gray-800">Group Management</h1>
          <p className="text-gray-500 mt-1">Manage all group chats</p>
        </header>

        <section className="bg-white shadow rounded-lg p-6 mx-4 md:mx-1 mb-10 overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group ID</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admins</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#G123</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">React Developers</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <img src="https://via.placeholder.com/40" alt="Group" className="rounded-full w-10 h-10" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kamlesh</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-11-20</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Admin, John</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Group for React JS discussions</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <button className="text-red-600 hover:underline mr-3">Delete</button>
          <button className="text-blue-600 hover:underline">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</section>
</div>

<div id="files">
        {/* Header */}
        <header className="mt-5 mb-10">
          <h1 className="text-2xl font-bold text-gray-800">Files Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage all shared files</p>
        </header>

         {/* Files Section */}
         <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(fileData).map(([key, value]) => (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                className={`cursor-pointer bg-white p-6 rounded-xl shadow flex items-center gap-4 border hover:border-${value.color}-500 transition`}
              >
                <div className={`bg-${value.color}-100 text-${value.color}-600 p-3 rounded-full`}>
                  <Folder size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{value.name}</h3>
                  <p className="text-gray-500 text-sm">{value.count} files</p>
                </div>
              </div>
            ))}
           
          </div>
        </section>
        </div>


        <div id="reports">
          {/* Header */}
          <header className="mt-5 mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
          <p className="text-gray-500 mt-1">User-reported content and issues</p>
        </header>

        {/* Reports Section */}
        <section>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left p-4">Report ID</th>
                  <th className="text-left p-4">Reporter</th>
                  <th className="text-left p-4">Reported User</th>
                  <th className="text-left p-4">Reason</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">#RPT1021</td>
                  <td className="p-4">Kamlesh</td>
                  <td className="p-4">JohnDoe123</td>
                  <td className="p-4">Spamming in group chat</td>
                  <td className="p-4">08-Apr-2025</td>
                  <td className="p-4 text-yellow-600 font-semibold">Pending</td>
                  <td className="p-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Review</button><br></br><br></br>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-4">#RPT1022</td>
                  <td className="p-4">Anita</td>
                  <td className="p-4">SpamBot999</td>
                  <td className="p-4">Inappropriate language</td>
                  <td className="p-4">07-Apr-2025</td>
                  <td className="p-4 text-green-600 font-semibold">Resolved</td>
                  <td className="p-4">
                    <button className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed" disabled>Reviewed</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        </div>

        <div id="setting">
         {/* Header */}
         <header className="mt-5 mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">Manage admin preferences and configurations</p>
        </header>

        {/* Settings Section */}
        <section className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Admin Name" className="border p-2 rounded w-full" />
              <input type="email" placeholder="Email Address" className="border p-2 rounded w-full" />
              <input type="password" placeholder="Change Password" className="border p-2 rounded w-full" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-fit mt-2">Update Profile</button>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">System Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Enable Notifications</label>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Maintenance Mode</label>
                <input type="checkbox" className="w-5 h-5" />
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Preferences</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-gray-600 mb-4">Delete your account and all associated data. This action cannot be undone.</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Account</button>
          </div>
        </section>
        </div>




       
      </main>

          {/* Selected Files Section */}
          <section className="px-10 pb-10">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Showing files for: {fileData[selectedCategory].name}
            </h2>
            {/* Placeholder content for selected file type */}
            <p className="text-gray-600">List of {fileData[selectedCategory].name.toLowerCase()} will be displayed here...</p>
          </div>
        </section>
    </div>
  );
}






// //gmail : lionjumama669@gmail.com
// //password : 246810

// import React from "react";

// const AdminDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <header className="bg-blue-800 text-white p-4 shadow">
//         <h1 className="text-3xl font-bold">Admin Panel</h1>
//       </header>

//       <div className="flex flex-1">
//         {/* Sidebar Navigation */}
//         <aside className="w-64 bg-gray-800 text-white p-4">
//           <nav>
//             <ul className="space-y-4">
//               <li>
//                 <a href="#dashboard" className="hover:text-blue-300">
//                   Dashboard
//                 </a>
//               </li>
//               <li>
//                 <a href="#user-management" className="hover:text-blue-300">
//                   User Management
//                 </a>
//               </li>
//               <li>
//                 <a href="#chat-logs" className="hover:text-blue-300">
//                   Chat Logs & Monitoring
//                 </a>
//               </li>
//               <li>
//                 <a href="#moderation-tools" className="hover:text-blue-300">
//                   Moderation Tools
//                 </a>
//               </li>
//               <li>
//                 <a href="#system-settings" className="hover:text-blue-300">
//                   System Settings
//                 </a>
//               </li>
//               <li>
//                 <a href="#security" className="hover:text-blue-300">
//                   Security & Access Control
//                 </a>
//               </li>
//             </ul>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8 overflow-auto space-y-12">
//           {/* Dashboard Section */}
//           <section id="dashboard">
//             <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white shadow p-4 rounded">
//                 <h3 className="text-lg font-semibold">Total Users</h3>
//                 <p className="text-3xl font-bold">1,234</p>
//               </div>
//               <div className="bg-white shadow p-4 rounded">
//                 <h3 className="text-lg font-semibold">Active Sessions</h3>
//                 <p className="text-3xl font-bold">567</p>
//               </div>
//               <div className="bg-white shadow p-4 rounded">
//                 <h3 className="text-lg font-semibold">Messages/Day</h3>
//                 <p className="text-3xl font-bold">8,910</p>
//               </div>
//             </div>
//             <div className="mt-8">
//               <h3 className="text-xl font-bold mb-2">Analytics</h3>
//               <div className="bg-white shadow p-8 rounded h-64 flex items-center justify-center">
//                 <p>Analytics Charts Placeholder</p>
//               </div>
//             </div>
//             <div className="mt-8">
//               <h3 className="text-xl font-bold mb-2">Notifications</h3>
//               <div className="bg-white shadow p-4 rounded">
//                 <p>No critical notifications.</p>
//               </div>
//             </div>
//           </section>

//           {/* User Management Section */}
//           <section id="user-management">
//             <h2 className="text-2xl font-bold mb-4">User Management</h2>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">User List</h3>
//               <p>
//                 View all registered users, their profiles, and current activity
//                 status.
//               </p>
//             </div>
//             <div className="bg-white shadow p-4 rounded">
//               <h3 className="text-xl font-semibold mb-2">Actions & Role Management</h3>
//               <p>
//                 Edit, suspend, or delete user accounts, view user history, and assign roles such as Admin, Moderator, or User.
//               </p>
//             </div>
//           </section>

//           {/* Chat Logs & Message Monitoring Section */}
//           <section id="chat-logs">
//             <h2 className="text-2xl font-bold mb-4">Chat Logs & Message Monitoring</h2>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
//               <p>Search messages by keywords, user, or date.</p>
//             </div>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Content Moderation</h3>
//               <p>Flag or delete messages containing inappropriate content.</p>
//             </div>
//             <div className="bg-white shadow p-4 rounded">
//               <h3 className="text-xl font-semibold mb-2">Audit Trails</h3>
//               <p>Maintain logs of moderated content and all admin actions.</p>
//             </div>
//           </section>

//           {/* Moderation Tools Section */}
//           <section id="moderation-tools">
//             <h2 className="text-2xl font-bold mb-4">Moderation Tools</h2>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Report Handling</h3>
//               <p>View and manage user reports for abusive behavior.</p>
//             </div>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Live Monitoring</h3>
//               <p>Monitor chat activity in real-time for quick intervention.</p>
//             </div>
//             <div className="bg-white shadow p-4 rounded">
//               <h3 className="text-xl font-semibold mb-2">Automated Filters</h3>
//               <p>Detect and filter spam or abusive language automatically.</p>
//             </div>
//           </section>

//           {/* System Settings Section */}
//           <section id="system-settings">
//             <h2 className="text-2xl font-bold mb-4">System Settings</h2>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Configurations</h3>
//               <p>
//                 Adjust chat features, notifications, and third-party integrations.
//               </p>
//             </div>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Maintenance Tools</h3>
//               <p>
//                 Run system diagnostics, backups, and update configurations.
//               </p>
//             </div>
//             <div className="bg-white shadow p-4 rounded">
//               <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
//               <p>
//                 Detailed logs of all admin activities for transparency and accountability.
//               </p>
//             </div>
//           </section>

//           {/* Security & Access Control Section */}
//           <section id="security">
//             <h2 className="text-2xl font-bold mb-4">Security & Access Control</h2>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Authentication</h3>
//               <p>
//                 Secure admin login with two-factor authentication (2FA) and strong password policies.
//               </p>
//             </div>
//             <div className="bg-white shadow p-4 rounded mb-4">
//               <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
//               <p>
//                 Limit access and functionality based on admin roles.
//               </p>
//             </div>
//             <div className="bg-white shadow p-4 rounded">
//               <h3 className="text-xl font-semibold mb-2">IP Whitelisting</h3>
//               <p>
//                 Optionally restrict admin access by IP address or via VPN.
//               </p>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
