"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Music, Heart, Users, X, Sparkles, Gift, Menu } from "lucide-react"

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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-serif text-lg font-semibold">Diwali 2025</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Register
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Participants
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => setIsSignedIn(!isSignedIn)}>
                {isSignedIn ? "Sign Out" : "Sign In"}
              </Button>
              <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("registration")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Register
              </button>
              <button
                onClick={() => scrollToSection("volunteer")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Volunteer
              </button>
              <button
                onClick={() => scrollToSection("events")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Participants
              </button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => setIsSignedIn(!isSignedIn)}>
                {isSignedIn ? "Sign Out" : "Sign In"}
              </Button>
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="relative py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-accent-foreground" />
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground mb-4 tracking-wider uppercase">
              Pecan Meadow Community
            </p>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-balance leading-tight">
              5th Annual
              <br />
              <span className="text-accent">Diwali Celebration</span>
              <br />
              2025
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">October 20-22, 2025</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Community Center</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">6:00 PM - 10:00 PM</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join us for a magnificent celebration of the Festival of Lights with traditional rituals, vibrant cultural
              performances, delicious prasadam, and community bonding.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => scrollToSection("registration")}
              >
                Register Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("events")}>
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Event Dashboard</h2>
            <p className="text-muted-foreground">Live registration statistics</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-5xl font-bold mb-2">{dashboardStats.totalFamilies}</div>
                <div className="text-sm text-muted-foreground font-medium">Registered Families</div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-5xl font-bold mb-2">{dashboardStats.totalAdults}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Adults</div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-5xl font-bold mb-2">{dashboardStats.totalKids}</div>
                <div className="text-sm text-muted-foreground font-medium">Total Kids</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="registration" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border shadow-lg">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">Registration</h2>
                  <p className="text-lg text-accent font-semibold">$75 per family</p>
                </div>

                {!isSignedIn ? (
                  <div className="bg-muted rounded-xl p-8 border border-border">
                    <h3 className="text-xl font-bold mb-3 text-center">Sign In Required</h3>
                    <p className="text-muted-foreground text-center mb-6 text-sm">
                      Please sign in with Google to access registration
                    </p>
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => setIsSignedIn(true)}>
                      Continue with Google
                    </Button>
                  </div>
                ) : !showRegistrationForm ? (
                  <div className="space-y-6">
                    <div className="bg-muted rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-bold mb-4">Step 1: Payment via Zelle</h3>
                      <p className="text-muted-foreground mb-4">Send $75 to:</p>
                      <div className="bg-background rounded-lg p-4 border border-border mb-4">
                        <p className="font-mono text-lg text-center font-bold">diwali@pecanmeadow.com</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Include your family name in the note and save the confirmation number
                      </p>
                    </div>

                    <div className="bg-muted rounded-xl p-6 border border-border">
                      <h3 className="text-lg font-bold mb-4">Step 2: Complete Registration</h3>
                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => setShowRegistrationForm(true)}
                      >
                        Complete Registration Form
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Address *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mobile *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Adults *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                          value={formData.adults}
                          onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Kids *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                          value={formData.kids}
                          onChange={(e) => setFormData({ ...formData, kids: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Zelle Confirmation Number *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
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
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
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

      <section id="volunteer" className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border shadow-lg">
              <CardContent className="pt-12 pb-12 px-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Volunteer With Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Help make our Diwali celebration memorable! We need volunteers for prasadam preparation, decoration,
                    setup, and cleanup activities.
                  </p>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
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

      <section id="events" className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Festival Highlights</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Three days of divine celebration featuring traditional rituals, vibrant cultural performances, and
              delicious community meals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lakshmi Puja & Aarti</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Traditional Lakshmi puja with diyas, morning and evening aarti, and community prayers
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">Cultural Extravaganza</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Classical dance, Bollywood performances, devotional music, and children's talent showcase
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">Grand Feast & Fireworks</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Traditional prasadam, special sweets, community dinner, and spectacular fireworks display
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Share Your Blessings */}
      <section className="py-16">
        <div className="container mx-auto px-6">
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
        <div className="container mx-auto px-6">
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

      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-serif text-lg font-semibold">Diwali 2025</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Pecan Meadow Community. All rights reserved.</p>
          <p className="text-xs text-muted-foreground mt-2">Celebrating traditions, building community</p>
        </div>
      </footer>

      {/* Modals remain the same */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Enter Passcode</h3>
                <button onClick={() => setShowPasscodeModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background mb-4"
                placeholder="Enter passcode"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasscodeSubmit()}
              />
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
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
                <h3 className="text-2xl font-bold">Registered Participants</h3>
                <button onClick={() => setShowParticipants(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              {loadingParticipants ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : participants.length === 0 ? (
                <p className="text-center text-muted-foreground">No participants yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Adults</th>
                        <th className="text-left py-3 px-4 font-medium">Kids</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p: any, i: number) => (
                        <tr key={i} className="border-b border-border">
                          <td className="py-3 px-4">{p.fullName}</td>
                          <td className="py-3 px-4">{p.email}</td>
                          <td className="py-3 px-4">{p.adults}</td>
                          <td className="py-3 px-4">{p.kids}</td>
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
                <h3 className="text-2xl font-bold">Event Gallery</h3>
                <button onClick={() => setShowGallery(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <p className="text-center text-muted-foreground">
                Gallery coming soon! Photos will be added during the event.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Volunteer Registration</h3>
                <button onClick={() => setShowVolunteerModal(false)}>
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Volunteer Activity *</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
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
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-accent focus:border-transparent"
                    value={volunteerForm.cleanupDate}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, cleanupDate: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
