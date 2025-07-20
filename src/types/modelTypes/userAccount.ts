type userAccountType = {
    username: string,
    hashedPassword: string,
    email: string,
    verified?: boolean,
    registeredAt: number,
    refreshToken?: string
};

export default userAccountType