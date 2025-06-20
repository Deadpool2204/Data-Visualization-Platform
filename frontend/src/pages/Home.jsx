import { Link } from "react-router-dom";
import MyDropzone from "../component/MyDropzone";
import DashboardImage1 from "../assets/Picture1.png";
import DashboardImage2 from "../assets/picture2.png";
import DashboardImage3 from "../assets/picture3.png";
import DashboardImage4 from "../assets/picture4.png";


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-700">📊 InsightVision</div>
        <ul className="flex space-x-6">
          <li>
            <Link to="/Home" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Analysis" className="text-gray-700 hover:text-blue-600 font-medium">
              Analysis
            </Link>
          </li>
          <li>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* Intro Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Data Visualization Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our platform helps you analyze business data through beautiful dashboards and interactive charts.
          Upload your datasets and explore insights through automated visualizations. Ideal for students, professionals, and business analysts.
        </p>
      </section>

     {/* Dashboard Sample */}
<section className="px-6 pb-16">
  <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
    Sample Dashboard Preview
  </h2>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
    {[DashboardImage1, DashboardImage2, DashboardImage3, DashboardImage4].map((img, index) => (
      <div
        key={index}
        className="shadow-lg rounded-lg overflow-hidden border border-gray-200"
      >
        <img src={img} alt={`Dashboard Sample ${index + 1}`} className="w-full h-auto" />
      </div>
    ))}
  </div>
</section>
    </div>
  );
};

export default Home;