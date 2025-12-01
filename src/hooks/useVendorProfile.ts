import { useState, useEffect, useCallback } from 'react';
import type { Vendor, UpdateVendorProfilePayload, CreateVendorProfilePayload } from '@/types/vendorTypes';
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, Timestamp, serverTimestamp, type FieldValue } from 'firebase/firestore';

const VENDORS_COLLECTION = 'vendors';

export const useVendorProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial fetch
  const [error, setError] = useState<Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const vendorId = currentUser?.uid;

  const fetchProfile = useCallback(async () => {
    if (!vendorId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const vendorDocRef = doc(firestore, VENDORS_COLLECTION, vendorId);
      const docSnap = await getDoc(vendorDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Vendor);
      } else {
        // Profile doesn't exist, could indicate a new vendor needing to create profile
        setProfile(null); 
        console.log("No such vendor profile!");
        // Optionally, create a default profile structure here or prompt user
      }
    } catch (e) {
      console.error("Failed to fetch vendor profile:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      fetchProfile();
    } else {
      // Clear profile and set loading to false if no user (e.g., logged out)
      setProfile(null);
      setIsLoading(false);
    }
  }, [vendorId, fetchProfile]);

  // Function to create or update profile.
  // Using setDoc with merge: true for update, or setDoc without merge for create.
  // For simplicity, let's assume update means the doc exists.
  // A more robust solution might check existence or have separate create/update.
  const updateProfile = async (profileData: UpdateVendorProfilePayload): Promise<boolean> => {
    if (!vendorId) {
      const authError = new Error('User not authenticated to update profile.');
      setError(authError);
      return false;
    }
    
    setIsUpdating(true);
    setError(null); // Clear previous errors
    
    try {
      const vendorDocRef = doc(firestore, VENDORS_COLLECTION, vendorId);
      const docSnap = await getDoc(vendorDocRef);

      const dataToSave = {
        ...profileData,
        name_lowercase: profileData.name ? profileData.name.toLowerCase() : undefined, // Add lowercase name
        updatedAt: serverTimestamp(),
      };

      if (docSnap.exists()) {
        // Document exists, update it
        // Remove undefined fields from dataToSave to avoid overwriting with undefined
        Object.keys(dataToSave).forEach(key => dataToSave[key as keyof typeof dataToSave] === undefined && delete dataToSave[key as keyof typeof dataToSave]);
        await updateDoc(vendorDocRef, dataToSave);
      } else {
        // Document doesn't exist, create it (this is like an initial profile setup)
        const vendorName = profileData.name || currentUser?.displayName || "New Vendor";
        const createPayload: CreateVendorProfilePayload & { name_lowercase?: string, createdAt: FieldValue, updatedAt: FieldValue } = {
          // Ensure all required fields for a new Vendor document are present
          // This might need a CreateVendorProfilePayload that includes everything for a new doc
          ...(profileData as CreateVendorProfilePayload), // Cast, assuming it has all needed fields for create
          name: vendorName,
          name_lowercase: vendorName.toLowerCase(),
          description: profileData.description || "No description yet.",
          contactEmail: profileData.contactEmail || currentUser?.email || "",
          // Ensure other potentially missing fields from Vendor type have defaults if not in profileData
          address: profileData.address || { street: '', city: '', state: '', postalCode: '', country: '' },
          logoUrl: profileData.logoUrl || '',
          servicesOffered: profileData.servicesOffered || [],
          pricingInfo: profileData.pricingInfo || '',
          operatingHours: profileData.operatingHours || '',
          categoryIds: profileData.categoryIds || [],
          // averageRating, numberOfReviews, isFeatured are not part of CreateVendorProfilePayload
          // They will be initialized by Firestore defaults or later actions if necessary.
          // For example, Firestore security rules could set default values on create.
          // Or, if they must be in the document immediately, they should be added to CreateVendorProfilePayload.
          // For now, assuming they are not strictly required on initial client-side payload.
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp(),
        };
         // Remove undefined fields from createPayload to avoid writing them
        Object.keys(createPayload).forEach(key => createPayload[key as keyof typeof createPayload] === undefined && delete createPayload[key as keyof typeof createPayload]);
        await setDoc(vendorDocRef, createPayload);
      }

      await fetchProfile(); // Refetch to get the latest profile data including server-generated timestamps
      return true;
    } catch (e) {
      console.error("Failed to update vendor profile in hook:", e);
      const updateError = e instanceof Error ? e : new Error('An unknown error occurred while updating the profile.');
      setError(updateError);
      return false;
    } finally {
      setIsUpdating(false); // Ensure this is always called
    }
  };

  return { profile, isLoading, isUpdating, error, fetchProfile, updateProfile };
};
