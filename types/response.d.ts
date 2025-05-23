interface LoginResponse {
    accessToken: string;
    message: string;
    user: User;
}

interface UserResponse {
    data: any[];
    pagination: {
        total: number;
    };
}