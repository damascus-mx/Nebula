import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { AuthService } from "../../services/auth.service";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const _userRepository = new UserRepository();

export default () => {
    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });
    
    passport.deserializeUser((id: any, done) => {
        _userRepository.GetById(id).then(user => done(null, user)).catch(e => done(e, false));
    });
    
    /**
     * Sign in using Email and Password.
     */
    passport.use(new LocalStrategy((username, password, done) => {
        _userRepository.FindOne({ username: username.toLowerCase() }).then(user => {
            if (!user) return done(undefined, false, { message: 'User not found' })
    
            return AuthService.verifyPassword(password, user.password) ? done(undefined, user) : done(undefined, false, { message: "Invalid username or password." });
        })
        .catch(e => done(e));
    }));
}