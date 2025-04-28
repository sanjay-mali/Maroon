import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  getAdminProfile,
  updateAdminEmail,
  updateAdminName,
  updateAdminPassword,
} from '@/lib/appwrite';

interface AdminProfileFormProps {
}

export function AdminProfileForm({}: AdminProfileFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const profile = await getAdminProfile();
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
      }
    };
    fetchAdminProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Passwords do not match',
      });
      return;
    }
    const nameUpdate = await updateAdminName(name);
    const emailUpdate = await updateAdminEmail(email);
    const passwordUpdate = await updateAdminPassword(password);
    if(nameUpdate && emailUpdate && passwordUpdate){
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated.',
      });
    }else{
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'there was an error updating the profile',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}