import bcrypt from 'bcryptjs';

export const hashPasswordService = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePasswordService = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
