import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { AuthError } from '../utils/errors';

export class AuthService {
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      throw new AuthError(error.message, error.code);
    }
  }

  async signInWithEmail(email: string, pass: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      throw new AuthError(error.message, error.code);
    }
  }

  async signUpWithEmail(email: string, pass: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      throw new AuthError(error.message, error.code);
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  setupRecaptcha(elementId: string): RecaptchaVerifier {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible'
    });
  }

  async signInWithPhone(phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    try {
      return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (error: any) {
      throw new AuthError(error.message, error.code);
    }
  }
}

export const authService = new AuthService();
