'use client';

import { signOutAction } from '@/server/user';
import { Button } from './ui/button';
import { LogOutIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LogoutButtonProps {
  className?: string; // allow passing custom classes
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOutAction();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className ?? ''}`} // merge external class
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-white" />
      ) : (
        <>
          <LogOutIcon className="h-4 w-4 text-white" />
          Logout
        </>
      )}
    </Button>
  );
}

