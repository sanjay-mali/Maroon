import UserLoginForm from "@/components/user-login-form"
import Footer from "@/components/footer"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="container-custom py-8">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Login</h1>
            </div>
            <UserLoginForm />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
