import { useState, useEffect, useCallback } from 'react';
import type { Vendor, CreateVendorProfilePayload, UpdateVendorProfilePayload } from '@/types/vendorTypes'; // Added UpdateVendorProfilePayload
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebaseConfig';
import { 
  collection, getDocs, query, orderBy, Timestamp, 
  doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, type FieldValue // Added deleteDoc, serverTimestamp and FieldValue
} from 'firebase/firestore';

const VENDORS_COLLECTION = 'vendors';

export const useAllVendors = () => {
  const { currentUser, isAdmin } = useAuth(); // For checking admin role
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllVendors = useCallback(async () => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. You do not have access to this resource."));
      setIsLoading(false);
      setVendors([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const vendorsCollectionRef = collection(firestore, VENDORS_COLLECTION);
      // Example: order by creation date or name
      const q = query(vendorsCollectionRef, orderBy("createdAt", "desc")); 
      const querySnapshot = await getDocs(q);
      
      const fetchedVendors = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Vendor;
      });
      setVendors(fetchedVendors);
    } catch (e) {
      console.error("Failed to fetch all vendors:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch vendors'));
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    // Ensure fetchAllVendors is called only when currentUser and isAdmin status are resolved
    // and not in an initial undefined state if useAuth has an initial loading period.
    // The check within fetchAllVendors handles the permission, 
    // but this prevents calling it prematurely if isAdmin is not yet determined.
    if (currentUser !== undefined && isAdmin !== undefined) {
      fetchAllVendors();
    }
  }, [fetchAllVendors, currentUser, isAdmin]);

  // Functions for admin actions like toggleFeature, approveVendor, deleteVendor can be added here
  // For example:
  
  const adminToggleVendorFeature = async (vendorId: string, currentStatus: boolean): Promise<boolean> => {
    // setIsLoading(true); // Or a specific 'isUpdatingFeature' state
    setError(null);
    try {
      const vendorDocRef = doc(firestore, VENDORS_COLLECTION, vendorId);
      await updateDoc(vendorDocRef, {
        isFeatured: !currentStatus,
        updatedAt: Timestamp.now(),
      });
      // Optimistically update local state or refetch
      setVendors(prevVendors => 
        prevVendors.map(v => 
          v.id === vendorId ? { ...v, isFeatured: !currentStatus, updatedAt: new Date().toISOString() } : v
        )
      );
      return true;
    } catch (e) {
      console.error(`Failed to toggle feature for vendor ${vendorId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to update feature status'));
      return false;
    } finally {
      // setIsLoading(false);
    }
  };

  const adminAddVendor = async (
    profileData: CreateVendorProfilePayload, 
    userIdForDocId?: string
  ): Promise<Vendor | null> => {
    setIsLoading(true); // Or a specific 'isAdding' state
    setError(null);
    try {
      const dataToSave = {
        ...profileData,
        // Ensure all required fields for a new Vendor document are present
        // Some might come from profileData, others might need defaults if not provided
        name: profileData.name || "Unnamed Vendor",
        description: profileData.description || "No description.",
        // Ensure other non-optional fields from Vendor interface are handled
        // For example, if categoryIds is non-optional in Vendor but optional in CreateVendorProfilePayload
        categoryIds: profileData.categoryIds || [], 
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // Default non-form fields
        averageRating: 0,
        numberOfReviews: 0,
        isFeatured: false,
      };

      let newVendorId: string;
      if (userIdForDocId) {
        // Use provided UID as document ID
        const vendorDocRef = doc(firestore, VENDORS_COLLECTION, userIdForDocId);
        await setDoc(vendorDocRef, dataToSave);
        newVendorId = userIdForDocId;
      } else {
        // Auto-generate document ID
        const docRef = await addDoc(collection(firestore, VENDORS_COLLECTION), dataToSave);
        newVendorId = docRef.id;
      }
      
      const newVendor: Vendor = {
        id: newVendorId,
        ...dataToSave,
        createdAt: (dataToSave.createdAt as Timestamp).toDate().toISOString(),
        updatedAt: (dataToSave.updatedAt as Timestamp).toDate().toISOString(),
      };
      
      setVendors(prev => [newVendor, ...prev]); // Optimistically add to local list
      return newVendor;

    } catch (e) {
      console.error("Failed to add vendor (admin):", e);
      setError(e instanceof Error ? e : new Error('Failed to add vendor'));
      return null;
    } finally {
      setIsLoading(false); // Reset general loading, or specific 'isAdding'
    }
  };

  const adminUpdateVendorProfile = async (
    vendorId: string,
    profileData: UpdateVendorProfilePayload
  ): Promise<boolean> => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can update vendor profiles."));
      return false;
    }
    // Consider a specific loading state like setIsUpdating(true);
    setError(null);
    try {
      const vendorDocRef = doc(firestore, VENDORS_COLLECTION, vendorId);
      
      type VendorUpdateFirestorePayload = Omit<UpdateVendorProfilePayload, 'updatedAt'> & {
        updatedAt: FieldValue;
        name_lowercase?: string;
      };

      const dataToUpdate: VendorUpdateFirestorePayload = {
        ...(profileData as Omit<UpdateVendorProfilePayload, 'updatedAt'>),
        updatedAt: serverTimestamp(),
      };

      if (profileData.name) {
        dataToUpdate.name_lowercase = profileData.name.toLowerCase();
      }

      await updateDoc(vendorDocRef, dataToUpdate);
      
      fetchAllVendors(); // Refetch to update the local list
      return true;
    } catch (e) {
      console.error(`Failed to update vendor profile ${vendorId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to update vendor profile'));
      return false;
    } finally {
      // Consider resetting specific loading state here
    }
  };

  const adminDeleteVendor = async (vendorId: string): Promise<boolean> => {
    if (!currentUser || !isAdmin) {
      setError(new Error("Permission denied. Only admins can delete vendors."));
      return false;
    }
    // Consider a specific loading state like setIsDeleting(true);
    setError(null);
    try {
      const vendorDocRef = doc(firestore, VENDORS_COLLECTION, vendorId);
      await deleteDoc(vendorDocRef);
      
      // Optimistically update local state
      setVendors(prevVendors => prevVendors.filter(v => v.id !== vendorId));
      return true;
    } catch (e) {
      console.error(`Failed to delete vendor ${vendorId}:`, e);
      setError(e instanceof Error ? e : new Error('Failed to delete vendor'));
      return false;
    } finally {
      // Consider resetting specific loading state here
    }
  };

  return { vendors, isLoading, error, fetchAllVendors, adminAddVendor, adminToggleVendorFeature, adminUpdateVendorProfile, adminDeleteVendor };
};
