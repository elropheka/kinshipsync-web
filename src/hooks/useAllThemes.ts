import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types/themeTypes';
import { firestore } from '@/services/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

const THEMES_COLLECTION = 'themes'; // Firestore collection name for themes

export const useAllThemes = () => {
  const [allThemes, setAllThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllThemes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const themesCollectionRef = collection(firestore, THEMES_COLLECTION);
      // Order by 'isPredefined' descending (so predefined come first if true), then by name ascending
      const q = query(
        themesCollectionRef,
        orderBy('isPredefined', 'desc'),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);

      const fetchedThemes = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Theme;
      });
      setAllThemes(fetchedThemes);
    } catch (e) {
      console.error("Failed to fetch all themes:", e);
      setError(e instanceof Error ? e : new Error('Failed to fetch themes'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllThemes();
  }, [fetchAllThemes]);

  return { allThemes, isLoading, error, fetchAllThemes };
};
