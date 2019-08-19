import { SHA3 } from 'crypto-js';

export abstract class AuthService {

    public static verifyPassword(password: string, cipher: string): boolean {
        return SHA3(password).toString() === cipher ? true : false;
    }
}