import MatchingOpponents from "../components/MatchOpponents";
import Navbar from "../components/navbar";

const MatchingPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <Navbar />
      </div>
      <div className="flex-1 bg-white">
        <MatchingOpponents />
      </div>
    </div>
  );
};

export default MatchingPage;
