export function BoardLayout({children}: { children: React.ReactNode }) {
    return (
        <main
            className="
                flex-1 overflow-x-auto overflow-y-hidden
                bg-gradient-to-br from-background to-muted
                px-4 py-6
              "
        >
            <div
                className="
                  flex gap-6
                  min-w-max
                  md:min-w-0
                  md:flex-wrap
                "
            >
                {children}
            </div>
        </main>
    );
}
