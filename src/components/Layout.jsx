import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
};

export default Layout;
