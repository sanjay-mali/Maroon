import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label";
import { useState } from 'react'
import { signIn } from '@/lib/appwrite'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function UserLoginForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const session = await signIn(email, password); if (session) {

        toast({
          title: "Success",
          description: "You have signed in successfully.",
        })
        router.push("/");
      } else { \      toast({ title: "Error", description: "There was an error signing in.", }); }
    } catch (error) {
      toast({ title: "Error", description: error.message, }); console.log(error)
    }
  }

  return (< form onSubmit={handleSubmit} className="max-w-md mx-auto" > < div className="grid gap-4" > < div className="grid gap-2" > < Label htmlFor="email" > Email</Label > < Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)
  } />        
  </div > < div className="grid gap-2" > < Label htmlFor="password" > Password</Label > < Input id="password" type="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />        </div > < Button type="submit" > Login</Button > < p className="text-center" >          Don\'t have an account?{' '}          <Link href="/register" className="text-primary hover:underline">            Register          </Link>        </p>      </div>    </form>);

return (
  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" required />
      </div>
      <Button type="submit">Login</Button>
      <p className="text-center">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  </form>
);
}