import { FC } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

const ListUsers: FC = () => {
  const users: User[] = [];

  return (
    <div className="p-6 bg-gray-900 text-white rounded">
      <h1 className="text-2xl mb-4">Danh Sách Người Dùng</h1>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2">Tên</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 flex gap-2">
                <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Xem</button>
                <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
