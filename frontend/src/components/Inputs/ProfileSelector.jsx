import React, { useRef, useState } from "react";
import { LuUser, LuTrash, LuUpload } from "react-icons/lu";
const ProfileSelector = ({ image, setImage }) => {
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
    console.log("upload render");
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    // Reset the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden "
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer  ">
          <LuUser className="text-4xl text-blue-400" />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-blue-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Profile Image"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-400 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
