// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export function AdminLoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     try {
//       const success = await signInUser(email, password);
//       if (success) {
//         toast({
//           title: "Success",
//           description: "You have signed in successfully.",
//         });
//         router.push("/admin/dashboard");
//       } else {
//         toast({
//           title: "Error",
//           description: "There was an error signing in.",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//       });
//       console.log(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <Input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>
//       <div>
//         <Input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>
//       <Button type="submit">Sign In</Button>
//     </form>
//   );
// }
