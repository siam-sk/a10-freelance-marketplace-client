import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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

  const signup = useCallback(async (email, password, displayName, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: displayName,
        photoURL: photoURL || null
      });
      setUser({ 
        uid: userCredential.user.uid, 
        email: userCredential.user.email, 
        displayName: displayName, 
        photoURL: photoURL || userCredential.user.photoURL 
      });
      return userCredential;
    } catch (error) {
      console.error('Signup failed:', error.message, 'Code:', error.code);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login failed:', error.message, 'Code:', error.code);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error('Google Sign-In failed:', error.message, 'Code:', error.code);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error.message, 'Code:', error.code);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateUserProfileData = useCallback(async (profileData) => {
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
      } catch (error) {
        console.error("Failed to update profile", error);
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
        console.error("No user logged in to update profile");
        throw new Error("No user logged in");
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfileData
  }), [user, loading, signup, login, logout, signInWithGoogle, updateUserProfileData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};