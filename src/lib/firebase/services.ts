import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  updateDoc,
  addDoc,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { auth, db } from './config';
import { 
  User, 
  Request as TripRequest, 
  Rating, 
  Notification,
  Location,
  SupportConfig,
  AdminConfig 
} from '@/types/backend';

// ============ Authentication Services ============

export const registerUser = async (
  email: string,
  password: string,
  userData: Omit<User, 'createdAt'>
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, 'users', uid), {
      ...userData,
      email,
      createdAt: Timestamp.now(),
    });

    return { uid, user: userCredential.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============ User Services ============

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToUserProfile = (userId: string, callback: (user: User | null) => void) => {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    callback(doc.exists() ? (doc.data() as User) : null);
  });
};

// ============ Locations Services ============

export const getLocations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'locations'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToLocations = (callback: (locations: (Location & { id: string })[]) => void) => {
  return onSnapshot(collection(db, 'locations'), (snapshot) => {
    const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location & { id: string }));
    callback(locations);
  });
};

export const addLocation = async (location: Location) => {
  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      ...location,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============ Trip Request Services ============

export const createTripRequest = async (request: Omit<TripRequest, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...request,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTripRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'requests'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripRequest & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPendingRequests = async () => {
  try {
    const q = query(collection(db, 'requests'), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripRequest & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToPendingRequests = (callback: (requests: (TripRequest & { id: string })[]) => void) => {
  const q = query(collection(db, 'requests'), where('status', '==', 'pending'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripRequest & { id: string }));
    callback(requests);
  });
};

export const updateTripRequest = async (requestId: string, updates: Partial<TripRequest>) => {
  try {
    await updateDoc(doc(db, 'requests', requestId), updates);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserTripRequests = async (userId: string) => {
  try {
    const q = query(collection(db, 'requests'), where('clientId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripRequest & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getDriverTripRequests = async (driverId: string) => {
  try {
    const q = query(collection(db, 'requests'), where('driverId', '==', driverId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TripRequest & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============ Ratings Services ============

export const createRating = async (rating: Omit<Rating, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'ratings'), {
      ...rating,
      createdAt: Timestamp.now(),
    });
    
    // Update driver's average rating
    const driverDoc = await getDoc(doc(db, 'users', rating.driverId));
    if (driverDoc.exists()) {
      const userData = driverDoc.data() as User;
      const currentRating = userData.rating || 0;
      const totalRatings = userData.totalRatings || 0;
      const newRating = (currentRating * totalRatings + rating.score) / (totalRatings + 1);
      
      await updateDoc(doc(db, 'users', rating.driverId), {
        rating: newRating,
        totalRatings: totalRatings + 1,
      });
    }

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getDriverRatings = async (driverId: string) => {
  try {
    const q = query(collection(db, 'ratings'), where('driverId', '==', driverId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============ Notifications Services ============

export const createNotification = async (notification: Omit<Notification, 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification & { id: string }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToUserNotifications = (userId: string, callback: (notifications: (Notification & { id: string })[]) => void) => {
  const q = query(collection(db, 'notifications'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification & { id: string }));
    callback(notifications);
  });
};

// ============ System Config Services ============

export const getSupportInfo = async () => {
  try {
    const docSnapshot = await getDoc(doc(db, 'system_config', 'support_info'));
    return docSnapshot.exists() ? (docSnapshot.data() as SupportConfig) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToSupportInfo = (callback: (info: SupportConfig) => void) => {
  return onSnapshot(doc(db, 'system_config', 'support_info'), (doc) => {
    if (doc.exists()) {
      callback(doc.data() as SupportConfig);
    }
  });
};

export const updateSupportInfo = async (info: SupportConfig) => {
  try {
    await updateDoc(doc(db, 'system_config', 'support_info'), info);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ============ Admin Services ============

export const getAdminConfig = async () => {
  try {
    const docSnapshot = await getDoc(doc(db, 'system_config', 'admin_auth'));
    return docSnapshot.exists() ? (docSnapshot.data() as AdminConfig) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};