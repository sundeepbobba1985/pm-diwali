"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Sparkles, Heart, Menu, X, User, DollarSign, ImageIcon, CheckCircle2, Flame } from "lucide-react"
import { useState, useEffect } from "react"

export default function Page() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [showFinancialsModal, setShowFinancialsModal] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [participants, setParticipants] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const eventDate = new Date("2025-10-20T18:00:00")
    const timer = setInterval(() => {
      const now = new Date()
      const diff = eventDate.getTime() - now.getTime()
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleGoogleSignIn = async () => {
    if (isSignedIn) {
      setIsSignedIn(false)
      setUserEmail("")
      return
    }

    try {
      const response = await fetch("/api/auth/google")
      const data = await response.json()
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      adults: formData.get("adults"),
      kids: formData.get("kids"),
      amount: formData.get("amount"),
      zelleEmail: formData.get("zelleEmail"),
    }

    try {
      const response = await fetch("/api/submit-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        alert("Registration submitted successfully!")
        setShowRegistrationModal(false)
      }
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      activity: formData.get("activity"),
      date: formData.get("date"),
    }

    try {
      const response = await fetch("/api/submit-volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        alert("Volunteer registration submitted!")
        setShowVolunteerModal(false)
      }
    } catch (error) {
      console.error("Volunteer error:", error)
    }
  }

  const handleViewParticipants = async () => {
    if (passcode === "diwali2025") {
      try {
        const response = await fetch("/api/get-participants")
        const data = await response.json()
        setParticipants(data.participants || [])
      } catch (error) {
        console.error("Error fetching participants:", error)
      }
    } else {
      alert("Incorrect passcode")
    }
  }

  const handleViewFinancials = async () => {
    if (passcode === "admin2025") {
      try {
        const response = await fetch("/api/get-expenses")
        const data = await response.json()
        setExpenses(data.expenses || [])
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    } else {
      alert("Incorrect admin passcode")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-orange-50">
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-fuchsia-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Diwali 2025</h1>
                <p className="text-xs text-purple-100">Pecan Meadow Community</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm hover:text-purple-200 transition-colors">
                Home
              </a>
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="text-sm hover:text-purple-200 transition-colors"
              >
                Register
              </button>
              <button
                onClick={() => setShowVolunteerModal(true)}
                className="text-sm hover:text-purple-200 transition-colors"
              >
                Volunteers
              </button>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="text-sm hover:text-purple-200 transition-colors"
              >
                Gallery
              </button>
              <button
                onClick={() => setShowParticipantsModal(true)}
                className="text-sm hover:text-purple-200 transition-colors"
              >
                Participants
              </button>
              <a href="#faq" className="text-sm hover:text-purple-200 transition-colors">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleGoogleSignIn}
                className="hidden md:flex bg-white text-purple-600 hover:bg-purple-50"
                size="sm"
              >
                {isSignedIn ? (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-purple-500 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3 border-t border-purple-500 mt-4">
              <a href="#home" className="text-sm hover:text-purple-200 py-2">
                Home
              </a>
              <button
                onClick={() => {
                  setShowRegistrationModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="text-sm hover:text-purple-200 py-2 text-left"
              >
                Register
              </button>
              <button
                onClick={() => {
                  setShowVolunteerModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="text-sm hover:text-purple-200 py-2 text-left"
              >
                Volunteers
              </button>
              <button
                onClick={() => {
                  setShowGalleryModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="text-sm hover:text-purple-200 py-2 text-left"
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  setShowParticipantsModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="text-sm hover:text-purple-200 py-2 text-left"
              >
                Participants
              </button>
              <a href="#faq" className="text-sm hover:text-purple-200 py-2">
                FAQ
              </a>
              <Button onClick={handleGoogleSignIn} className="mt-2 bg-white text-purple-600 hover:bg-purple-50">
                {isSignedIn ? "Account" : "Sign In"}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
          <img
            src="/colorful-diwali-celebration-with-diyas--rangoli--f.jpg"
            alt="Diwali Celebration"
            className="w-full h-full object-cover mix-blend-overlay opacity-80"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center text-white">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
              <p className="text-sm font-semibold uppercase tracking-wider">
                "This Diwali, Let There Be A Fair Of Happiness" - Every Road Decorated With Lamps!
              </p>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold drop-shadow-2xl">
              5th Annual
              <br />
              <span className="text-yellow-300">DIWALI CELEBRATION</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Light Of Lamps, Light Of Hearts - Happy Diwali!
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-purple-600 to-fuchsia-600">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => setShowRegistrationModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Register Now
            </Button>
            <Button
              onClick={() => setShowVolunteerModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              <Heart className="w-5 h-5 mr-2" />
              Become A Volunteer
            </Button>
            <Button
              onClick={() => setShowGalleryModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
            <Button
              onClick={() => setShowFinancialsModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Become Sponsors
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-wider text-blue-200">Next Event</p>
            <h2 className="text-3xl font-bold">October 20, 2025 | Sunday</h2>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-3xl font-bold">
                  {countdown.days}
                </div>
                <p className="text-xs mt-2 text-blue-200">Days</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-3xl font-bold">
                  {countdown.hours}
                </div>
                <p className="text-xs mt-2 text-blue-200">Hours</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-3xl font-bold">
                  {countdown.minutes}
                </div>
                <p className="text-xs mt-2 text-blue-200">Min</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center text-3xl font-bold">
                  {countdown.seconds}
                </div>
                <p className="text-xs mt-2 text-blue-200">Sec</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/traditional-diwali-diya-lamp-with-rangoli-patterns.jpg" alt="Diwali Celebration" className="rounded-2xl shadow-2xl" />
            </div>
            <div className="space-y-6">
              <div className="inline-block">
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
                  WELCOME TO
                </div>
              </div>
              <h2 className="text-5xl font-bold text-gray-900">5th Annual Diwali Celebration!</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Diwali, or Deepavali, is India's biggest and most important holiday of the year. The festival gets its
                name from the row of clay lamps (deepa) that Indians light outside their homes to symbolize the inner
                light that protects from spiritual darkness.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">We Are Celebrating Diwali At Little Elm Beach Park</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    Come With Your Family & Friends For Fun, Food And Fireworks, Free Entry & Free Parking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">
                    There will be Dandiya, Performed By Kids On The Stage, Dance Performances, Cultural Fashion Show,
                    Live Food Booths, Fireworks, Activities For Kids & Adults Including Bounce House, Face Painting,
                    Balloon Twisting, Henna, Rangoli Competition And Much More
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Button
                  onClick={() => setShowRegistrationModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full shadow-lg"
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-purple-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Festival Highlights</h2>
            <p className="text-lg text-gray-600">Experience the magic of Diwali with us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center space-y-4 hover:shadow-xl transition-shadow border-2 border-orange-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Traditional Ceremonies</h3>
              <p className="text-gray-600">
                Participate in traditional diya lighting, rangoli making, and puja ceremonies
              </p>
            </Card>
            <Card className="p-8 text-center space-y-4 hover:shadow-xl transition-shadow border-2 border-purple-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Cultural Performances</h3>
              <p className="text-gray-600">
                Enjoy dance performances, music, fashion shows, and traditional entertainment
              </p>
            </Card>
            <Card className="p-8 text-center space-y-4 hover:shadow-xl transition-shadow border-2 border-pink-200">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Spectacular Fireworks</h3>
              <p className="text-gray-600">
                End the evening with a breathtaking fireworks display lighting up the night sky
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">When is the event?</h3>
              <p className="text-gray-600">October 20-22, 2025, from 6:00 PM to 10:00 PM each evening.</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Where is it located?</h3>
              <p className="text-gray-600">
                {isSignedIn ? "Little Elm Beach Park, Allen, TX 75013" : "Sign in to view the exact location."}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is there an entry fee?</h3>
              <p className="text-gray-600">
                Entry is free! We welcome donations to support the event and community activities.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I volunteer?</h3>
              <p className="text-gray-600">
                Yes! We welcome volunteers for setup, food service, decoration, and cleanup. Click the "Become A
                Volunteer" button to sign up.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Diwali 2025</h3>
          </div>
          <p className="text-purple-100">Pecan Meadow Community</p>
          <p className="text-sm text-purple-200">© 2025 All rights reserved.</p>
        </div>
      </footer>

      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Register for Diwali 2025</DialogTitle>
            <DialogDescription>Fill out the form below to register your family</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">Number of Adults *</Label>
                <Input id="adults" name="adults" type="number" min="0" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kids">Number of Kids *</Label>
                <Input id="kids" name="kids" type="number" min="0" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (Optional)</Label>
              <Input id="amount" name="amount" type="number" min="0" placeholder="$0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zelleEmail">Zelle Email for Payment</Label>
              <Input id="zelleEmail" name="zelleEmail" type="email" placeholder="payments@example.com" />
              <p className="text-sm text-gray-500">Send payment to this Zelle email after registration</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Submit Registration
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showVolunteerModal} onOpenChange={setShowVolunteerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Volunteer Registration</DialogTitle>
            <DialogDescription>Help us make this event special</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVolunteerSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="v-name">Full Name *</Label>
              <Input id="v-name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-email">Email *</Label>
              <Input id="v-email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-phone">Phone Number *</Label>
              <Input id="v-phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Volunteer Activity *</Label>
              <select
                id="activity"
                name="activity"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select an activity</option>
                <option value="Setup">Setup & Decoration</option>
                <option value="Food Service">Food Service</option>
                <option value="Registration">Registration Desk</option>
                <option value="Kids Activities">Kids Activities</option>
                <option value="Cleanup">Cleanup</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
            >
              Submit Volunteer Registration
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showGalleryModal} onOpenChange={setShowGalleryModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Event Gallery</DialogTitle>
            <DialogDescription>Photos from previous celebrations</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`/diwali-celebration-photo-.jpg?height=300&width=300&query=diwali celebration photo ${i}`}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showParticipantsModal} onOpenChange={setShowParticipantsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Registered Participants</DialogTitle>
            <DialogDescription>Enter passcode to view participants list</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <Button onClick={handleViewParticipants}>View</Button>
            </div>
            {participants.length > 0 && (
              <div className="space-y-2">
                {participants.map((p, i) => (
                  <Card key={i} className="p-4">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-600">{p.email}</p>
                    <p className="text-sm text-gray-600">
                      Adults: {p.adults}, Kids: {p.kids}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinancialsModal} onOpenChange={setShowFinancialsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Event Financials</DialogTitle>
            <DialogDescription>Admin access required</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
              <Button onClick={handleViewFinancials}>View</Button>
            </div>
            {expenses.length > 0 && (
              <div className="space-y-2">
                {expenses.map((e, i) => (
                  <Card key={i} className="p-4">
                    <p className="font-semibold">{e.category}</p>
                    <p className="text-sm text-gray-600">{e.description}</p>
                    <p className="text-lg font-bold text-green-600">${e.amount}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
