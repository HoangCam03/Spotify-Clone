import { FC } from "react";

interface UserDropdownProps {
  onLogout?: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({ onLogout }) => {
  return (
    <div className="absolute top-10 right-0 bg-gray-900 rounded shadow-lg">
      <button onClick={onLogout} className="w-full text-left px-4 py-2 text-white hover:bg-gray-800">
        Đăng Xuất
      </button>
    </div>
  );
};

export default UserDropdown;
