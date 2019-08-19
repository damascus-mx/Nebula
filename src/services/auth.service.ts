import bcrypt from 'bcryptjs';

export abstract class AuthService {

    public static async verifyPassword(password: string, cipher: string): Promise<boolean> {
        return bcrypt.compare(password, cipher)
        .then(result => result)
        .catch(e => false);
    }
}