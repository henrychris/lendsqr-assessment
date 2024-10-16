export const generateToken = (userId: number) => {
    return `token-${userId}-${Date.now()}`;
};
