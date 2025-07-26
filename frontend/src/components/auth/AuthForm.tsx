import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Form, FormField, FormItem, FormControl, FormMessage} from "@/components/ui/form.tsx";
import {useAuthStore} from "@/store/authStore.ts";

const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AuthForm({type}: { type: "login" | "register" }) {
    const {login, register, loading, error} = useAuthStore();
    const action = type === "login" ? login : register;

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {email: "", password: ""},
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        await action(values);
        if (!useAuthStore.getState().error) {
            window.location.href = "/boards";
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-purple-800">
                    {type === "login" ? "Login" : "Create Account"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <Button
                            disabled={loading}
                            className="w-full bg-purple-700 hover:bg-purple-800"
                            type="submit"
                        >
                            {loading ? "Please wait..." : type === "login" ? "Login" : "Register"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
