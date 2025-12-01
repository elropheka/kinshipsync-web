import { useState, useEffect, useCallback } from 'react';
import type { VendorItem, CreateVendorItemPayload, UpdateVendorItemPayload } from '@/types/vendorItemTypes';
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp,
  orderBy
} from 'firebase/firestore';

// const VENDORS_COLLECTION = 'vendors'; // Not used directly here if items are top-level or vendorId is passed
const VENDOR_ITEMS_COLLECTION = 'vendorItems'; // Using a top-level collection for items

export const useVendorItems = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<VendorItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const vendorId = currentUser?.uid; // Assuming vendor's user ID is their vendor ID for items

  // Fetch items
  const fetchItems = useCallback(async () => {
    if (!vendorId) {
      setItems([]);
      // console.log("No vendorId, skipping fetch."); // Optional: keep for debugging
      return;
    }
    setIsLoading(true);
    setError(null);
    // console.log(`Fetching items for vendorId: ${vendorId}`); // Optional: keep for debugging
    try {
      const itemsCollectionRef = collection(firestore, VENDOR_ITEMS_COLLECTION);
      const q = query(itemsCollectionRef, where("vendorId", "==", vendorId), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedItems = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        // Ensure timestamps are converted to ISO strings
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date(data.createdAt?.seconds * 1000 || Date.now()).toISOString();
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date(data.updatedAt?.seconds * 1000 || Date.now()).toISOString();
        
        return {
          id: docSnap.id,
          ...data,
          createdAt,
          updatedAt,
        } as VendorItem; // Cast, assuming data matches VendorItem structure
      });
      setItems(fetchedItems);
      // console.log("Fetched items:", fetchedItems); // Optional: keep for debugging
    } catch (e) {
      console.error("Failed to fetch vendor items:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch items'));
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) { // Only fetch if vendorId is available
        fetchItems();
    } else {
        setItems([]); // Clear items if no vendorId (e.g., user logged out)
    }
  }, [vendorId, fetchItems]); // Rerun if vendorId changes

  // Add item
  const addItem = async (itemData: CreateVendorItemPayload): Promise<VendorItem | null> => {
    if (!vendorId) {
      setError(new Error('User not authenticated to add items.'));
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(firestore, VENDOR_ITEMS_COLLECTION), {
        ...itemData,
        vendorId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      // For optimistic update, create the item with current date for display
      const newItem: VendorItem = { 
        id: docRef.id, 
        vendorId, 
        ...itemData, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
      setItems(prev => [newItem, ...prev]); // Optimistically add to list
      return newItem;
    } catch (e) {
      console.error("Failed to add vendor item:", e);
      setError(e instanceof Error ? e : new Error('Failed to add item'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update item
  const updateItem = async (itemId: string, itemData: UpdateVendorItemPayload): Promise<VendorItem | null> => {
    if (!vendorId) {
      setError(new Error('User not authenticated to update items.'));
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const itemRef = doc(firestore, VENDOR_ITEMS_COLLECTION, itemId);
      // Ensure the item belongs to the current vendor before updating (security rule should also enforce this)
      // For client-side check (optional, as rules are primary):
      // const currentItem = items.find(i => i.id === itemId);
      // if (currentItem?.vendorId !== vendorId) {
      //   throw new Error("Permission denied: You can only update your own items.");
      // }

      await updateDoc(itemRef, { 
        ...itemData, 
        updatedAt: Timestamp.now() 
      });
      
      const updatedTimestamp = new Date().toISOString();
      let updatedItemReturn: VendorItem | null = null;

      setItems(prevItems => prevItems.map(item => {
        if (item.id === itemId) {
          updatedItemReturn = { ...item, ...itemData, updatedAt: updatedTimestamp };
          return updatedItemReturn;
        }
        return item;
      }));
      return updatedItemReturn;
    } catch (e) {
      console.error("Failed to update vendor item:", e);
      setError(e instanceof Error ? e : new Error('Failed to update item'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (itemId: string): Promise<boolean> => {
    if (!vendorId) {
        setError(new Error('User not authenticated to delete items.'));
        return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const itemRef = doc(firestore, VENDOR_ITEMS_COLLECTION, itemId);
      // Optional: Client-side check for ownership before deleting
      // const currentItem = items.find(i => i.id === itemId);
      // if (currentItem?.vendorId !== vendorId) {
      //   throw new Error("Permission denied: You can only delete your own items.");
      // }
      await deleteDoc(itemRef);
      setItems(prev => prev.filter(item => item.id !== itemId));
      return true;
    } catch (e) {
      console.error("Failed to delete vendor item:", e);
      setError(e instanceof Error ? e : new Error('Failed to delete item'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem };
};
