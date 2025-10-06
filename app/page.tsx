"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Music, Heart, Users, X, Sparkles, Gift, Menu } from "lucide-react"

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [loadingParticipants, setLoadingParticipants] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    mobile: "",
    adults: "",
    kids: "",
    zelleConfirmation: "",
  })

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    volunteerType: "",
  })

  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcodeInput, setPasscodeInput] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)

  const [dashboardStats, setDashboardStats] = useState({
    totalFamilies: 0,
    totalAdults: 0,
    totalKids: 0,
  })
  const [isGoogleSheetsConfigured, setIsGoogleSheetsConfigured] = useState(true)

  const loadDashboardStats = async () => {
    try {
      const response = await fetch("/api/get-registrations")
      const data = await response.json()

      if (data.error) {
        setIsGoogleSheetsConfigured(false)
        // Fall back to localStorage silently
        const storedData = localStorage.getItem("pm-diwali-registrations")
        if (storedData) {
          const registrations = JSON.parse(storedData)
          const totalFamilies = registrations.length
          const totalAdults = registrations.reduce((sum: number, r: any) => sum + Number(r.adults || 0), 0)
          const totalKids = registrations.reduce((sum: number, r: any) => sum + Number(r.kids || 0), 0)
          setDashboardStats({ totalFamilies, totalAdults, totalKids })
        }
      } else {
        setIsGoogleSheetsConfigured(true)
        setDashboardStats({
          totalFamilies: data.totalFamilies || 0,
          totalAdults: data.totalAdults || 0,
          totalKids: data.totalKids || 0,
        })
      }
    } catch (error) {
      setIsGoogleSheetsConfigured(false)
      try {
        const storedData = localStorage.getItem("pm-diwali-registrations")
        if (storedData) {
          const registrations = JSON.parse(storedData)
          const totalFamilies = registrations.length
          const totalAdults = registrations.reduce((sum: number, r: any) => sum + Number(r.adults || 0), 0)
          const totalKids = registrations.reduce((sum: number, r: any) => sum + Number(r.kids || 0), 0)
          setDashboardStats({ totalFamilies, totalAdults, totalKids })
        }
      } catch (fallbackError) {
        // Silent fallback error
      }
    }
  }

  useEffect(() => {
    loadDashboardStats()
    const checkAuth = async () => {
      const token = localStorage.getItem("google_auth_token")
      const user = localStorage.getItem("google_user_info")
      if (token && user) {
        setIsSignedIn(true)
        setUserInfo(JSON.parse(user))
      }
    }
    checkAuth()

    const params = new URLSearchParams(window.location.search)
    const authToken = params.get("auth_token")
    const userName = params.get("user_name")
    const userEmail = params.get("user_email")

    if (authToken && userName && userEmail) {
      localStorage.setItem("google_auth_token", authToken)
      localStorage.setItem("google_user_info", JSON.stringify({ name: userName, email: userEmail }))
      setIsSignedIn(true)
      setUserInfo({ name: userName, email: userEmail })

      window.history.replaceState({}, "", "/")
    }

    const statsInterval = setInterval(() => {
      loadDashboardStats()
    }, 30000)

    return () => clearInterval(statsInterval)
  }, [])

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const registrationData = {
        ...formData,
        timestamp: new Date().toISOString(),
      }

      console.log("[v0] Submitting registration:", registrationData)

      const response = await fetch("/api/submit-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()
      console.log("[v0] Registration response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit registration")
      }

      // Also save to localStorage as backup
      const registrations = JSON.parse(localStorage.getItem("pm-diwali-registrations") || "[]")
      registrations.push(registrationData)
      localStorage.setItem("pm-diwali-registrations", JSON.stringify(registrations))

      if (result.warning || result.error) {
        alert(`Registration successful! Note: ${result.warning || result.error}\n\nYour data is saved locally.`)
      } else {
        alert(
          "Registration successful! Your data has been saved to Google Sheets. Thank you for joining our Diwali celebration!",
        )
      }

      setShowRegistrationForm(false)
      setFormData({
        fullName: "",
        email: "",
        address: "",
        mobile: "",
        adults: "",
        kids: "",
        zelleConfirmation: "",
      })
      loadDashboardStats()
    } catch (error) {
      console.error("[v0] Registration error:", error)
      alert("Registration failed. Please try again or contact support.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const volunteerData = {
        ...volunteerForm,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/submit-volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit volunteer registration")
      }

      // Also save to localStorage as backup
      const volunteers = JSON.parse(localStorage.getItem("pm-diwali-volunteers") || "[]")
      volunteers.push(volunteerData)
      localStorage.setItem("pm-diwali-volunteers", JSON.stringify(volunteers))

      if (result.warning || result.error) {
        alert(
          `Volunteer registration successful! Note: ${result.warning || result.error}\n\nYour data is saved locally.`,
        )
      } else {
        alert("Thank you for volunteering! Your registration has been saved to Google Sheets. We'll contact you soon.")
      }

      setShowVolunteerModal(false)
      setVolunteerForm({
        name: "",
        email: "",
        volunteerType: "",
      })
    } catch (error) {
      console.error("Volunteer registration error:", error)
      alert("Volunteer registration failed. Please try again.")
    }
  }

  const handlePasscodeSubmit = () => {
    if (passcodeInput === "diwali2025") {
      setIsAuthenticated(true)
      setShowPasscodeModal(false)
      if (pendingAction === "participants") {
        loadParticipants()
      } else if (pendingAction === "gallery") {
        setShowGallery(true)
      }
      setPendingAction(null)
    } else {
      alert("Incorrect passcode")
    }
  }

  const loadParticipants = () => {
    setLoadingParticipants(true)
    try {
      const data = JSON.parse(localStorage.getItem("pm-diwali-registrations") || "[]")
      setParticipants(data)
      setShowParticipants(true)
    } catch (error) {
      console.error("Error loading participants:", error)
    } finally {
      setLoadingParticipants(false)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google"
  }

  const handleSignOut = () => {
    localStorage.removeItem("google_auth_token")
    localStorage.removeItem("google_user_info")
    setIsSignedIn(false)
    setUserInfo(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700">
      <nav className="bg-transparent backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="font-serif text-xl md:text-2xl font-bold text-white">Diwali 2025</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Register
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Events
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setPendingAction("gallery")
                    setShowPasscodeModal(true)
                  } else {
                    setShowGallery(true)
                  }
                }}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setPendingAction("participants")
                    setShowPasscodeModal(true)
                  } else {
                    loadParticipants()
                  }
                }}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors"
              >
                Participants
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-white hover:bg-white/20 font-semibold"
                onClick={() => (isSignedIn ? handleSignOut() : handleGoogleSignIn())}
              >
                {isSignedIn ? "Sign Out" : "Sign In"}
              </Button>
              <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-white/20 pt-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Register
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Events
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setPendingAction("gallery")
                    setShowPasscodeModal(true)
                  } else {
                    setShowGallery(true)
                  }
                  setIsMobileMenuOpen(false)
                }}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setPendingAction("participants")
                    setShowPasscodeModal(true)
                  } else {
                    loadParticipants()
                  }
                  setIsMobileMenuOpen(false)
                }}
                className="text-base font-bold text-white hover:text-yellow-300 transition-colors text-left"
              >
                Participants
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-white hover:bg-white/20 font-semibold"
                onClick={() => (isSignedIn ? handleSignOut() : handleGoogleSignIn())}
              >
                {isSignedIn ? "Sign Out" : "Sign In"}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <section
        id="home"
        className="relative py-24 md:py-32 bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700"
      >
        <div className="absolute inset-0 bg-[url('/diwali-diyas-rangoli-fireworks.jpg')] opacity-50 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl md:text-3xl font-bold text-yellow-200 mb-6 tracking-wide uppercase drop-shadow-lg">
              Pecan Meadow Community
            </p>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight text-white drop-shadow-2xl">
              5th Annual
              <br />
              <span className="text-yellow-300">Diwali Celebration</span>
              <br />
              2025
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <Calendar className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Saturday, November 1, 2025</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Allen Senior Center, 451 St Mary Dr, Allen, TX 75002
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">5:00 PM - 10:00 PM</span>
              </div>
            </div>

            <p className="text-lg text-white mb-8 max-w-2xl mx-auto leading-relaxed">
              Join us for a magnificent celebration of the Festival of Lights with traditional rituals, vibrant cultural
              performances, delicious dinner, and community bonding.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white"
                onClick={() => scrollToSection("registration")}
              >
                Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white bg-transparent"
                onClick={() => scrollToSection("events")}
              >
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="registration" className="py-16 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-white/20 shadow-2xl backdrop-blur-md bg-black/30">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Registration</h2>
                  <div className="inline-block bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 rounded-full shadow-lg animate-glow">
                    <p className="text-2xl md:text-3xl font-bold text-white">$75 per family</p>
                  </div>
                </div>

                {!isSignedIn ? (
                  <div className="bg-white/10 rounded-xl p-8 border border-white/20">
                    <h3 className="text-xl font-bold mb-3 text-center text-white">Sign In Required</h3>
                    <p className="text-white/80 text-center mb-6 text-sm">
                      Please sign in with Google to access registration
                    </p>
                    <Button
                      className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold flex items-center justify-center gap-3"
                      onClick={handleGoogleSignIn}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                ) : !showRegistrationForm ? (
                  <div className="space-y-6">
                    <div className="bg-white/15 rounded-xl p-6 border border-white/30 shadow-lg">
                      <h3 className="text-lg font-bold mb-4 text-white">Step 1: Payment via Zelle</h3>
                      <p className="text-white/90 mb-4">Send $75 to:</p>
                      <div className="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-lg p-4 mb-4 shadow-lg">
                        <p className="font-mono text-lg text-center font-bold text-white">diwali@pecanmeadow.com</p>
                      </div>
                      <p className="text-sm text-white/80">
                        Include your family name in the note and save the confirmation number
                      </p>
                    </div>

                    <div className="bg-white/15 rounded-xl p-6 border border-white/30 shadow-lg">
                      <h3 className="text-lg font-bold mb-4 text-white">Step 2: Complete Registration</h3>
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg"
                        onClick={() => setShowRegistrationForm(true)}
                      >
                        Complete Registration Form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Address *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Mobile *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Adults *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-white">Kids *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                          value={formData.kids}
                          onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">Zelle Confirmation Number *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                        value={formData.zelleConfirmation}
                        onChange={(e) => setFormData({ ...formData, zelleConfirmation: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
                        onClick={() => setShowRegistrationForm(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="volunteer" className="py-16 bg-gradient-to-br from-purple-700 via-pink-700 to-orange-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Volunteer With Us</h2>
            <p className="text-white/90 leading-relaxed max-w-2xl mx-auto">
              Help make our Diwali celebration memorable! We need volunteers for audio/video setup, decoration, and
              cleanup activities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Audio/Video Setup Co-ordination</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Help coordinate audio/video equipment and technical setup for performances
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Decoration & Setup</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Create beautiful decorations and set up the venue for celebrations
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Clean-up Help</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Assist with post-event cleanup and organizing activities
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold px-8 py-6 text-base shadow-lg"
              onClick={() => setShowVolunteerModal(true)}
            >
              Sign Up to Volunteer
            </Button>
          </div>
        </div>
      </section>

      <section id="events" className="py-16 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Event Schedule</h2>
            <p className="text-white/80 leading-relaxed max-w-2xl mx-auto">
              Get ready for an unforgettable evening! Here's your roadmap to Diwali magic ✨
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-yellow-300">4:45 - 5:30 PM</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white font-semibold">The Calm Before the Storm</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Arrival, setup, and decoration time! Come early, grab the best parking spot, and help us make the
                      venue sparkle.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-pink-300">5:30 PM SHARP</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white font-semibold">Group Cultural Extravaganza Begins!</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      The show starts NOW! Group performances, synchronized dances, and cultural showcases. Don't be
                      late or you'll miss the opening act! 🎭✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-orange-300">7:00 PM</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white font-semibold">Dinner Time & Solo Spotlight</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Feast mode activated! Delicious dinner served while solo performers take the stage. Eat, enjoy,
                      and cheer for the brave souls performing solo! 🍽️🎤
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-purple-300">8:30 - 9:30 PM</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white font-semibold">DJ PARTY TIME! 🎉</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Time to DANCE! DJ takes over, lights go wild, and the dance floor is YOURS. Bring your best moves,
                      your worst moves, we don't judge! 💃🕺
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-emerald-300">9:30 - 10:00 PM</span>
                      <span className="text-white/60">|</span>
                      <span className="text-white font-semibold">Clean-up Crew Assemble!</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Many hands make light work! Help us wrap up the celebration and leave the venue sparkling. Team
                      effort = faster cleanup = everyone goes home happy! 🧹✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Join Our Growing Community</h2>
            <p className="text-white/80 text-sm">See how many families have already registered for Diwali 2025</p>
            {!isGoogleSheetsConfigured && dashboardStats.totalFamilies === 0 && (
              <p className="text-yellow-300 text-xs mt-2">Live stats will appear here once registrations begin</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{dashboardStats.totalFamilies}</div>
                <p className="text-white/80 font-medium">Families Registered</p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{dashboardStats.totalAdults}</div>
                <p className="text-white/80 font-medium">Adults Attending</p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{dashboardStats.totalKids}</div>
                <p className="text-white/80 font-medium">Kids Joining</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-purple-700 via-pink-700 to-fuchsia-700">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-xl">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-glow">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">Share Your Blessings</h2>

                  <p className="text-white/80 mb-6 leading-relaxed">
                    Your participation and feedback help us create meaningful celebrations that strengthen our community
                    bonds and preserve our beautiful traditions for future generations.
                  </p>

                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    Whether you'd like to share a special moment, suggest improvements for next year, or volunteer for
                    upcoming events, we welcome your thoughts and involvement in making our celebrations even more
                    special.
                  </p>

                  <p className="text-white font-semibold mb-8 italic">
                    Shubh Deepavali! Together we celebrate, together we grow.
                  </p>

                  <Button className="bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white px-8 py-6 text-base font-semibold shadow-lg">
                    Share Your Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 bg-gradient-to-br from-orange-700 via-pink-700 to-purple-700">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Frequently Asked Questions</h2>
            <p className="text-white/80">Everything you need to know about our Diwali celebration</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-white mb-2">What is included in the $75 registration fee?</h3>
                <p className="text-white/80 text-sm">
                  The registration fee covers the event center rental, decoration, clean-up help, dinner
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-white mb-2">What should we bring?</h3>
                <p className="text-white/80 text-sm">
                  Please bring your enthusiasm and devotion! Traditional attire is encouraged.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-white mb-2">Can we volunteer?</h3>
                <p className="text-white/80 text-sm">
                  We welcome volunteers for various activities including Audio/video, decoration, setup, and cleanup.
                  Please use the volunteer section to sign up.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-white mb-2">Is parking available?</h3>
                <p className="text-white/80 text-sm">
                  Yes, ample parking is available at Allen Senior Center (451 St Mary Dr, Allen, TX 75002). Please
                  carpool when possible to ensure everyone has convenient access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 border-t border-white/20 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-serif text-lg font-semibold text-white">Diwali 2025</span>
          </div>
          <p className="text-sm text-white/80">© 2025 Pecan Meadow Community. All rights reserved.</p>
          <p className="text-xs text-white/60 mt-2">Celebrating traditions, building community</p>
        </div>
      </footer>

      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Enter Passcode</h3>
                <button onClick={() => setShowPasscodeModal(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 mb-4"
                placeholder="Enter passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasscodeSubmit()}
              />
              <Button
                className="w-full bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white"
                onClick={handlePasscodeSubmit}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showParticipants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Registered Participants</h3>
                <button onClick={() => setShowParticipants(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {loadingParticipants ? (
                <p className="text-center text-white/80">Loading...</p>
              ) : participants.length === 0 ? (
                <p className="text-center text-white/80">No participants yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 font-medium text-white">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Adults</th>
                        <th className="text-left py-3 px-4 font-medium text-white">Kids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p: any, i: number) => (
                        <tr key={i} className="border-b border-white/20">
                          <td className="py-3 px-4 text-white">{p.fullName}</td>
                          <td className="py-3 px-4 text-white">{p.email}</td>
                          <td className="py-3 px-4 text-white">{p.adults}</td>
                          <td className="py-3 px-4 text-white">{p.kids}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Event Gallery</h3>
                <button onClick={() => setShowGallery(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-center text-white/80">Gallery coming soon! Photos will be added during the event.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-white/20 shadow-2xl backdrop-blur-md bg-black/30">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Volunteer Registration</h3>
                <button onClick={() => setShowVolunteerModal(false)} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/50 focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Volunteer Activity *</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/10 text-white focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
                    value={volunteerForm.volunteerType}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, volunteerType: e.target.value })}
                  >
                    <option value="" className="bg-gray-800">
                      Select an activity
                    </option>
                    <option value="Audio/Video Setup Co-ordination" className="bg-gray-800">
                      Audio/Video Setup Co-ordination
                    </option>
                    <option value="Decoration & setup" className="bg-gray-800">
                      Decoration & setup
                    </option>
                    <option value="Clean-up Help" className="bg-gray-800">
                      Clean-up Help
                    </option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold shadow-lg"
                >
                  Submit Volunteer Registration
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
