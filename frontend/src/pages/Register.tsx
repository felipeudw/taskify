import {AuthForm} from "@/components/auth/AuthForm";

export default function Register() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4
      bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-950 transition-colors">

            {/* Taskify Logo */}
            <a href="/"
               className="absolute top-6 text-3xl font-extrabold text-purple-700 dark:text-purple-400 hover:opacity-80 transition">
                Taskify
            </a>

            <div className="flex flex-col items-center mb-6 mt-12">
                <h1 className="text-4xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                    Create Your Account
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Start organizing your tasks today
                </p>
            </div>

            <AuthForm type="register"/>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-purple-700 dark:text-purple-400 font-semibold hover:underline">
                    Login
                </a>
            </p>
        </div>
    );
}
