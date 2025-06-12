import Sidebar from "../components/public/landing/sidebar";
import TopBar from "../components/public/landing/TopBar";

const Landing = () => {
  return (
    <>
      <TopBar />
      <div className="flex dark:bg-gray-900">
        <Sidebar />
        {/* autres composants */}
      </div>
    </>
  );
};

export default Landing;
