export function BoardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main
            className="
        flex-1
        bg-gradient-to-br from-background to-muted
        px-4 py-6
        overflow-x-auto
      "
        >
            <div
                className="
          flex gap-6
          w-max
        "
            >
                {children}
            </div>
        </main>
    );
}
