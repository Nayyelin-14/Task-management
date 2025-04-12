import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import UserModel from "../UserModel";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [tempSelectedusers, setTempSelectedusers] = useState([]);

  const getallUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if (response?.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const toggleUserSelection = (userID) => {
    setTempSelectedusers((prev) =>
      prev.includes(userID)
        ? prev.filter((id) => id !== userID)
        : [...prev, userID]
    );
  };

  const handleAssign = () => {
    setModelOpen(false);
    setSelectedUsers(tempSelectedusers);
  };

  const selectedUserAvatars = allUsers
    ?.filter((user) => selectedUsers.includes(user._id))
    .map((u) => u.profileImageUrl);

  useEffect(() => {
    getallUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedusers([]);
    } else {
      setTempSelectedusers(selectedUsers);
    }

    return () => {};
  }, [selectedUsers]);

  return (
    <section>
      {selectedUsers.length === 0 && (
        <button
          className="flex gap-3 items-center border border-gray-200 p-2 rounded-lg px-4 mt-3 cursor-pointer hover:bg-gray-400/40"
          onClick={() => setModelOpen(true)}
        >
          <LuUsers className="text-sm" /> Add members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setModelOpen(true)}>
          <AvatarGroup maxVisible={3} avatars={selectedUserAvatars} />
        </div>
      )}
      <UserModel
        isOpen={modelOpen}
        onClose={() => setModelOpen(false)}
        title={"Select members"}
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers &&
            allUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 border-b border-gray-400 "
              >
                <img
                  src={user.profileImageUrl}
                  alt="user profile"
                  className="rounded-full w-12 h-12 "
                />
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-white font-medium">
                    {user.name}
                  </p>
                  <p className="text-gray-400 dark:text-white font-medium">
                    {user.email}
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="members"
                  id="select members"
                  checked={tempSelectedusers.includes(user._id)} //select pee thr so checked pya
                  onChange={() => toggleUserSelection(user._id)}
                />
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-4 pt-3">
          <button className="card-btn" onClick={() => setModelOpen(false)}>
            Cancel
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            Assign
          </button>
        </div>
      </UserModel>
    </section>
  );
};

export default SelectUsers;
