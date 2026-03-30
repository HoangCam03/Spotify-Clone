import { FC } from "react";

const AddSong: FC = (): JSX.Element => {
  return (
    <div className="p-6 bg-gray-900 text-white rounded">
      <h1 className="text-2xl mb-4">Thêm Bài Hát</h1>
      <form>
        <input type="text" placeholder="Tên bài hát" className="w-full p-2 mb-4 bg-gray-800 rounded" required />
        <input type="text" placeholder="Nghệ sĩ" className="w-full p-2 mb-4 bg-gray-800 rounded" required />
        <input type="file" className="w-full p-2 mb-4 bg-gray-800 rounded" required />
        <button type="submit" className="w-full bg-green-500 p-2 rounded hover:bg-green-600">
          Thêm
        </button>
      </form>
    </div>
  );
};

export default AddSong;
