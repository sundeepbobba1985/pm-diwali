"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { MapPin, Sparkles, User, Clock, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked")
    setIsSignedIn(!isSignedIn)
  }

  const handleSectionClick = (section: string) => {
    console.log(`Navigated to ${section}`)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-semibold text-gray-900">Diwali 2025</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <button
                onClick={() => handleSectionClick("Registration")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Register
              </button>
              <button
                onClick={() => handleSectionClick("Volunteer")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Volunteer
              </button>
              <button
                onClick={() => handleSectionClick("Gallery")}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Gallery
              </button>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleGoogleSignIn}
                variant={isSignedIn ? "default" : "outline"}
                className="hidden md:flex items-center gap-2"
              >
                {isSignedIn ? (
                  <>
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3 border-t border-gray-100 mt-4">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                Home
              </a>
              <button
                onClick={() => handleSectionClick("Registration")}
                className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                Register
              </button>
              <button
                onClick={() => handleSectionClick("Volunteer")}
                className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                Volunteer
              </button>
              <button
                onClick={() => handleSectionClick("Gallery")}
                className="text-sm text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                Gallery
              </button>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 py-2">
                FAQ
              </a>
              <Button onClick={handleGoogleSignIn} variant={isSignedIn ? "default" : "outline"} className="mt-2">
                {isSignedIn ? "Account" : "Sign In"}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50">
            <Sparkles className="w-10 h-10 text-amber-500" />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Pecan Meadow Community</p>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
              5th Annual
              <br />
              <span className="text-amber-500">Diwali Celebration</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join us for three evenings of light, tradition, and community as we celebrate the Festival of Lights
              together.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium">October 20-22, 2025</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="font-medium">6:00 PM - 10:00 PM</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-400" />
              {isSignedIn ? (
                <span className="font-medium">Allen, TX 75013</span>
              ) : (
                <button onClick={handleGoogleSignIn} className="font-medium hover:text-amber-600 transition-colors">
                  Sign in to view
                </button>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => handleSectionClick("Registration")}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8"
            >
              Register Now
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 border-t border-gray-100">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Event Dashboard</h2>
          <p className="text-gray-600">Registration, volunteer, and event details will appear here</p>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2025 Pecan Meadow Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
