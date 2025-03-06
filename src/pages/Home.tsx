
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import VerticalsSection from "../components/VerticalsSection";
import EventsSection from "../components/EventsSection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <AboutSection />
      <VerticalsSection />
      <EventsSection />
      <Footer />
    </main>
  );
};

export default Home;
