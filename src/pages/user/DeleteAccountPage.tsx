import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Trash2, Shield } from 'lucide-react';
import { deleteUserAccount } from '../../services/accountService';

const DeleteAccountPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { userProfile, isLoading: isLoadingProfile } = useUserProfile();
  
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const requiredConfirmationText = "DELETE MY ACCOUNT";
  const isConfirmationValid = confirmationText === requiredConfirmationText;

  const handleDeleteAccount = async () => {
    if (!currentUser?.uid) {
      toast.error("You must be logged in to delete your account.");
      return;
    }

    if (!isConfirmationValid) {
      toast.error("Please type the confirmation text exactly as shown.");
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteUserAccount(currentUser.uid);
      
      if (success) {
        toast.success("Your account has been permanently deleted. You will be redirected to the login page.");
        
        // The account deletion service should handle logout and redirect
        // If not, we can add logout logic here
      } else {
        toast.error("Failed to delete your account. Please try again or contact support.");
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(getErrorMessage(error) || "An unexpected error occurred. Please try again or contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-4 sm:py-6 md:py-10">
        <div className="text-center">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-red-500" />
            <CardTitle className="text-red-600">Delete My Account</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 dark:text-red-200">
              <strong>Warning:</strong> This action will permanently delete your account and all associated data including:
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Your profile information</li>
                <li>All events you've created</li>
                <li>All event invitations and responses</li>
                <li>All chat messages and notifications</li>
                <li>Any uploaded files or images</li>
              </ul>
              This action cannot be undone.
            </div>
          </div>

          {/* Account Information */}
          {userProfile && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Account Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Display Name:</strong> {userProfile.displayName || 'Not set'}</p>
                <p><strong>Email:</strong> {userProfile.email || 'Not available'}</p>
                <p><strong>User ID:</strong> {userProfile.userId}</p>
                <p><strong>Account Created:</strong> {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          )}

          {/* Confirmation Steps */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Security Confirmation</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              To confirm you want to delete your account, please type the following text exactly as shown:
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <code className="text-red-600 dark:text-red-400 font-mono text-sm">
                {requiredConfirmationText}
              </code>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmation" className="text-sm font-medium">
                Type the confirmation text above:
              </label>
              <Input
                id="confirmation"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type the confirmation text here"
                className={isConfirmationValid ? "border-green-500" : ""}
              />
              {isConfirmationValid && (
                <p className="text-sm text-green-600">✓ Confirmation text matches</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isConfirmationValid || isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account Permanently
                </>
              )}
            </Button>
          </div>

          {/* Additional Warning */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              If you're having issues with your account, consider{' '}
              <a href="/dashboard/user/profile" className="text-primary hover:underline">
                updating your profile
              </a>{' '}
              or contacting support instead of deleting your account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteAccountPage;
