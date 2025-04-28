import UserRegisterForm from "@/components/user-register-form";

export default function RegisterPage() {
  return (
    <main className="flex flex-col">
      <div className="container-custom py-8">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Register</h1>
            </div>
            <UserRegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
