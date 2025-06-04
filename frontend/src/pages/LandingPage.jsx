import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, MessageSquare, Calendar, BarChart2, Edit3, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'User Profiling',
      description: 'Create your academic profile showcasing your courses, interests, and study preferences.'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: 'Smart Matching',
      description: 'Our algorithm connects you with ideal study partners based on courses and learning styles.'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: 'Collaboration Tools',
      description: 'Group chats, direct messages, and file sharing to enhance your study sessions.'
    },
    {
      icon: <Calendar className="w-8 h-8 text-yellow-600" />,
      title: 'Calendar Integration',
      description: 'Schedule and organize study sessions seamlessly with integrated calendar features.'
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-red-600" />,
      title: 'Progress Tracking',
      description: 'Monitor your academic progress and stay motivated with achievement tracking.'
    },
    {
      icon: <Edit3 className="w-8 h-8 text-pink-600" />,
      title: 'Blog Section',
      description: 'Share study tips, resources, and experiences with the academic community.'
    }
  ];

  const testimonials = [
    {
      quote: "Study Buddy Finder helped me find classmates for my advanced calculus course. We meet weekly and my grades have improved significantly!",
      author: "Aisha, Computer Science Student",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      quote: "The file sharing and calendar features make organizing group study sessions so easy. It's become an essential tool for my university life.",
      author: "Omar, Engineering Student",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 blur-xl -z-10 animate-float"></div>
      <div className="fixed top-1/3 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl -z-10 animate-float-delay"></div>
      <div className="fixed bottom-1/4 left-1/4 w-20 h-20 bg-yellow-200 rounded-full opacity-20 blur-xl -z-10 animate-float-delay-2"></div>
      
      {/* NavBar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2 hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
            <span>Study Buddy Finder</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-600 hover:text-indigo-600 transition-colors hover:-translate-y-0.5">Features</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 transition-colors hover:-translate-y-0.5">About</Link>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors hover:-translate-y-0.5">Login</Link>
            <Link to="/register" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Connect with the perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">study partner</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Our platform helps university students in Pakistan find ideal study partners, collaborate effectively, and achieve academic success together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                Get Started <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/features" className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Learn More
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center relative">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Students collaborating" 
              className="rounded-xl shadow-2xl w-full max-w-md transform hover:scale-105 transition-transform duration-500 z-10"
            />
            {/* Decorative elements around the image */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-200 rounded-xl opacity-30 -z-10"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-200 rounded-full opacity-30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to study smarter</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to connect with peers and enhance your learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-indigo-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Study Buddy Finder Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started is simple and takes just a few minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-2 group">
              <div className="text-white text-2xl font-bold w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Add your courses, interests, and availability to help us find your perfect matches.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-2 group">
              <div className="text-white text-2xl font-bold w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Find Study Buddies</h3>
              <p className="text-gray-600">
                Browse or get matched with students who share your academic goals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-2 group">
              <div className="text-white text-2xl font-bold w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Collaborating</h3>
              <p className="text-gray-600">
                Connect, schedule sessions, and study together using our integrated tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Students Across Pakistan</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Join thousands of students who are already finding their perfect study partners.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((testimonial, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
        >
          <div className="flex items-center mb-4">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.author} 
              className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-100"
            />
            <div>
              <h4 className="font-semibold text-gray-800">{testimonial.author.split(',')[0]}</h4>
              <p className="text-sm text-gray-500">{testimonial.author.split(',')[1]}</p>
            </div>
          </div>
          <p className="text-gray-600 italic">"{testimonial.quote}"</p>
          <div className="mt-4 flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your study buddy?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join our community of students helping each other succeed academically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2">
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all hover:scale-105 flex items-center justify-center gap-2">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Buddy Finder
              </h3>
              <p className="text-sm">
                Helping students connect and collaborate for academic success since 2025.
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white transition-colors hover:pl-1">Features</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors hover:pl-1">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors hover:pl-1">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition-colors hover:pl-1">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors hover:pl-1">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition-colors hover:pl-1">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Connect</h4>
              <p className="text-sm mb-4">
                Follow us on social media for updates and study tips.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors hover:scale-110">Facebook</a>
                <a href="#" className="hover:text-white transition-colors hover:scale-110">Twitter</a>
                <a href="#" className="hover:text-white transition-colors hover:scale-110">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Study Buddy Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;