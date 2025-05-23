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