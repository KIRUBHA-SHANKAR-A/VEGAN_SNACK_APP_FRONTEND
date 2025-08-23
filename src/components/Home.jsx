import React from "react";
import { Leaf, Heart, Users, Star, CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="text-green-600" size={32} />,
      title: "100% Vegan",
      description: "All snacks are carefully curated to be completely plant-based and cruelty-free."
    },
    {
      icon: <Heart className="text-red-500" size={32} />,
      title: "Health Focused",
      description: "Nutritious options that don't compromise on taste or your health goals."
    },
    {
      icon: <Users className="text-blue-500" size={32} />,
      title: "Community Driven",
      description: "Share your favorite finds and discover new snacks from fellow vegans."
    }
  ];

  const popularSnacks = [
    {
      name: "Quinoa Crunch Bars",
      rating: 4.8,
      category: "Protein Bars",
      image: "🥜"
    },
    {
      name: "Coconut Energy Bites",
      rating: 4.9,
      category: "Energy Snacks",
      image: "🥥"
    },
    {
      name: "Kale Chips Original",
      rating: 4.6,
      category: "Chips",
      image: "🥬"
    },
    {
      name: "Almond Butter Cookies",
      rating: 4.7,
      category: "Cookies",
      image: "🍪"
    }
  ];

  const benefits = [
    "Discover new vegan snacks daily",
    "Read honest reviews from the community",
    "Add your own favorite snacks",
    "Filter by dietary restrictions",
    "Get nutritional information",
    "Connect with like-minded snackers"
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-green-800 leading-tight">
                  Discover Amazing
                  <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent block">
                    Vegan Snacks
                  </span>
                </h1>
                <p className="text-xl text-green-600 mt-6 leading-relaxed">
                  Join our community of conscious snackers. Find, share, and enjoy 
                  the best plant-based treats that are good for you and the planet.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <button onClick = {navigate("/snacks")} className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center group">
                  Explore Snacks
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button> */}
                {/* <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105">
                  Add Your Snack
                </button> */}
              </div> 

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">500+</div>
                  <div className="text-green-600 text-sm">Snacks Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">1.2k+</div>
                  <div className="text-green-600 text-sm">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">4.9</div>
                  <div className="text-green-600 text-sm">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-6xl mb-4 text-center">🥗</div>
                  <h3 className="text-xl font-semibold text-green-800 text-center mb-2">
                    Healthy & Delicious
                  </h3>
                  <p className="text-green-600 text-center">
                    Snacks that fuel your body and satisfy your cravings
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 animate-bounce">
                <Star size={20} className="text-yellow-800" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-red-400 rounded-full p-3 animate-pulse">
                <Heart size={20} className="text-red-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Why Choose VeeGo?
            </h2>
            <p className="text-xl text-green-600 max-w-2xl mx-auto">
              We're more than just a snack directory - we're a community dedicated to healthy, sustainable snacking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{feature.title}</h3>
                  <p className="text-green-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Snacks Section */}
      {/* <section className="py-20 bg-gradient-to-r from-green-50 to-green-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Popular This Week
            </h2>
            <p className="text-xl text-green-600">
              Check out what the community is loving right now
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSnacks.map((snack, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <div className="text-4xl text-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {snack.image}
                </div>
                <h3 className="font-semibold text-green-800 mb-2 text-center">{snack.name}</h3>
                <p className="text-green-600 text-sm text-center mb-3">{snack.category}</p>
                <div className="flex items-center justify-center space-x-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-green-700 font-medium">{snack.rating}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg">
              View All Snacks
            </button>
          </div>
        </div>
      </section> */}

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
                Everything You Need for Better Snacking
              </h2>
              <p className="text-xl text-green-600 mb-8">
                VeeGo provides all the tools and community support you need to make informed, healthy snacking choices.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <CheckCircle size={20} className="text-green-500 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-green-700">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* <button className="mt-8 bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-600 transition-all duration-300 hover:scale-105 shadow-lg">
                Get Started Today
              </button> */}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">Almond Energy Balls</div>
                        <div className="text-green-600 text-sm">⭐ 4.9 • High Protein</div>
                      </div>
                    </div>
                    <div className="h-px bg-green-100"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Heart size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">Coconut Chips</div>
                        <div className="text-green-600 text-sm">⭐ 4.7 • Gluten Free</div>
                      </div>
                    </div>
                    <div className="h-px bg-green-100"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">Dark Chocolate Bites</div>
                        <div className="text-green-600 text-sm">⭐ 4.8 • Antioxidant Rich</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Vegan Snacking Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy snackers who've discovered their new favorite treats through VeeGo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-lg">
              Browse Snacks Now
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 hover:scale-105">
              Share Your Favorites
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}