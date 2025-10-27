import BottomNavigationBar from "./BottomNav";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="lg:flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-auto example">
          <div className="hidden md:block">
            <Navbar />
          </div>

          <div className="p-4 pb-24">
            {children}
          </div>
        </div>
      </div>

      <div className="block lg:hidden">
        <BottomNavigationBar />
      </div>
    </div>
  );
};

export default MainLayout;
