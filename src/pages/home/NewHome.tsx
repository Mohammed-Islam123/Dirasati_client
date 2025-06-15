import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaChartLine,
  FaCreditCard,
  FaComments,
  FaCheckCircle,
  FaPlay,
  FaCalendar,
  FaShieldAlt,
  FaBell,
  FaUser,
  FaChevronDown,
  FaUsers,
  FaUserCheck,
  FaBars,
  FaTimes,
  FaGraduationCap,
} from "react-icons/fa";

// Check if user is logged in
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem("dirasati_token");
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
};

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { id: "solutions", label: "Solutions", href: "#solutions" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    {
      id: "success-stories",
      label: "Success Stories",
      href: "#success-stories",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      const sections = ["hero", "solutions", "pricing", "success-stories"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const handleDemoClick = () => {
    const element = document.querySelector("#demo-request");
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavClick("#hero")}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
              >
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                  <FaGraduationCap size={24} color="white" />
                </div>
                <span className="text-xl font-bold text-blue-800">
                  Dirasati
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-2 py-1 font-medium transition-colors duration-300 ${
                    activeSection === item.id
                      ? "text-blue-800 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 font-medium text-blue-800 hover:text-blue-600 transition-colors duration-300"
              >
                Login
              </button>
              <button
                onClick={handleDemoClick}
                className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Request Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <span className="text-lg font-semibold text-blue-800">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                aria-label="Close menu"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <nav className="p-6 space-y-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left py-3 px-4 rounded-lg transition-colors duration-300 ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 px-4 rounded-lg text-blue-800 font-medium hover:bg-blue-50 transition-colors duration-300 mb-4"
                >
                  Login
                </button>
                <button
                  onClick={handleDemoClick}
                  className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Request Demo
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  const [animatedCounts, setAnimatedCounts] = useState({
    schools: 0,
    students: 0,
    timeSaved: 0,
  });

  useEffect(() => {
    // Animate counters
    const animateCounter = (
      target: number,
      key: keyof typeof animatedCounts
    ) => {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedCounts((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, 30);
    };

    const timer = setTimeout(() => {
      animateCounter(250, "schools");
      animateCounter(45000, "students");
      animateCounter(60, "timeSaved");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <section
      id="hero"
      className="relative pt-20 min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 animate-gradient-x opacity-95" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/public/classroom-pattern.svg')`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)] py-20">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Problem-focused headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Stop Drowning in{" "}
              <span className="text-emerald-400 font-serif">
                School Administration
              </span>
            </h1>

            {/* Solution-oriented subheadline */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Dirasati automates enrollment, attendance, payments, and parent
              communication in one secure platform
            </p>

            {/* Value proposition */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <p className="text-white/95 text-lg">
                <FaCheckCircle
                  size={20}
                  color="var(--tw-text-opacity-emerald-400)"
                  className="inline mr-2"
                />
                Reduce administrative workload by 60%
              </p>
              <p className="text-white/95 text-lg mt-2">
                <FaCheckCircle
                  size={20}
                  color="var(--tw-text-opacity-emerald-400)"
                  className="inline mr-2"
                />
                FERPA compliant & secure
              </p>
              <p className="text-white/95 text-lg mt-2">
                <FaCheckCircle
                  size={20}
                  color="var(--tw-text-opacity-emerald-400)"
                  className="inline mr-2"
                />
                Trusted by 250+ schools
              </p>
            </div>

            {/* Dual CTA Strategy */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleLogin}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 ease-in-out shadow-lg flex items-center justify-center space-x-2"
              >
                <FaCalendar size={20} />
                <span>Login to System</span>
              </button>

              <button
                onClick={handleRegister}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 ease-in-out border border-white/30 flex items-center justify-center space-x-2"
              >
                <FaPlay size={20} />
                <span>Register Now</span>
              </button>
            </div>

            {/* Trust Bar with Animated Metrics */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                  {animatedCounts.schools}+
                </div>
                <div className="text-white/80 text-sm">Schools Served</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                  {animatedCounts.students.toLocaleString()}+
                </div>
                <div className="text-white/80 text-sm">Students Managed</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                  {animatedCounts.timeSaved}%
                </div>
                <div className="text-white/80 text-sm">Time Saved</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              {/* Dashboard Preview Mockup */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-800 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <FaGraduationCap size={16} color="white" />
                    </div>
                    <span className="text-white font-semibold">
                      Dirasati Dashboard
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-100 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <FaUsers size={20} className="text-emerald-500" />
                        <span className="text-2xl font-bold text-emerald-500">
                          1,247
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Total Students</p>
                    </div>

                    <div className="bg-blue-100 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <FaUserCheck size={20} className="text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                          94%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Attendance Rate</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                          <FaUser size={14} color="white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Ahmed Al-Rashid
                          </p>
                          <p className="text-sm text-gray-500">Grade 10-A</p>
                        </div>
                      </div>
                      <div className="text-emerald-500 font-semibold">
                        Present
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <FaUser size={14} color="white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Fatima Hassan
                          </p>
                          <p className="text-sm text-gray-500">Grade 9-B</p>
                        </div>
                      </div>
                      <div className="text-emerald-500 font-semibold">
                        Present
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg animate-bounce">
              <FaBell size={20} />
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-full shadow-lg">
              <FaShieldAlt size={20} className="text-blue-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
        <FaChevronDown size={24} />
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <FaUserGraduate size={24} className="mb-4 text-blue-600" />,
      title: "Student Management",
      description:
        "Efficient student registration, enrollment tracking, and academic history management",
    },
    {
      icon: <FaChartLine size={24} className="mb-4 text-blue-600" />,
      title: "Attendance Tracking",
      description:
        "Automated attendance system with real-time notifications and comprehensive reports",
    },
    {
      icon: <FaCalendarAlt size={24} className="mb-4 text-blue-600" />,
      title: "Timetable Management",
      description:
        "Smart scheduling with real-time updates and multi-device access for all users",
    },
    {
      icon: <FaCreditCard size={24} className="mb-4 text-blue-600" />,
      title: "Payment Processing",
      description:
        "Automated invoicing, payment tracking, and secure online payment options",
    },
    {
      icon: <FaComments size={24} className="mb-4 text-blue-600" />,
      title: "Communication Tools",
      description:
        "Integrated messaging system connecting parents, teachers, and administrators",
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-800">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center">
                {feature.icon}
                <h3 className="text-xl font-bold mb-4 text-blue-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  return (
    <section id="success-stories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-800">
          Why Schools Choose Dirasati
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <p className="italic mb-6 text-gray-700">
              "Dirasati has transformed how we manage our school operations. The
              system is intuitive and has drastically reduced our administrative
              workload."
            </p>
            <p className="font-semibold text-blue-800">— School Principal</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <p className="italic mb-6 text-gray-700">
              "As a teacher, I can easily track attendance and communicate with
              parents. The scheduling system has made planning so much simpler."
            </p>
            <p className="font-semibold text-blue-800">— High School Teacher</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <p className="italic mb-6 text-gray-700">
              "I appreciate being able to track my children's progress and
              communicate directly with their teachers. The payment system is
              also very convenient."
            </p>
            <p className="font-semibold text-blue-800">— Parent</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-blue-800">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Choose the plan that fits your school's needs, with no hidden costs or
          surprises
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">
                Perfect for small institutions
              </p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-blue-800">$299</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Up to 300 students</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Core attendance features</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Basic scheduling tools</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={() => navigate("/register")}
                className="w-full py-3 px-6 bg-blue-100 text-blue-800 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-300"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-2xl shadow-xl overflow-hidden transform scale-105">
            <div className="p-1">
              <div className="bg-white rounded-2xl p-8">
                <div className="bg-blue-800 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-2">
                  Professional
                </h3>
                <p className="text-gray-600 mb-6">For growing schools</p>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-blue-800">$599</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                    <span>Up to 800 students</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                    <span>Advanced attendance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                    <span>Full scheduling system</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                    <span>Payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                    <span>Priority email & phone support</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 px-6 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">
                Enterprise
              </h3>
              <p className="text-gray-600 mb-6">For large institutions</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold text-blue-800">$999</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Unlimited students</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>All Professional features</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>API access</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-emerald-500 mt-1 mr-2" />
                  <span>24/7 dedicated support</span>
                </li>
              </ul>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={() => navigate("/register")}
                className="w-full py-3 px-6 bg-blue-100 text-blue-800 font-medium rounded-lg hover:bg-blue-200 transition-colors duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Demo Request Section Component
const DemoRequestSection = () => {
  const navigate = useNavigate();

  return (
    <section id="demo-request" className="py-20 bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Ready to Transform Your School Management?
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
          Join thousands of educational institutions using Dirasati to
          streamline operations and enhance communication.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-white text-blue-800 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Get Started Today
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
          >
            Existing Users Login
          </button>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Dirasati</h2>
            <p className="text-gray-400">School Management System</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Register
            </button>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© {currentYear} Dirasati. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// AnimationStyles Component
const AnimationStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradient-x {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }
      
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 15s ease infinite;
      }
      
      .animate-bounce {
        animation: bounce 2s infinite;
      }
      
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(0);
        }
      }
      
      .backdrop-blur-sm {
        backdrop-filter: blur(8px);
      }
      
      .backdrop-blur-nav {
        backdrop-filter: blur(12px);
      }
      
      .shadow-nav {
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      
      .shadow-cta {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <AnimationStyles />
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <DemoRequestSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
