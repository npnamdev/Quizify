// interface User {
//     _id: string;
//     username: string;
//     email: string;
//     fullName: string;
// }

type User = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    phoneNumber: string;
    avatarUrl: string;
    role: Role;
    isVerified: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    address: string;
    // isActive: boolean;
};

interface UserData {
  _id: string | number;
  username: string;
  fullName: string;
  email: string;
  isVerified: boolean;
  gender: string;
  role: {
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}