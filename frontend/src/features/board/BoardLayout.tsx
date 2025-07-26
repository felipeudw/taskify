export function BoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex gap-6 p-6 overflow-x-auto h-full bg-gradient-to-br from-background to-muted">
            {children}
        </main>
    );
}