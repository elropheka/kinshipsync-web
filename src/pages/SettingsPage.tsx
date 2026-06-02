import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sectionCardClass = 'rounded-xl border border-border bg-card shadow-sm';

const SettingsPage: React.FC = () => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  const { themeMode, toggleTheme } = useAppTheme();

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10 bg-background max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage appearance and account preferences for {currentUser?.email ?? 'your account'}.
        </p>
      </div>

      <div className="space-y-6">
        <Card className={sectionCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground">Appearance</CardTitle>
            <CardDescription>Choose how KinshipSync looks on this device.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant={themeMode === 'light' ? 'default' : 'outline'}
              className={cn(
                'flex-1 rounded-full',
                themeMode === 'light' && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => themeMode !== 'light' && toggleTheme()}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              type="button"
              variant={themeMode === 'dark' ? 'default' : 'outline'}
              className={cn(
                'flex-1 rounded-full',
                themeMode === 'dark' && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => themeMode !== 'dark' && toggleTheme()}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
          </CardContent>
        </Card>

        <Card className={sectionCardClass}>
          <CardHeader>
            <CardTitle className="text-foreground">Account</CardTitle>
            <CardDescription>Update your name, photo, and profile details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full justify-between rounded-xl border-primary/30 text-primary hover:bg-primary/5 h-12"
            >
              <Link to="/dashboard/user/profile">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Edit profile
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            {userProfile?.role && (
              <p className="text-xs text-muted-foreground mt-3 capitalize">
                Signed in as {userProfile.role}
                {isAdmin ? ' · administrator' : ''}
              </p>
            )}
          </CardContent>
        </Card>

        {!isAdmin && (
          <Card className={cn(sectionCardClass, 'border-destructive/30')}>
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>Permanently remove your account and associated data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10 h-12"
              >
                <Link to="/dashboard/user/delete-my-account">
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete account
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
