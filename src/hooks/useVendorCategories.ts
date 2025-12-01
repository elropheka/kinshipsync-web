import { useState, useEffect, useCallback } from 'react';
import type { VendorCategory } from '@/types/vendorTypes';
import { firestore } from '@/services/firebaseConfig';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  addDoc,
  serverTimestamp,
  type FieldValue, // For serverTimestamp()
  // Timestamp, // Timestamp not used in this version of docToVendorCategory
  QueryDocumentSnapshot, // For typing docSnap
  type DocumentData, // For typing docSnap - Made type-only
  QueryConstraint // For typing qConstraints array
} from 'firebase/firestore';

const VENDOR_CATEGORIES_COLLECTION = 'vendor_categories';

// Helper to convert Firestore Timestamps (if any) and ensure structure
const docToVendorCategory = (docSnap: QueryDocumentSnapshot<DocumentData>): VendorCategory => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    iconUrl: data.iconUrl,
    parentCategoryId: data.parentCategoryId,
    // Assuming createdAt/updatedAt might exist and are Timestamps
    // createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(), 
    // updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
  } as VendorCategory; // Cast, ensure data matches
};

export const useVendorCategories = (parentId?: string) => {
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async (pId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const categoriesCollectionRef = collection(firestore, VENDOR_CATEGORIES_COLLECTION);
      const qConstraints: QueryConstraint[] = []; // Initialize empty

      if (pId) {
        qConstraints.push(where('parentCategoryId', '==', pId));
      } else {
        // To fetch top-level categories (where parentCategoryId is null or not set)
        // This depends on how your data is structured. If parentCategoryId is absent for top-level:
        // qConstraints.push(where('parentCategoryId', '==', null)); // Or handle as needed
        // For now, if no pId, fetch all categories and let client filter if necessary, or assume all are top-level.
        // If parentCategoryId is explicitly set to null for top-level:
        // qConstraints.push(where('parentCategoryId', '==', null));
      }
      
      // Add orderBy after all where clauses
      qConstraints.push(orderBy('name', 'asc'));
      
      const q = query(categoriesCollectionRef, ...qConstraints);
      const querySnapshot = await getDocs(q);
      const fetchedCategories = querySnapshot.docs.map(docToVendorCategory);
      setCategories(fetchedCategories);
    } catch (e) {
      console.error("Failed to fetch vendor categories:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch categories'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(parentId);
  }, [fetchCategories, parentId]);

  const addCategory = async (
    categoryData: Omit<VendorCategory, 'id' | 'createdAt' | 'updatedAt' | 'iconUrl'> & { iconUrl?: string }
  ): Promise<VendorCategory> => {
    setIsLoading(true);
    setError(null);
    try {
      const categoriesCollectionRef = collection(firestore, VENDOR_CATEGORIES_COLLECTION);
      
      // Define a type for the data being saved to Firestore
      interface CategoryFirestoreData {
        name: string;
        slug: string;
        createdAt: FieldValue;
        updatedAt: FieldValue;
        description?: string;
        parentCategoryId?: string;
        iconUrl?: string;
      }

      const dataToSave: CategoryFirestoreData = {
        name: categoryData.name,
        slug: categoryData.slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (categoryData.description) {
        dataToSave.description = categoryData.description;
      }
      // Ensure parentCategoryId is only added if it's a non-empty string
      if (categoryData.parentCategoryId && categoryData.parentCategoryId !== '_NONE_') {
        dataToSave.parentCategoryId = categoryData.parentCategoryId;
      }
      if (categoryData.iconUrl) {
        dataToSave.iconUrl = categoryData.iconUrl;
      }

      const docRef = await addDoc(categoriesCollectionRef, dataToSave);
      
      // Construct the new category object to return, including the new ID
      // Firestore timestamps will be handled by server, so we can't immediately get their resolved values client-side
      // without another read. For the callback, we'll return what we know.
      const newCategory: VendorCategory = {
        id: docRef.id,
        name: categoryData.name,
        slug: categoryData.slug,
        parentCategoryId: categoryData.parentCategoryId,
        description: categoryData.description,
        iconUrl: categoryData.iconUrl,
        // createdAt and updatedAt will be populated by Firestore
      };

      await fetchCategories(parentId); // Refetch categories to include the new one
      return newCategory; // Return the newly created category data (without server-generated timestamps initially)
    } catch (e) {
      console.error("Failed to add vendor category:", e);
      setError(e instanceof Error ? e : new Error('Failed to add category'));
      throw e; // Re-throw to be caught by the modal
    } finally {
      setIsLoading(false);
    }
  };

  return { categories, isLoading, error, refetchCategories: () => fetchCategories(parentId), addCategory };
};
