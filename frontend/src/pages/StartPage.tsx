import {Button} from "@/components/ui/button";

export default function StartPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4
      bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-950 transition-colors">

            {/* App Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 dark:text-purple-400 mb-4">
                Welcome to Taskify
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg max-w-md text-center">
                Organize your tasks effortlessly with modern tech.
            </p>

            {/* Buttons */}
            <div className="flex gap-4">
                <a href="/login">
                    <Button
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 dark:bg-purple-600 dark:hover:bg-purple-500">
                        Login
                    </Button>
                </a>
                <a href="/register">
                    <Button variant="outline"
                            className="border-purple-700 text-purple-700 px-6 py-3 dark:border-purple-400 dark:text-purple-400">
                        Register
                    </Button>
                </a>
            </div>

            {/*/!* Theme Indicator *!/*/}
            {/*<p className="mt-6 text-xs text-gray-500 dark:text-gray-400">*/}
            {/*    Switch theme from the header menu*/}
            {/*</p>*/}
        </div>
    );
}
