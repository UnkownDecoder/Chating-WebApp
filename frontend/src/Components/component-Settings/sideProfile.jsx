import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { useGroupStore } from '../../store/useGroupStore';
 
const SideProfile = () => {

     const { selectedUser, setSelectedUser, getUsers, users } = useChatStore();
      const { selectedGroup, setSelectedGroup } = useGroupStore();
    const { authUser } = useAuthStore();
    console.log("sele",selectedUser);
    console.log("selegr",selectedGroup);
   
   
    const [displayName, setDisplayName] = useState( null );
    // const displayName = selectedUser?.username;
    const [pronouns, setPronouns] = useState(null);
     const [avatarFile, setAvatarFile] = useState(null);
    // const avatarFile = selectedUser?.profileImage;
    // Remove bannerColor and use bannerFile for banner image
    const [bannerFile, setBannerFile] = useState(null);
    // const bannerFile = selectedUser?.bannerImage;
    const [aboutMe, setAboutMe] = useState(null);
    // const aboutMe = selectedUser?.bio;

     useEffect(() => {
        if(selectedUser){
            setDisplayName(selectedUser?.username);
            setPronouns(selectedUser?.pronouns || "master__22 > YourBadshah");
            setAvatarFile(selectedUser?.profileImage );
            setBannerFile(selectedUser?.bannerImage);
            setAboutMe(selectedUser?.bio);
         }
        if(selectedGroup){
            setDisplayName(selectedGroup?.name);
            setPronouns("master__22 > YourDaddy");
            setAvatarFile(selectedGroup?.profileImage);
            setBannerFile(selectedGroup?.profileImage);
            setAboutMe("hello");
         }
      }, [selectedUser, selectedGroup]);
      

      const handleFriendClick = (member) => {
  
        if (selectedUser?._id === member._id) {
          setSelectedUser(null);
          setSelectedGroup(null);
        } else {
          setSelectedUser(member);
          setSelectedGroup(null);
        }
        setIsSidebarVisible(false);
        document.getElementById("sidebar")?.classList.add("hidden");
      };
   
  return (
    <div className="md:w-1/1 bg-gray-900 p-4 rounded-lg min-h-full">
      <h3 className="text-xl font-bold mb-4">PROFILE</h3>

      {/* Banner area */}
      <div className="w-full h-20 mb-6 rounded-md relative">
        {bannerFile ? (
          <img
            src={ bannerFile }
            alt="Banner Preview"
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <img
            src={authUser?.bannerImage || "default-image-url"}
            alt="Banner Preview"
            className="w-full h-full object-cover rounded-md"
          />
        )}

        {/* Avatar preview */}
        <div className="absolute -bottom-8 left-4 flex items-center">
          <div className="w-16 h-16 rounded-full border-4 border-gray-900 bg-gray-700 overflow-hidden">
            {avatarFile ? (
              <img
                src={ avatarFile }
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={authUser?.profileImage || "default-image-url"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Name & Pronouns */}
      <div className="mt-10 text-left">
        <p className="text-lg font-semibold">{displayName}</p>
        <p className="text-gray-400">{pronouns}</p>
      </div>

      {/* About Me Preview */}
      <div className="mt-4 bg-gray-800 p-3 rounded-md">
        <p className="text-gray-300 whitespace-pre-line">
          {aboutMe || "No about me yet..."}
        </p>
      </div>
      {selectedGroup && (
  <div className="mt-4 bg-gray-800 p-3 rounded-md">
    {/* Group Description */}
    <p className="text-gray-300 whitespace-pre-line mb-4">
      {selectedGroup?.description || "No description yet..."}
    </p>

    {/* Group Members */}
    <div>
      <p className="text-sm text-gray-400 font-semibold mb-1">Group Members:</p>
      <ul className=" lmt-2 flex-1 overflow-y-auto ">
        {selectedGroup?.members?.length > 0 ? (
          selectedGroup.members.map((member, index) => (
            <li key={index}   className={`flex items-center p-2 rounded-lg mb-2 cursor-pointer 
                    ${
                      selectedUser?._id === member._id
                        ? "bg-blue-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  onClick={() => handleFriendClick(member)}  > <img
                    src={member.profileImage || "default-image-url"}
                    alt={member.username}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                   <span className="text-white">{member.username}</span>
                   </li>
          ))
        ) : (
          <li>No members found.</li>
        )}
      </ul>
    </div>
  </div>
)}

    </div>
  );
};

export default SideProfile;
