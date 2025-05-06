import { UsersRound, BookOpen, ShoppingCart, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Người dùng",
    value: 1582,
    icon: <UsersRound className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-100",
  },
  {
    title: "Khóa học",
    value: 124,
    icon: <BookOpen className="w-6 h-6 text-green-600" />,
    color: "bg-green-100",
  },
  {
    title: "Đơn hàng",
    value: 412,
    icon: <ShoppingCart className="w-6 h-6 text-yellow-600" />,
    color: "bg-yellow-100",
  },
  {
    title: "Doanh thu",
    value: "₫ 95,300,000",
    icon: <DollarSign className="w-6 h-6 text-red-600" />,
    color: "bg-red-100",
  },
];

export default function Overview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white shadow-sm rounded-xl p-4 flex items-center justify-between"
        >
          <div>
            <h4 className="text-gray-500 text-sm">{stat.title}</h4>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
