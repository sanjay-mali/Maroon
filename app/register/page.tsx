tsx
import UserRegisterForm from "@/components/user-register-form";

export default function RegisterPage() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Register</h1>
      <UserRegisterForm />
    </div>
  );
}