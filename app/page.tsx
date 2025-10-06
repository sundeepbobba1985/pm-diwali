"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Music, Heart, Users, X, Zap, Sparkles, Gift, Menu } from "lucide-react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcodeInput, setPasscodeInput] = useState("")
  const [pendingAction, setPendingAction] = useState<"participants" | "gallery" | null>(null)

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [participants, setParticipants] = useState([])
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

  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [showFinancials, setShowFinancials] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const [expenseFormData, setExpenseFormData] = useState({
    category: "",
    description: "",
    amount: "",
    date: "",
    paidBy: "",
    receipt: "",
  })

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    volunteerType: "",
    cleanupDate: "",
  })

  const [volunteerCounts, setVolunteerCounts] = useState({
    "Prasadam Morning": 0,
    "Prasadam Evening": 0,
  })

  const [adminEmails] = useState([
    "admin1@gmail.com",
    "admin2@gmail.com",
    "admin3@gmail.com",
    "SUNDEEPBOBBA@GMAIL.COM",
    "sundeepbobba@gmail.com",
  ])
  const [eventBudget, setEventBudget] = useState(2250)
  const [showBudgetConfig, setShowBudgetConfig] = useState(false)
  const [newBudget, setNewBudget] = useState("")
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsError, setParticipantsError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showGallery, setShowGallery] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageCaption, setNewImageCaption] = useState("")
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; caption: string }>>([])
  const [showAddImages, setShowAddImages] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState({
    totalFamilies: 0,
    totalAdults: 0,
    totalKids: 0,
  })

  const [showVolunteerModal, setShowVolunteerModal] = useState(false)

  const [visitorCount, setVisitorCount] = useState<number>(0)

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const volunteers = JSON.parse(localStorage.getItem("pm-diwali-volunteers") || "[]")
      volunteers.push({
        ...volunteerForm,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("pm-diwali-volunteers", JSON.stringify(volunteers))

      alert("Thank you for volunteering! We'll contact you soon.")
      setShowVolunteerModal(false)
      setVolunteerForm({
        name: "",
        email: "",
        volunteerType: "",
        cleanupDate: "",
      })
    } catch (error) {
      alert("Volunteer registration failed. Please try again.")
    }
  }

  const loadDashboardStats = async () => {
    try {
      const storedData = localStorage.getItem("pm-diwali-registrations")
      if (storedData) {
        const registrations = JSON.parse(storedData)
        const totalFamilies = registrations.length
        const totalAdults = registrations.reduce((sum: number, r: any) => sum + Number(r.adults || 0), 0)
        const totalKids = registrations.reduce((sum: number, r: any) => sum + Number(r.kids || 0), 0)
        setDashboardStats({ totalFamilies, totalAdults, totalKids })
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const isAdmin = userInfo && adminEmails.includes(userInfo.email.toUpperCase())

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const registrations = JSON.parse(localStorage.getItem("pm-diwali-registrations") || "[]")
      registrations.push({
        ...formData,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("pm-diwali-registrations", JSON.stringify(registrations))

      alert("Registration successful! Thank you for joining our Diwali celebration!")
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
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* Navigation */}
      <nav className="border-b border-orange-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Registration
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
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
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
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
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Participants
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                FAQ
              </button>
            </div>

            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            <Button
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
              onClick={() => setIsSignedIn(!isSignedIn)}
            >
              {isSignedIn ? "Sign Out" : "Sign in with Google"}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
              >
                Registration
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
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
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
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
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
              >
                Participants
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors py-2"
              >
                FAQ
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-40 w-48 h-48 bg-red-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-40 w-56 h-56 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-orange-300/30 rounded-full"></div>
        <div className="absolute top-20 left-20 w-24 h-24 border-4 border-amber-300/30 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-red-300/30 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border-4 border-yellow-300/30 rounded-full"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-orange-400 via-amber-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <Zap className="w-20 h-20 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-orange-400 rounded-full animate-bounce delay-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute top-0 left-0 w-6 h-6 bg-red-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-amber-400 rounded-full animate-ping delay-75"></div>

                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <p className="text-orange-600 font-semibold mb-4 tracking-wide uppercase text-sm">Pecan Meadow Community</p>
            <p className="text-orange-500 font-medium mb-6">Proudly Presents</p>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance">
              <span className="text-orange-600">5th Annual</span>
              <br />
              <span className="text-amber-600">Diwali</span>
              <br />
              <span className="text-red-600">Celebration</span>
              <br />
              <span className="text-orange-500">2025</span>
            </h1>

            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-400"></div>
                <Sparkles className="w-5 h-5 text-orange-500" />
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <Sparkles className="w-5 h-5 text-red-500" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-red-400"></div>
              </div>
            </div>

            {/* Event Details Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md border border-orange-200 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">October 20-22, 2025</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md border border-orange-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Community Center</span>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md border border-orange-200 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">6:00 PM - 10:00 PM</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Join us for a magnificent celebration of the Festival of Lights with traditional rituals, vibrant cultural
              performances, delicious prasadam, spectacular fireworks, and community bonding that brings our
              neighborhood together in the spirit of joy and prosperity.
            </p>

            <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed mb-6">
              Experience the divine blessings of Lakshmi and Ganesha through traditional puja, devotion, music, dance,
              and fellowship. From morning aarti to evening cultural programs and dazzling fireworks display, immerse
              yourself in the rich traditions that unite our diverse community in celebration.
            </p>

            <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-red-100 rounded-2xl p-6 border-2 border-orange-300 max-w-2xl mx-auto">
              <p className="text-orange-700 font-semibold text-lg italic">
                "May the divine light of Diwali spread peace, prosperity, happiness, and good health in your life"
              </p>
              <p className="text-amber-600 text-sm mt-2">शुभ दीपावली - Shubh Deepavali</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Dashboard */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h2>
            <p className="text-gray-600">Live registration statistics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{dashboardStats.totalFamilies}</div>
                <div className="text-sm text-gray-600 font-medium">Registered Families</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{dashboardStats.totalAdults}</div>
                <div className="text-sm text-gray-600 font-medium">Total Adults</div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{dashboardStats.totalKids}</div>
                <div className="text-sm text-gray-600 font-medium">Total Kids</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Process */}
      <section id="registration" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-orange-200 shadow-2xl">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Process</h2>
                  <p className="text-orange-600 font-semibold">$75 per family - Two simple steps</p>
                </div>

                {!isSignedIn ? (
                  <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sign In Required</h3>
                    <p className="text-gray-600 text-center mb-6 text-sm">
                      Please sign in with Google to access registration and payment information
                    </p>
                    <Button
                      className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
                      onClick={() => setIsSignedIn(true)}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                      Continue with Google
                    </Button>
                  </div>
                ) : !showRegistrationForm ? (
                  <div className="space-y-6">
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Step 1: Payment via Zelle</h3>
                      <p className="text-gray-700 mb-4">Send $75 to:</p>
                      <div className="bg-white rounded-lg p-4 border border-orange-300 mb-4">
                        <p className="font-mono text-lg text-center text-orange-600 font-bold">
                          diwali@pecanmeadow.com
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Please include your family name in the Zelle note and save the confirmation number
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Step 2: Complete Registration</h3>
                      <p className="text-gray-700 mb-4">
                        After payment, click below to fill out your registration details
                      </p>
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        onClick={() => setShowRegistrationForm(true)}
                      >
                        Complete Registration Form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adults *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kids *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={formData.kids}
                          onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zelle Confirmation Number *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={formData.zelleConfirmation}
                        onChange={(e) => setFormData({ ...formData, zelleConfirmation: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowRegistrationForm(false)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
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

      {/* Volunteer Section */}
      <section id="volunteer" className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-xl">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Volunteer With Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Help make our Diwali celebration memorable! We need volunteers for prasadam preparation, decoration,
                    setup, and cleanup activities.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-6 text-base font-semibold shadow-lg"
                    onClick={() => setShowVolunteerModal(true)}
                  >
                    Sign Up to Volunteer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Festival Highlights */}
      <section id="events" className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Festival Highlights</h2>
            <p className="text-gray-600 leading-relaxed">
              Three days of divine celebration featuring traditional rituals, vibrant cultural performances, spectacular
              fireworks, and delicious community meals that bring families together in the spirit of devotion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lakshmi Puja & Aarti</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Traditional Lakshmi puja with diyas, morning and evening aarti, and community prayers for prosperity
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Extravaganza</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Classical dance, Bollywood performances, devotional music, and children's talent showcase
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Grand Feast & Fireworks</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Traditional prasadam, special sweets, community dinner, and spectacular fireworks display
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 border-2 border-orange-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Traditional Activities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Rangoli Competition</h4>
                    <p className="text-sm text-gray-600">
                      Create beautiful traditional rangoli designs with vibrant colors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Diya Decoration</h4>
                    <p className="text-sm text-gray-600">
                      Decorate traditional clay diyas with colors and embellishments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Kids' Activities</h4>
                    <p className="text-sm text-gray-600">Face painting, traditional games, and storytelling sessions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Photo Booth</h4>
                    <p className="text-sm text-gray-600">Capture memories with traditional Diwali-themed decorations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Your Blessings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Share Your Blessings</h2>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Your participation and feedback help us create meaningful celebrations that strengthen our community
                    bonds and preserve our beautiful traditions for future generations.
                  </p>

                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Whether you'd like to share a special moment, suggest improvements for next year, or volunteer for
                    upcoming events, we welcome your thoughts and involvement in making our celebrations even more
                    special.
                  </p>

                  <p className="text-orange-600 font-semibold mb-8 italic">
                    Shubh Deepavali! Together we celebrate, together we grow.
                  </p>

                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-6 text-base font-semibold shadow-lg">
                    Share Your Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our Diwali celebration</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Card className="border-orange-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">What is included in the $75 registration fee?</h3>
                <p className="text-gray-600 text-sm">
                  The registration fee covers all three days of celebration including traditional puja, cultural
                  programs, prasadam, and community activities for your entire family.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">What should we bring?</h3>
                <p className="text-gray-600 text-sm">
                  Please bring your enthusiasm and devotion! Traditional attire is encouraged but not required. We'll
                  provide all necessary items for the puja and celebrations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">Can we volunteer?</h3>
                <p className="text-gray-600 text-sm">
                  We welcome volunteers for various activities including prasadam preparation, decoration, setup, and
                  cleanup. Please use the volunteer section to sign up.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardContent className="pt-6 pb-6">
                <h3 className="font-bold text-gray-900 mb-2">Is parking available?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, ample parking is available at the community center. Please carpool when possible to ensure
                  everyone has convenient access.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">© 2025 Pecan Meadow Community. All rights reserved.</p>
          <p className="text-xs opacity-75 mt-2">Celebrating traditions, building community</p>
        </div>
      </footer>

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Enter Passcode</h3>
                <button onClick={() => setShowPasscodeModal(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Enter passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasscodeSubmit()}
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handlePasscodeSubmit}>
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Registered Participants</h3>
                <button onClick={() => setShowParticipants(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              {loadingParticipants ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : participants.length === 0 ? (
                <p className="text-center text-gray-600">No participants yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Adults</th>
                        <th className="text-left py-2 px-4">Kids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p: any, i: number) => (
                        <tr key={i} className="border-b">
                          <td className="py-2 px-4">{p.fullName}</td>
                          <td className="py-2 px-4">{p.email}</td>
                          <td className="py-2 px-4">{p.adults}</td>
                          <td className="py-2 px-4">{p.kids}</td>
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

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Event Gallery</h3>
                <button onClick={() => setShowGallery(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <p className="text-center text-gray-600">Gallery coming soon! Photos will be added during the event.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Volunteer Registration</h3>
                <button onClick={() => setShowVolunteerModal(false)}>
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Activity *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={volunteerForm.volunteerType}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, volunteerType: e.target.value })}
                  >
                    <option value="">Select an activity</option>
                    <option value="Prasadam Morning">Prasadam Preparation - Morning</option>
                    <option value="Prasadam Evening">Prasadam Preparation - Evening</option>
                    <option value="Decoration">Decoration & Setup</option>
                    <option value="Cleanup">Cleanup & Organizing</option>
                    <option value="Cultural Program">Cultural Program Coordination</option>
                    <option value="Registration Desk">Registration Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={volunteerForm.cleanupDate}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, cleanupDate: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
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
