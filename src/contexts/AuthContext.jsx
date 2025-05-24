import { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('Signup failed:', error.message, 'Code:', error.code);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('Login failed:', error.message, 'Code:', error.code);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setLoading(false);
      return result.user;
    } catch (error) {
      setLoading(false);
      console.error('Google Sign-In failed:', error.message, 'Code:', error.code);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Logout failed:', error.message, 'Code:', error.code);
      throw error;
    }
  };
  
  const updateUserProfileData = async (profileData) => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        await updateProfile(auth.currentUser, profileData);
        setUser(prevUser => ({
            ...prevUser,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            ...profileData 
        }));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to update profile", error);
        throw error;
      }
    } else {
        console.error("No user logged in to update profile");
        throw new Error("No user logged in");
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfileData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};