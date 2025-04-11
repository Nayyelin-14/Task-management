import React from "react";

const AvatarGroup = ({ maxVisible = 3, avatars }) => {
  return (
    <div className="flex items-center mt-3">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          className="w-11 h-11 rounded-full border-2 border-gray-300 first:ml-0 -ml-3"
          alt={`Avatar - ${index + 1}`}
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-11 h-11 rounded-full border-2 border-white first:ml-0 font-medium text-sm bg-blue-50 -ml-3 flex items-center justify-center">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
