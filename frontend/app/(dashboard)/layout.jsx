export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="hidden md:block border-r bg-white">
        <div className="p-4 font-semibold">ShopEase Manager</div>
        <nav className="p-2 space-y-1 text-sm">
          <a className="block px-3 py-2 hover:bg-gray-50" href="/dashboard">Overview</a>
          <a className="block px-3 py-2 hover:bg-gray-50" href="/dashboard/offers">Offers</a>
          <a className="block px-3 py-2 hover:bg-gray-50" href="/dashboard/qr">QR Codes</a>
          <a className="block px-3 py-2 hover:bg-gray-50" href="/dashboard/sales">Sales Upload</a>
        </nav>
      </aside>
      <main className="p-4">{children}</main>
    </div>
  );
}
