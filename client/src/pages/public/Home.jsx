import React, { useState } from 'react';
import { Shield, Zap, Users, Lock, ArrowRight, Menu, X, Check, Github, Chrome } from 'lucide-react';
import {Link } from 'react-router-dom'
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Enterprise-grade security",
      description: "Built-in security best practices with multi-factor authentication and session management."
    },
    {
      icon: Zap,
      title: "Lightning fast setup",
      description: "Get authentication up and running in minutes, not days. Drop-in components ready to use."
    },
    {
      icon: Users,
      title: "User management",
      description: "Complete user profiles, organization support, and role-based access control out of the box."
    },
    {
      icon: Lock,
      title: "Compliance ready",
      description: "SOC 2, GDPR, and CCPA compliant. We handle the compliance so you don't have to."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for side projects and testing",
      features: [
        "Up to 10,000 monthly active users",
        "Email & password authentication",
        "Social login (Google, GitHub)",
        "Community support"
      ]
    },
    {
      name: "Pro",
      price: "$25",
      description: "For growing applications",
      features: [
        "Up to 100,000 monthly active users",
        "Everything in Free",
        "Multi-factor authentication",
        "Advanced customization",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale applications",
      features: [
        "Unlimited monthly active users",
        "Everything in Pro",
        "SSO & SAML",
        "SLA guarantee",
        "Dedicated support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">AuthKit</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
              <a href="#docs" className="text-slate-300 hover:text-white transition">Docs</a>
              <Link to="/login">
              <button className="text-slate-300 hover:text-white transition">Sign in</button>
              </Link>
              <Link to="/signup">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
                Get started
              </button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-300 hover:text-white">Features</a>
              <a href="#pricing" className="block text-slate-300 hover:text-white">Pricing</a>
              <a href="#docs" className="block text-slate-300 hover:text-white">Docs</a>
              <button className="block w-full text-left text-slate-300 hover:text-white">Sign in</button>
              <Link to="/signup">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition">
                Get started
              </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Authentication in minutes, not weeks</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Drop-in authentication
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              for modern apps
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Add complete user management to your application in minutes. Beautiful UI components, 
            powerful APIs, and enterprise-grade security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
           <Link to="/signup">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-500 transition flex items-center space-x-2 text-lg font-medium">
              <span>Start building for free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            </Link>
            <button className="border-2 border-slate-700 text-slate-300 px-8 py-4 rounded-lg hover:border-slate-600 hover:text-white transition text-lg font-medium">
              View documentation
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>10,000 MAUs free</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="mt-16 relative">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700 max-w-4xl mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-slate-900/80 rounded-lg p-8">
              <div className="max-w-md mx-auto bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-2">Welcome back</h3>
                <p className="text-slate-400 mb-6">Sign in to your account</p>
                
                <div className="space-y-3 mb-6">
                  <button className="w-full flex items-center justify-center space-x-2 bg-slate-700/50 border border-slate-600 rounded-lg py-3 hover:bg-slate-700 transition text-white">
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-slate-700/50 border border-slate-600 rounded-lg py-3 hover:bg-slate-700 transition text-white">
                    <Chrome className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </button>
                </div>
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500 transition font-medium">
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900/50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything you need to authenticate
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Production-ready authentication with all the features your users expect
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-indigo-500/10 transition border border-slate-700">
                <feature.icon className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-400">
              Start free and scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border-2 ${
                  plan.popular ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105' : 'border-slate-700'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-slate-400">/month</span>}
                </div>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                
                <button className={`w-full py-3 rounded-lg font-medium transition ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}>
                  {plan.price === "Custom" ? "Contact sales" : "Get started"}
                </button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of developers building with AuthKit
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-slate-100 transition text-lg font-medium">
            Start building for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
                <span className="text-lg font-bold text-white">AuthKit</span>
              </div>
              <p className="text-sm">Authentication for modern applications</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-center">
            © 2025 AuthKit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}