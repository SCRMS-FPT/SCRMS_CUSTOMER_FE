import Navbar from "./Navbar";

const Layout = ({ children, className = "" }) => {
  return (
    <div>
      <Navbar />
      <main className={className}>{children}</main>
    </div>
  );
};

export default Layout;
