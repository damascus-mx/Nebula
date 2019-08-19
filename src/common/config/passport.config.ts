import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { AuthService } from "../../services/auth.service";
import IUserRepository from "../../core/repositories/user.repository";
import { Sequelize } from "sequelize";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const _userRepository: IUserRepository = new UserRepository();

export default () => {
    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });
    
    passport.deserializeUser<any, any>((id, done) => {
        _userRepository.GetById(id).then(user => done(null, user)).catch(e => done(e, false));
    });
    
    /**
     * Sign in using username and password.
     */
    passport.use(new LocalStrategy((username, password, done) => {
        _userRepository.FindOne(Sequelize.or({ username: username.toLowerCase() }, { email: username.toLowerCase() })).then(async (user) => {
            if (!user) return done(undefined, false, { message: 'User not found' })
            return await AuthService.verifyPassword(password, user.password) ? done(undefined, user) : done(undefined, false, { message: "Invalid username or password." });
        })
        .catch(e => done(e));
    }));
}