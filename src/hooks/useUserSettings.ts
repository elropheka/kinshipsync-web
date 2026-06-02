import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserSettingsService } from '@/services/userSettingsService';
import type { UpdateUserSettingsPayload, UserSettings } from '@/types/userSettingsTypes';

interface UseUserSettingsResult {
  settings: UserSettings | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: Error | null;
  updateSettings: (payload: UpdateUserSettingsPayload) => Promise<boolean>;
  refetchSettings: () => Promise<void>;
}

export const useUserSettings = (): UseUserSettingsResult => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetchSettings = useCallback(async () => {
    if (!currentUser?.uid) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const next = await UserSettingsService.getUserSettings(currentUser.uid);
      setSettings(next);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load settings'));
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    void refetchSettings();
  }, [refetchSettings]);

  const updateSettings = useCallback(
    async (payload: UpdateUserSettingsPayload): Promise<boolean> => {
      if (!currentUser?.uid) return false;

      setIsUpdating(true);
      setError(null);
      try {
        const next = await UserSettingsService.updateUserSettings(currentUser.uid, payload);
        setSettings(next);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to update settings'));
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [currentUser?.uid]
  );

  return { settings, isLoading, isUpdating, error, updateSettings, refetchSettings };
};
