import HeroSection from '../components/home/HeroSection';
import VehiclesSection from '../components/home/VehiclesSection';
import ServicesSection from '../components/home/ServicesSection';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AboutSection from '../components/home/AboutSection';
import ContactSection from '../components/home/ContactSection';
import MeetOwnerSection from '../components/home/MeetOwnerSection';

const Home = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <VehiclesSection />
      <ServicesSection />
      <MeetOwnerSection />
      <HowItWorks />
      <WhyChooseUs />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Home;
