import {AuthForm} from "@/components/auth/AuthForm";

export default function Login() {
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
                    Welcome Back
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Log in to manage your boards
                </p>
            </div>

            <AuthForm type="login"/>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                Don’t have an account?{" "}
                <a href="/register" className="text-purple-700 dark:text-purple-400 font-semibold hover:underline">
                    Register
                </a>
            </p>
        </div>
    );
}
