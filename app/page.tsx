"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Lock,
  DollarSign,
  HelpCircle,
  Heart,
  HomeIcon,
  MapPin,
  Search,
  Sparkles,
  Trophy,
  User,
  Users,
  Clock,
} from "lucide-react"
import { useState } from "react"

// Dummy data for sparkles (replace with actual data if available)
const sparkles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
}))

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false) // Placeholder for authentication status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Placeholder functions (replace with actual logic)
  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked")
    setIsSignedIn(!isSignedIn) // Toggle for demonstration
  }

  const handleSectionClick = (section: string) => {
    console.log(`Navigated to ${section}`)
    setIsMobileMenuOpen(false) // Close mobile menu after navigation
  }

  const handleVolunteerSection = () => {
    console.log("Navigated to Volunteer section")
    setIsMobileMenuOpen(false)
  }

  const handleGallerySection = () => {
    console.log("Navigated to Gallery section")
    setIsMobileMenuOpen(false)
  }

  const handleParticipantsSection = () => {
    console.log("Navigated to Participants section")
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-orange-50 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-5 z-0"
        style={{
          backgroundImage: "none",
        }}
      />

      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <div className="w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-pulse shadow-lg shadow-amber-300"></div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>

      {/* Header Navigation */}
      <header className="bg-white shadow-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-jpjntClSQEuRWtoby7g0Tz712Dfjjb.jpeg"
                  alt="Pecan Tree"
                  className="w-8 h-8 md:w-12 md:h-12 object-contain opacity-75 mix-blend-overlay filter brightness-75 contrast-125"
                  style={{
                    maskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 100%)",
                    WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0.3) 100%)",
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Google Sign In */}
              <Button
                className={`md:hidden ${
                  isSignedIn
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                } font-medium px-3 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition-all flex items-center space-x-1`}
                onClick={handleGoogleSignIn}
              >
                {isSignedIn ? (
                  <User className="w-4 h-4" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div
                    className={`w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                  ></div>
                  <div className={`w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}></div>
                  <div
                    className={`w-6 h-0.5 bg-gray-600 transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                  ></div>
                </div>
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-jpjntClSQEuRWtoby7g0Tz712Dfjjb.jpeg"
                    alt="Pecan Tree"
                    className="w-6 h-6 object-contain opacity-80 mix-blend-overlay filter brightness-90 contrast-110 saturate-110 drop-shadow-sm"
                  />
                  <HomeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Home</span>
                </a>
                <button
                  onClick={() => handleSectionClick("Registration")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Registration</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <button
                  onClick={handleVolunteerSection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Volunteer</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Events</span>
                </a>
                <button
                  onClick={handleGallerySection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Gallery</span>
                </button>
                <button
                  onClick={handleParticipantsSection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Participants</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <button
                  onClick={() => handleSectionClick("Financials")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Financials</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <a
                  href="#faq"
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">FAQ</span>
                </a>
                <Button
                  className={`${
                    isSignedIn
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                  } font-medium px-4 py-2 rounded-lg text-sm shadow-sm hover:shadow-md transition-all flex items-center space-x-2`}
                  onClick={handleGoogleSignIn}
                >
                  {isSignedIn ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>Signed In</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </Button>
                <Search className="w-5 h-5 text-gray-700 cursor-pointer hover:text-purple-600 transition-colors" />
              </nav>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                >
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-jpjntClSQEuRWtoby7g0Tz712Dfjjb.jpeg"
                    alt="Pecan Tree"
                    className="w-5 h-5 object-contain opacity-80 mix-blend-overlay filter brightness-90 contrast-110 saturate-110 drop-shadow-sm"
                  />
                  <HomeIcon className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </a>
                <button
                  onClick={() => {
                    handleSectionClick("Registration")
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2 text-left"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Registration</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <button
                  onClick={() => {
                    handleVolunteerSection()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2 text-left"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Volunteer</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Events</span>
                </a>
                <button
                  onClick={() => {
                    handleGallerySection()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2 text-left"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Gallery</span>
                </button>
                <button
                  onClick={() => {
                    handleParticipantsSection()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2 text-left"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Participants</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <button
                  onClick={() => {
                    handleSectionClick("Financials")
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2 text-left"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Financials</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors py-2"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">FAQ</span>
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-amber-200/15 text-[40rem] font-bold animate-pulse select-none">✨</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-amber-300/20 to-orange-400/20"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-center relative">
              <div className="relative inline-block">
                <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-amber-500 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-500/30 mix-blend-color-burn rounded-full blur-xl"></div>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <p className="text-purple-700 text-base md:text-lg font-semibold tracking-wide uppercase mb-2">
                Pecan Meadow Community
              </p>
              <p className="text-amber-600 text-lg md:text-xl font-medium italic">Presents</p>
            </div>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
              <h1 className="text-gray-900 text-5xl md:text-7xl lg:text-8xl font-bold font-serif leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  5th Annual
                </span>
                <br />
                <span className="text-amber-600">Diwali</span>
                <br />
                <span className="text-orange-600 text-4xl md:text-6xl">Celebration 2025</span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-purple-200 w-full md:w-auto justify-center">
                <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-800 font-semibold text-sm md:text-base">October 20-22, 2025</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-purple-200 w-full md:w-auto justify-center">
                <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
                {isSignedIn ? (
                  <span className="text-gray-800 font-semibold text-sm md:text-base">
                    1991, Keiva Pl, Allen TX 75013
                  </span>
                ) : (
                  <button
                    onClick={() => alert("Please sign in with Google to view location")}
                    className="text-gray-800 font-semibold hover:text-purple-600 transition-colors text-sm md:text-base"
                  >
                    View location
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-purple-200 w-full md:w-auto justify-center">
                <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-gray-800 font-semibold text-xs md:text-base text-center">6:00 PM - 10:00 PM</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-4 md:mb-6 font-medium px-4">
              Join us for our 5th Annual Diwali celebration - the Festival of Lights! Experience traditional rituals,
              cultural performances, delicious food, and community bonding that brings our neighborhood together in joy
              and light.
            </p>

            <p className="text-gray-600 text-base md:text-lg max-w-5xl mx-auto leading-relaxed px-4">
              Celebrate the victory of light over darkness with three evenings of devotion, music, dance, rangoli
              competitions, diya lighting ceremonies, and fellowship. Immerse yourself in the rich traditions that unite
              our diverse community in celebration.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
