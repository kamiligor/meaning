import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | jhalm",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F1F4F6]">
      <header className="sticky top-0 z-50 bg-[#1E2A36]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-white font-serif font-bold text-lg">
              jhalm
            </a>
            <span className="text-[#8A99A8] text-xs tracking-widest uppercase">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="/admin"
              className="text-[#a3c4b3] text-sm font-medium hover:text-white transition"
            >
              Posts
            </a>
            <a
              href="/admin/kurs"
              className="text-[#a3c4b3] text-sm font-medium hover:text-white transition"
            >
              Kurs
            </a>
            <a
              href="/admin/statystyki"
              className="text-[#a3c4b3] text-sm font-medium hover:text-white transition"
            >
              Statystyki
            </a>
            <a
              href="/admin/tagi"
              className="text-[#a3c4b3] text-sm font-medium hover:text-white transition"
            >
              Tagi
            </a>
            <a
              href="/"
              className="text-[#8A99A8] text-sm hover:text-white transition"
              target="_blank"
            >
              View Site
            </a>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        (await cookies()).set("jh-admin-token", "", { maxAge: 0, path: "/" });
        const { redirect } = await import("next/navigation");
        redirect("/admin/login");
      }}
    >
      <button
        type="submit"
        className="text-[#8A99A8] text-sm hover:text-red-400 transition"
      >
        Logout
      </button>
    </form>
  );
}
