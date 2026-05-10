import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

export default Layout;
