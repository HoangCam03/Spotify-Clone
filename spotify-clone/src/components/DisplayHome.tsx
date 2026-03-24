import { FC } from "react";

const DisplayHome: FC = () => {
  return (
    <div className="w-[75%] h-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h1 className="text-3xl mb-4">Trang Chủ</h1>
      <p>Hiển thị các bài hát phổ biến</p>
    </div>
  );
};

export default DisplayHome;
