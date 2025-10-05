"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  MapPin,
  HomeIcon,
  Lock,
  HelpCircle,
  User,
  DollarSign,
  Trophy,
  Search,
  Music,
  Heart,
  Users,
  X,
  Settings,
  Plus,
  ExternalLink,
} from "lucide-react"

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

  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
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
    "admin1@gmail.com", // Replace with actual admin emails
    "admin2@gmail.com",
    "admin3@gmail.com",
    "SUNDEEPBOBBA@GMAIL.COM", // Added user's email for admin access
    "sundeepbobba@gmail.com", // Added lowercase version as well
  ])
  const [eventBudget, setEventBudget] = useState(2250) // Default budget
  const [showBudgetConfig, setShowBudgetConfig] = useState(false)
  const [newBudget, setNewBudget] = useState("")
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [participantsError, setParticipantsError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showGallery, setShowGallery] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageCaption, setNewImageCaption] = useState("")
  const [galleryImages, setGalleryImages] = useState<any[]>([])
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

  const loadDashboardStats = async () => {
    try {
      console.log("[v0] Loading dashboard stats from Google Sheets...")

      try {
        const response = await fetch("/api/get-registrations")
        const result = await response.json()

        console.log("[v0] Google Sheets response:", result)
        console.log("[v0] Success check:", result.success)
        console.log("[v0] Participants check:", result.participants)
        console.log("[v0] Registrations check:", result.registrations)
        console.log("[v0] Participants length:", result.participants?.length)
        console.log("[v0] Registrations length:", result.registrations?.length)

        const registrations = result.participants || result.registrations
        if (result.success && registrations && registrations.length > 0) {
          console.log("[v0] Processing registrations:", registrations)

          const totalFamilies = registrations.length
          const totalAdults = registrations.reduce((sum: number, r: any) => {
            console.log("[v0] Processing adult count for:", r.familyName, "adults:", r.adults)
            return sum + Number(r.adults || 0)
          }, 0)
          const totalKids = registrations.reduce((sum: number, r: any) => {
            console.log("[v0] Processing kid count for:", r.familyName, "kids:", r.kids)
            return sum + Number(r.kids || 0)
          }, 0)

          const stats = { totalFamilies, totalAdults, totalKids }
          console.log("[v0] Calculated stats from Google Sheets:", stats)
          setDashboardStats(stats)

          localStorage.setItem("pv-ganesha-registrations", JSON.stringify(registrations))

          console.log("[v0] Dashboard stats loaded from Google Sheets:", stats)
          return
        } else {
          console.log("[v0] Google Sheets data validation failed - falling back to localStorage")
        }
      } catch (sheetsError) {
        console.warn("[v0] Failed to load from Google Sheets, falling back to localStorage:", sheetsError)
      }

      console.log("[v0] Loading dashboard stats from local storage...")
      const localData = localStorage.getItem("pv-ganesha-registrations")

      if (localData) {
        const registrations = JSON.parse(localData)
        const totalFamilies = registrations.length
        const totalAdults = registrations.reduce((sum: number, r: any) => sum + Number(r.adults || 0), 0)
        const totalKids = registrations.reduce((sum: number, r: any) => sum + Number(r.kids || 0), 0)

        const stats = { totalFamilies, totalAdults, totalKids }
        setDashboardStats(stats)
        console.log("[v0] Dashboard stats loaded from local storage:", stats)
        return
      }

      console.log("[v0] No data found anywhere, setting initial statistics...")
      const initialRegistrations = [
        { id: 1, familyName: "Initial Family 1", adults: 3, kids: 2, timestamp: new Date().toISOString() },
        { id: 2, familyName: "Initial Family 2", adults: 2, kids: 2, timestamp: new Date().toISOString() },
        { id: 3, familyName: "Initial Family 3", adults: 3, kids: 2, timestamp: new Date().toISOString() },
        { id: 4, familyName: "Initial Family 4", adults: 2, kids: 2, timestamp: new Date().toISOString() },
      ]

      localStorage.setItem("pv-ganesha-registrations", JSON.stringify(initialRegistrations))
      const stats = { totalFamilies: 4, totalAdults: 10, totalKids: 8 }
      setDashboardStats(stats)
      console.log("[v0] Initial dashboard stats set:", stats)
    } catch (error) {
      console.error("[v0] Error loading dashboard stats:", error)
      setDashboardStats({ totalFamilies: 4, totalAdults: 10, totalKids: 8 })
    }
  }

  useEffect(() => {
    loadDashboardStats() // Load dashboard stats instead of resetting
    loadFinancials()

    const initVisitorCounter = () => {
      const currentCount = localStorage.getItem("pv-ganesha-visitor-count")
      if (currentCount) {
        const count = Number.parseInt(currentCount, 10)
        setVisitorCount(count)
      } else {
        // First time visitor
        const newCount = 1
        localStorage.setItem("pv-ganesha-visitor-count", newCount.toString())
        setVisitorCount(newCount)
      }

      // Increment count for returning visitors (but only once per session)
      const sessionVisited = sessionStorage.getItem("pv-ganesha-session-visited")
      if (!sessionVisited) {
        const updatedCount = Number.parseInt(localStorage.getItem("pv-ganesha-visitor-count") || "0", 10) + 1
        localStorage.setItem("pv-ganesha-visitor-count", updatedCount.toString())
        sessionStorage.setItem("pv-ganesha-session-visited", "true")
        setVisitorCount(updatedCount)
      }
    }

    initVisitorCounter()
  }, [])

  const saveRegistrationToLocalStorage = (registrationData: any) => {
    try {
      const existingData = localStorage.getItem("pv-ganesha-registrations")
      const registrations = existingData ? JSON.parse(existingData) : []

      const newRegistration = {
        id: Date.now(),
        familyName: registrationData.fullName,
        adults: Number(registrationData.adults) || 0,
        kids: Number(registrationData.kids) || 0,
        timestamp: new Date().toISOString(),
        ...registrationData,
      }

      registrations.push(newRegistration)
      localStorage.setItem("pv-ganesha-registrations", JSON.stringify(registrations))
      console.log("[v0] Registration saved to local storage:", newRegistration)
    } catch (error) {
      console.error("[v0] Error saving to local storage:", error)
    }
  }

  const verifyPasscode = () => {
    const correctPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "Greenbelt@2025"
    if (passcodeInput === correctPasscode) {
      setIsAuthenticated(true)
      setShowPasscodeModal(false)
      setPasscodeInput("")

      // Execute the pending action
      if (pendingAction === "participants") {
        setShowParticipants(true)
      } else if (pendingAction === "gallery") {
        setShowGallery(true)
      }
      setPendingAction(null)
    } else {
      alert("Incorrect passcode. Please try again.")
      setPasscodeInput("")
    }
  }

  const handleParticipantsSection = () => {
    if (!isSignedIn) {
      alert("Please sign in with Google to view participants.")
      return
    }

    if (!isAuthenticated) {
      setPendingAction("participants")
      setShowPasscodeModal(true)
      return
    }

    setShowParticipants(true)
  }

  const handleGallerySection = () => {
    if (!isAuthenticated) {
      setPendingAction("gallery")
      setShowPasscodeModal(true)
      return
    }

    setShowGallery(true)
  }

  const isAdmin = () => {
    return userInfo?.email && adminEmails.includes(userInfo.email)
  }

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newImageUrl.trim() && newImageCaption.trim()) {
      const newImage = {
        url: newImageUrl.trim(),
        caption: newImageCaption.trim(),
      }
      setGalleryImages([...galleryImages, newImage])
      setNewImageUrl("")
      setNewImageCaption("")
      setShowAddImages(false)
      alert("Image added successfully!")
    }
  }

  const handleRemoveImage = (index: number) => {
    if (confirm("Are you sure you want to remove this image?")) {
      const updatedImages = galleryImages.filter((_, i) => i !== index)
      setGalleryImages(updatedImages)
      if (currentImageIndex >= updatedImages.length) {
        setCurrentImageIndex(Math.max(0, updatedImages.length - 1))
      }
    }
  }

  const handleGoogleSignIn = () => {
    if (!isSignedIn) {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com"
      const redirectUri = `${window.location.origin}/api/auth/google`
      const scope = "openid email profile"

      console.log("=== OAUTH DEBUG INFO ===")
      console.log("Environment GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
      console.log("Using Client ID:", clientId)
      console.log("Redirect URI:", redirectUri)
      console.log("Current Origin:", window.location.origin)

      // Check if using fallback client ID
      if (clientId === "1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com") {
        console.error(
          "⚠️ WARNING: Using fallback client ID! Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in Vercel environment variables",
        )
        alert(
          "OAuth not configured! Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable in Vercel Project Settings.",
        )
        return
      }

      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`

      console.log("Full OAuth URL:", googleAuthUrl)
      console.log("========================")

      // Store current page state
      localStorage.setItem("preAuthUrl", window.location.href)

      // Redirect to Google OAuth
      window.location.href = googleAuthUrl
    } else {
      // Sign out
      setIsSignedIn(false)
      setUserInfo(null)
      localStorage.removeItem("googleAccessToken")
      localStorage.removeItem("userInfo")
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const name = urlParams.get("name")
    const email = urlParams.get("email")
    const authenticated = urlParams.get("authenticated")
    const error = urlParams.get("error")

    if (error) {
      console.error("OAuth error:", error)
      alert("Authentication failed. Please try again.")
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (authenticated === "true" && name && email) {
      // Set user info from URL parameters
      setUserInfo({ name, email })
      setIsSignedIn(true)

      // Store in localStorage for persistence
      localStorage.setItem("userInfo", JSON.stringify({ name, email }))

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      // Restore previous authentication state
      const savedUserInfo = localStorage.getItem("userInfo")

      if (savedUserInfo) {
        setUserInfo(JSON.parse(savedUserInfo))
        setIsSignedIn(true)
      }
    }
  }, [])

  const handleOAuthCallback = async (code: string) => {
    try {
      // In a real implementation, you'd exchange the code for an access token on your backend
      // For now, we'll use Google's userinfo endpoint directly
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUserInfo({ name: userData.name, email: userData.email })
        setIsSignedIn(true)

        // Store in localStorage for persistence
        localStorage.setItem("userInfo", JSON.stringify({ name: userData.name, email: userData.email }))
        localStorage.setItem("googleAccessToken", userData.access_token)

        // Clean up URL and redirect back
        window.history.replaceState({}, document.title, window.location.pathname)

        const preAuthUrl = localStorage.getItem("preAuthUrl")
        if (preAuthUrl && preAuthUrl !== window.location.href) {
          localStorage.removeItem("preAuthUrl")
        }
      }
    } catch (error) {
      console.error("OAuth callback error:", error)
      alert("Authentication failed. Please try again.")
    }
  }

  useEffect(() => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setSparkles(newSparkles)

    // Remove sparkles after animation completes
    const timer = setTimeout(() => {
      setSparkles([])
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleSectionClick = async (sectionName: string) => {
    if (sectionName === "Registration") {
      if (!isSignedIn) {
        alert("Please sign in with Google to register.")
        return
      }
      setShowRegistrationForm(true)
      return
    }
    if (sectionName === "Participants") {
      if (!isSignedIn) {
        alert("Please sign in with Google to view participants.")
        return
      }
      setShowParticipants(true)
      loadParticipants() // Use the Google Sheets API function
      return
    }
    if (sectionName === "Financials") {
      setShowFinancials(true)
      setLoadingExpenses(true)

      try {
        console.log("Fetching expenses from API...")
        const response = await fetch("/api/get-expenses")
        const data = await response.json()
        console.log("Expenses API response:", data)

        if (data.success) {
          setExpenses(data.expenses)
        } else {
          alert(`Failed to load expenses data: ${data.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error("Error fetching expenses:", error)
        alert("Error loading expenses data")
      } finally {
        setLoadingExpenses(false)
      }
      return
    }
    console.log(`Accessing ${sectionName} section`)
  }

  const handleProtectedSection = async (sectionName: string) => {
    if (!isSignedIn) {
      alert(`Please sign in with Google to access the ${sectionName} section.`)
      return
    }
    if (sectionName === "Registration") {
      setShowRegistrationForm(true)
      return
    }
    if (sectionName === "Participants") {
      setShowParticipants(true)
      await loadParticipants()
      return
    }
    if (sectionName === "Financials") {
      setShowFinancials(true)
      setLoadingExpenses(true)

      try {
        console.log("Fetching expenses from API...")
        const response = await fetch("/api/get-expenses")
        const data = await response.json()
        console.log("Expenses API response:", data)

        if (data.success) {
          setExpenses(data.expenses)
        } else {
          alert(`Failed to load expenses data: ${data.error || "Unknown error"}`)
        }
      } catch (error) {
        console.error("Error fetching expenses:", error)
        alert("Error loading expenses data")
      } finally {
        setLoadingExpenses(false)
      }
      return
    }
    console.log(`Accessing ${sectionName} section`)
  }

  const handleMenuClick = (sectionName: string) => {
    setActiveSection(sectionName)

    if (sectionName === "Registration") {
      setShowRegistrationForm(true)
      return
    }

    if (sectionName === "Participants") {
      setShowParticipants(true)
      loadParticipants()
      return
    }
  }

  const handleMobileMenuClick = (sectionName: string) => {
    setIsMobileMenuOpen(false)
    if (
      !isSignedIn &&
      (sectionName === "Registration" || sectionName === "Participants" || sectionName === "Financials")
    ) {
      alert("Please sign in with Google to access this section.")
      return
    }

    if (sectionName === "Registration") {
      setShowRegistrationForm(true)
      return
    }

    if (sectionName === "Participants") {
      setShowParticipants(true)
      return
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        mobile: formData.mobile,
        adults: formData.adults,
        kids: formData.kids,
        zelleConfirmation: formData.zelleConfirmation,
        submittedBy: userInfo?.email || "unknown",
        timestamp: new Date().toISOString(),
      }

      // Save to JSON file (primary storage)
      const jsonResponse = await fetch("/api/participants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      })

      const jsonResult = await jsonResponse.json()

      if (jsonResult.success) {
        // Also submit to Google Sheets as backup
        try {
          await fetch("/api/submit-registration", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
          })
          console.log("[v0] Registration also saved to Google Sheets as backup")
        } catch (backupError) {
          console.warn("[v0] Google Sheets backup failed, but JSON storage succeeded:", backupError)
        }

        saveRegistrationToLocalStorage(formData)

        // Refresh dashboard stats
        await loadDashboardStats()

        const handleRegistrationSuccess = () => {
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

          alert("Registration successful! Thank you for registering.")
        }
        handleRegistrationSuccess()

        loadDashboardStats()
      } else {
        alert("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Submitting expense:", expenseFormData)

    try {
      const response = await fetch("/api/submit-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...expenseFormData,
          submittedBy: userInfo?.name || "Unknown",
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      console.log("Expense submission response:", result)

      if (result.success) {
        alert("Expense recorded successfully!")
        setExpenseFormData({
          category: "",
          description: "",
          amount: "",
          date: "",
          paidBy: "",
          receipt: "",
        })
        setShowExpenseForm(false)
        // Refresh expenses list
        handleProtectedSection("Financials")
      } else {
        alert(`Failed to record expense: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error submitting expense:", error)
      alert("Error recording expense. Please try again.")
    }
  }

  const handleBudgetUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    const budget = Number.parseFloat(newBudget)
    if (budget > 0) {
      setEventBudget(budget)
      setShowBudgetConfig(false)
      setNewBudget("")
      alert("Budget updated successfully!")
    }
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
    setUserInfo(null)
    localStorage.removeItem("googleAccessToken")
    localStorage.removeItem("userInfo")
  }

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Volunteer form submitted:", volunteerForm)
    console.log("[v0] Current timestamp:", new Date().toISOString())
    console.log("[v0] User info:", userInfo)

    try {
      console.log("[v0] Sending volunteer data to API...")
      console.log("[v0] API URL:", "/api/submit-volunteer")
      console.log("[v0] Request method: POST")

      const requestData = {
        ...volunteerForm,
        timestamp: new Date().toISOString(),
        userEmail: userInfo?.email || "anonymous",
      }
      console.log("[v0] Request data:", requestData)

      const response = await fetch("/api/submit-volunteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("[v0] Volunteer API response status:", response.status)
      console.log("[v0] Volunteer API response headers:", Object.fromEntries(response.headers.entries()))

      const responseData = await response.text()
      console.log("[v0] Volunteer API raw response:", responseData)

      let parsedResponse
      try {
        parsedResponse = JSON.parse(responseData)
        console.log("[v0] Volunteer API parsed response:", parsedResponse)
      } catch (parseError) {
        console.error("[v0] Failed to parse API response:", parseError)
        console.log("[v0] Raw response was:", responseData)
      }

      if (response.ok) {
        console.log("[v0] Volunteer submission successful!")
        alert("Thank you for volunteering! We will contact you with more details.")
        setVolunteerForm({
          name: "",
          email: "",
          volunteerType: "",
          cleanupDate: "",
        })
        setShowVolunteerModal(false)
        if (volunteerForm.volunteerType === "Prasadam Morning" || volunteerForm.volunteerType === "Prasadam Evening") {
          setVolunteerCounts((prev) => ({
            ...prev,
            [volunteerForm.volunteerType]: prev[volunteerForm.volunteerType] + 1,
          }))
        }
      } else {
        console.error("[v0] Volunteer submission failed with status:", response.status)
        console.error("[v0] Error response:", responseData)
        alert("Failed to submit volunteer registration. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Error submitting volunteer form:", error)
      console.error("[v0] Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
      alert("Failed to submit volunteer registration. Please try again.")
    }
  }

  const handleVolunteerSection = () => {
    if (!isSignedIn) {
      alert("Please sign in with Google to access volunteer registration.")
      return
    }
    setShowVolunteerModal(true)
  }

  const loadParticipants = async () => {
    if (loadingParticipants) return

    setLoadingParticipants(true)
    try {
      console.log("[v0] Loading participants from JSON file...")
      const response = await fetch("/api/participants")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Participants API response:", data)

      if (data.success && data.participants) {
        setParticipants(data.participants)
        console.log("[v0] Participants loaded from JSON file:", data.participants)
      } else {
        console.log("[v0] No participants found in JSON file")
        setParticipants([])
      }
    } catch (error) {
      console.error("[v0] Error loading participants from JSON file:", error)
      setParticipants([])
    } finally {
      setLoadingParticipants(false)
    }
  }

  const loadFinancials = async () => {
    setLoadingExpenses(true)

    try {
      console.log("Fetching expenses from API...")
      const response = await fetch("/api/get-expenses")
      const data = await response.json()
      console.log("Expenses API response:", data)

      if (data.success) {
        setExpenses(data.expenses)
      } else {
        alert(`Failed to load expenses data: ${data.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
      alert("Error loading expenses data")
    } finally {
      setLoadingExpenses(false)
    }
  }

  // const handleParticipantsSection = () => {
  //   if (!isSignedIn) {
  //     alert("Please sign in with Google to view participants.")
  //     return
  //   }
  //   loadParticipants()
  //   setActiveSection("Participants")
  // }

  // const loadParticipants = async () => {
  //   setLoadingParticipants(true)
  //   try {
  //     const storedParticipants = JSON.parse(localStorage.getItem("registrations") || "[]")
  //     setParticipants(storedParticipants)
  //   } catch (error) {
  //     console.error("Error loading participants:", error)
  //     setParticipants([])
  //   } finally {
  //     setLoadingParticipants(false)
  //   }
  // }

  // useEffect(() => {
  //   loadParticipants()
  // }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
        style={{
          backgroundImage: "url('/lord-ganesha-meditation.png')",
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
          <div className="w-1 h-1 bg-yellow-300 rounded-full opacity-40 animate-pulse"></div>
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
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
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
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Registration</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <button
                  onClick={handleVolunteerSection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Volunteer</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Events</span>
                </a>
                <button
                  onClick={handleGallerySection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Gallery</span>
                </button>
                <button
                  onClick={handleParticipantsSection}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Participants</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <button
                  onClick={() => handleSectionClick("Financials")}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Financials</span>
                  {!isSignedIn && <Lock className="w-3 h-3 text-gray-400" />}
                </button>
                <a
                  href="#faq"
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
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
                <Search className="w-5 h-5 text-gray-700 cursor-pointer hover:text-orange-600 transition-colors" />
              </nav>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2"
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
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2 text-left"
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
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2 text-left"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Volunteer</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Events</span>
                </a>
                <button
                  onClick={() => {
                    handleGallerySection()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2 text-left"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Gallery</span>
                </button>
                <button
                  onClick={() => {
                    handleParticipantsSection()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2 text-left"
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
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2 text-left"
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Financials</span>
                  {!isSignedIn && <Lock className="w-4 h-4 text-gray-400" />}
                </button>
                <a
                  href="#faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-orange-600 transition-colors py-2"
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
          <div className="text-orange-200/20 text-[40rem] font-bold animate-pulse select-none">ॐ</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-amber-300/20 to-red-400/20"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="text-center mb-12 md:mb-16">
            <div className="text-center relative">
              <div className="relative inline-block">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-jpjntClSQEuRWtoby7g0Tz712Dfjjb.jpeg"
                  alt="Pecan Tree"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-60 mix-blend-soft-light filter brightness-90 contrast-110 saturate-125"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1) 100%)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20 mix-blend-color-burn rounded-full blur-sm"></div>
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <p className="text-orange-700 text-base md:text-lg font-semibold tracking-wide uppercase mb-2">
                Pecan Meadow Community
              </p>
              <p className="text-amber-600 text-lg md:text-xl font-medium italic">Presents</p>
            </div>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
              <h1 className="text-gray-900 text-5xl md:text-7xl lg:text-8xl font-bold font-serif leading-tight">
                <span className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-700 bg-clip-text text-transparent">
                  Ganesh
                </span>
                <br />
                <span className="text-amber-600">Chaturthi</span>
                <br />
                <span className="text-red-600 text-4xl md:text-6xl">2025</span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-orange-200 w-full md:w-auto justify-center">
                <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-800 font-semibold text-sm md:text-base">August 26-30, 2025</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-orange-200 w-full md:w-auto justify-center">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                {isSignedIn ? (
                  <span className="text-gray-800 font-semibold text-sm md:text-base">
                    1991, Keiva Pl, Allen TX 75013
                  </span>
                ) : (
                  <button
                    onClick={() => alert("Please sign in with Google to view location")}
                    className="text-gray-800 font-semibold hover:text-orange-600 transition-colors text-sm md:text-base"
                  >
                    View location
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full shadow-lg border border-orange-200 w-full md:w-auto justify-center">
                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-gray-800 font-semibold text-xs md:text-base text-center">
                  7:00 AM - 8:30 AM | 6:00 PM - 9:00 PM
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-4 md:mb-6 font-medium px-4">
              Join us for a magnificent celebration of Lord Ganesha with traditional rituals, cultural performances,
              delicious prasadam, and community bonding that brings our neighborhood together.
            </p>

            <p className="text-gray-600 text-base md:text-lg max-w-5xl mx-auto leading-relaxed px-4">
              Experience the divine blessings of Ganpati Bappa through three days of devotion, music, dance, and
              fellowship. From morning aarti to evening cultural programs, immerse yourself in the rich traditions that
              unite our diverse community in celebration.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <div className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Dashboard</h2>
            <p className="text-gray-600">Live registration statistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{dashboardStats.totalFamilies}</h3>
              <p className="text-gray-600">Registered Families</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{dashboardStats.totalAdults}</h3>
              <p className="text-gray-600">Total Adults</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{dashboardStats.totalKids}</h3>
              <p className="text-gray-600">Total Kids</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Process Card */}
      <section id="registration" className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12">
              <div className="text-center mb-8 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <Music className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h2 className="text-gray-900 text-3xl md:text-4xl font-bold font-serif mb-4">Registration Process</h2>
                <p className="text-orange-700 text-base md:text-lg font-medium">$75 per family - Two simple steps</p>
              </div>

              {isSignedIn ? (
                <div className="space-y-6 md:space-y-8 text-gray-800">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-lg font-bold rounded-full self-start md:mt-1">
                        1
                      </Badge>
                      <div className="flex-1">
                        <p className="font-bold text-lg md:text-xl mb-3 text-gray-900">PAYMENT: $75 per family</p>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                          Send payment via Zelle to: <span className="font-bold text-orange-700">...2148381800</span>
                        </p>

                        <div className="bg-white rounded-xl p-4 border border-gray-200 inline-block">
                          <div className="text-center mb-3">
                            <p className="font-semibold text-gray-800 mb-2">...2148381800</p>
                          </div>
                          <img
                            src="/zelle-qr-varatharajan.png"
                            alt="Zelle QR Code for Varatharajan Lingam"
                            className="w-48 h-48 mx-auto"
                          />
                          <div className="mt-3 text-center">
                            <img src="/zelle-logo-purple.png" alt="Zelle" className="h-8 mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-lg font-bold rounded-full self-start md:mt-1">
                        2
                      </Badge>
                      <div className="flex-1">
                        <p className="font-bold text-lg md:text-xl mb-3 text-gray-900">REGISTRATION</p>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                          Complete the registration form with your family details and Zelle confirmation number.
                        </p>
                        <Button
                          onClick={() => setShowRegistrationForm(true)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          Start Registration
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
                    <h3 className="text-gray-900 text-xl md:text-2xl font-bold mb-4">Sign In Required</h3>
                    <p className="text-gray-600 mb-6">
                      Please sign in with Google to access registration and payment information
                    </p>
                    <Button
                      className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium px-6 md:px-8 py-3 rounded-full text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto w-full md:w-auto justify-center"
                      onClick={handleGoogleSignIn}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                      <span>Continue with Google</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-gray-900 text-3xl md:text-4xl font-bold font-serif mb-6">Festival Highlights</h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8 px-4">
            Three days of divine celebration featuring traditional rituals, vibrant cultural performances, and delicious
            community meals that bring families together in the spirit of devotion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-orange-200">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 mb-4 relative overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-jpjntClSQEuRWtoby7g0Tz712Dfjjb.jpeg"
                    alt="Pecan Tree"
                    className="w-12 h-12 object-contain opacity-70 mix-blend-darken filter brightness-85 contrast-115"
                    style={{
                      maskImage:
                        "radial-gradient(circle, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 100%)",
                      WebkitMaskImage:
                        "radial-gradient(circle, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.2) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-300/30 to-red-400/30 mix-blend-multiply"></div>
                </div>
              </div>
              <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">Daily Aarti</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Morning and evening prayers with traditional bhajans and community participation
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-orange-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">Cultural Programs</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Dance performances, music concerts, and children's talent showcase
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-orange-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">Community Feast</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Traditional prasadam and special meals prepared with love by volunteers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mx-auto mb-6 md:mb-8 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <h2 className="text-gray-900 text-3xl md:text-4xl font-bold font-serif mb-6">Share Your Blessings</h2>

              <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
                Your participation and feedback help us create meaningful celebrations that strengthen our community
                bonds and preserve our beautiful traditions for future generations.
              </p>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Whether you'd like to share a special moment, suggest improvements for next year, or volunteer for
                upcoming events, we welcome your thoughts and involvement in making our celebrations even more special.
              </p>

              <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                Ganpati Bappa Morya! Together we celebrate, together we grow.
              </p>

              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 md:px-12 py-4 rounded-full text-lg md:text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full md:w-auto">
                Share Your Experience
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-gray-900 text-3xl md:text-4xl font-bold font-serif mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-700 text-lg md:text-xl">
              Everything you need to know about our Ganesha Chaturthi celebration
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">
                  Is there an age limit for participation?
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  No age limit! Our celebration welcomes families with children of all ages. We have special activities
                  and programs designed for kids, and the entire event is family-friendly with a safe, welcoming
                  environment.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Important Guidelines:</h4>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Parents must supervise their children at all times during the event</li>
                    <li>• Please be mindful of host family privacy and respect their home</li>
                    <li>• Children should stay with their families in designated celebration areas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">What are the event timings?</h3>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Daily Schedule:</strong>
                  </p>
                  <p>• Mornings: 7:00 AM to 8:30 AM</p>
                  <p>• Evenings: 6:00 PM to 9:00 PM</p>
                  <p className="mt-4">
                    <strong>Special Events:</strong>
                  </p>
                  <p>• Main Pooja: August 26th at 4:30 PM</p>
                  <p>• Nimajjan Pooja: August 30th at 4:30 PM</p>
                  <p>• Nimajjan Procession: August 30th, 5:00 PM - 7:00 PM</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">Can I volunteer for the event?</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Yes! We welcome volunteers for setup, decoration, cooking, serving, cleanup, and cultural program
                  coordination. Please use the volunteer registration form to sign up and specify your preferred areas
                  of help.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 shadow-lg rounded-2xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-4">What should I bring?</h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Please bring your family, devotional spirit, and any special offerings you'd like to make to Lord
                  Ganesha. We'll provide all necessary items for the celebration. If you'd like to contribute food for
                  the community feast, please coordinate with the organizers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl md:text-3xl font-bold font-serif">Family Registration</h2>
                <Button
                  onClick={() => setShowRegistrationForm(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Participation Guidelines</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• All ages welcome - family-friendly celebration</li>
                    <li>• Parents must supervise children at all times</li>
                    <li>• Please respect host family privacy and home</li>
                    <li>• Stay in designated celebration areas</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Adults *</label>
                    <input
                      type="number"
                      name="adults"
                      value={formData.adults}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Kids</label>
                    <input
                      type="number"
                      name="kids"
                      value={formData.kids}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zelle Confirmation Number (Last 4 digits) *
                  </label>
                  <input
                    type="text"
                    name="zelleConfirmation"
                    value={formData.zelleConfirmation}
                    onChange={handleInputChange}
                    required
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter last 4 digits"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the last 4 digits of your Zelle confirmation number after payment
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-md rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold font-serif">Enter Passcode</h2>
                <Button
                  onClick={() => {
                    setShowPasscodeModal(false)
                    setPasscodeInput("")
                    setPendingAction(null)
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>

                <p className="text-gray-600 mb-6">This section is protected. Please enter the passcode to continue.</p>

                <div className="space-y-4">
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg"
                    onKeyPress={(e) => e.key === "Enter" && verifyPasscode()}
                    autoFocus
                  />

                  <Button
                    onClick={verifyPasscode}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Verify Passcode
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">Contact the administrator if you need access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl md:text-3xl font-bold font-serif">Event Participants</h2>
                <Button onClick={() => setShowParticipants(false)} variant="outline" size="sm" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">View All Registered Participants</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to view the complete list of registered families and their details in Google
                  Sheets.
                </p>

                <Button
                  onClick={() =>
                    window.open(
                      "https://docs.google.com/spreadsheets/d/1igOvWnHleoYM3SO0WLvnZL_j5z3Z1vNFldGXgvcqlXA/edit?usp=sharing",
                      "_blank",
                    )
                  }
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Participants List</span>
                </Button>

                <p className="text-sm text-gray-500 mt-4">Opens in a new tab • View-only access</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl md:text-3xl font-bold font-serif">Volunteer Registration</h2>
                <Button
                  onClick={() => setShowVolunteerModal(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleVolunteerSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={volunteerForm.name}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={volunteerForm.email}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Type *</label>
                  <select
                    value={volunteerForm.volunteerType}
                    onChange={(e) =>
                      setVolunteerForm({ ...volunteerForm, volunteerType: e.target.value, cleanupDate: "" })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select volunteer type</option>
                    <option value="Setup & Decoration">Setup & Decoration</option>
                    <option value="Prasadam Morning" disabled={volunteerCounts["Prasadam Morning"] >= 4}>
                      Prasadam Morning {volunteerCounts["Prasadam Morning"] >= 4 ? "(Full)" : ""}
                    </option>
                    <option value="Prasadam Evening" disabled={volunteerCounts["Prasadam Evening"] >= 4}>
                      Prasadam Evening {volunteerCounts["Prasadam Evening"] >= 4 ? "(Full)" : ""}
                    </option>
                    <option value="Pooja Items Shopping">Pooja Items Shopping</option>
                    <option value="Photography">Photography</option>
                    <option value="Cleanup">Cleanup</option>
                    <option value="Cleanup Full Premises">Cleanup Full Premises</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {volunteerForm.volunteerType === "Setup & Decoration" ? "Available Date *" : "Available Date"}
                  </label>
                  <select
                    value={volunteerForm.cleanupDate}
                    onChange={(e) => setVolunteerForm({ ...volunteerForm, cleanupDate: e.target.value })}
                    required={volunteerForm.volunteerType === "Setup & Decoration"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select available date</option>

                    {volunteerForm.volunteerType === "Setup & Decoration" && (
                      <>
                        <option value="August 23rd">August 23rd</option>
                        <option value="August 24th">August 24th</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Prasadam Morning" && (
                      <>
                        <option value="August 27th">August 27th</option>
                        <option value="August 28th">August 28th</option>
                        <option value="August 29th">August 29th</option>
                        <option value="August 30th">August 30th</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Prasadam Evening" && (
                      <>
                        <option value="August 26th Evening">August 26th Evening</option>
                        <option value="August 27th">August 27th</option>
                        <option value="August 28th">August 28th</option>
                        <option value="August 29th">August 29th</option>
                        <option value="August 30th">August 30th</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Pooja Items Shopping" && (
                      <>
                        <option value="August 25th">August 25th</option>
                        <option value="August 26th">August 26th</option>
                        <option value="August 27th">August 27th</option>
                        <option value="August 28th">August 28th</option>
                        <option value="August 29th">August 29th</option>
                        <option value="August 30th">August 30th</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Photography" && (
                      <>
                        <option value="August 26th Evening">August 26th Evening</option>
                        <option value="August 30th Evening">August 30th Evening</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Cleanup" && (
                      <>
                        <option value="August 26th">August 26th</option>
                        <option value="August 27th">August 27th</option>
                        <option value="August 28th">August 28th</option>
                        <option value="August 29th">August 29th</option>
                        <option value="August 30th">August 30th</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "Cleanup Full Premises" && (
                      <>
                        <option value="August 30th Night">August 30th Night</option>
                      </>
                    )}

                    {volunteerForm.volunteerType === "General Support" && (
                      <>
                        <option value="August 26th">August 26th</option>
                        <option value="August 27th">August 27th</option>
                        <option value="August 28th">August 28th</option>
                        <option value="August 29th">August 29th</option>
                        <option value="August 30th">August 30th</option>
                      </>
                    )}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Register as Volunteer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl md:text-3xl font-bold font-serif">Event Gallery</h2>
                <Button onClick={() => setShowGallery(false)} variant="outline" size="sm" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Upload & View Photos</h3>
                <p className="text-gray-600 mb-6">
                  Share your beautiful moments from the celebration! Upload photos and view pictures from other
                  families.
                </p>

                <Button
                  onClick={() =>
                    window.open("https://drive.google.com/drive/folders/12flkHyZcjaquQ0qLY8KgY7LEIZEP2Krf", "_blank")
                  }
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open Photo Gallery</span>
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                  Opens Google Drive in a new tab • Upload and download photos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financials Modal */}
      {showFinancials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl md:text-3xl font-bold font-serif">Event Financials</h2>
                <Button onClick={() => setShowFinancials(false)} variant="outline" size="sm" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Budget Overview */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Budget Overview</h3>
                  {isAdmin() && (
                    <Button
                      onClick={() => setShowBudgetConfig(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 font-semibold">Total Budget</p>
                    <p className="text-2xl font-bold text-blue-800">${eventBudget}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 font-semibold">Total Expenses</p>
                    <p className="text-2xl font-bold text-green-800">
                      ${expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount || "0"), 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-orange-600 font-semibold">Remaining</p>
                    <p className="text-2xl font-bold text-orange-800">
                      $
                      {(
                        eventBudget -
                        expenses.reduce((sum, expense) => sum + Number.parseFloat(expense.amount || "0"), 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expenses List */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Expenses</h3>
                  <Button
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense</span>
                  </Button>
                </div>

                {loadingExpenses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading expenses...</p>
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No expenses recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenses.map((expense, index) => (
                      <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <span>Category: {expense.category}</span>
                                <span>Amount: ${expense.amount}</span>
                                <span>Paid by: {expense.paidBy}</span>
                              </div>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                              {new Date(expense.date).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Configuration Modal */}
      {showBudgetConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-md rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Configure Budget</h3>
                <Button onClick={() => setShowBudgetConfig(false)} variant="outline" size="sm" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleBudgetUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Budget ($)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Current: $${eventBudget}`}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg"
                >
                  Update Budget
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl mx-4">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold">Add Expense</h2>
                <Button onClick={() => setShowExpenseForm(false)} variant="outline" size="sm" className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={expenseFormData.category}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="Decorations">Decorations</option>
                      <option value="Food & Catering">Food & Catering</option>
                      <option value="Priest & Rituals">Priest & Rituals</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($) *</label>
                    <input
                      type="number"
                      value={expenseFormData.amount}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <input
                    type="text"
                    value={expenseFormData.description}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Brief description of the expense"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={expenseFormData.date}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid By *</label>
                    <input
                      type="text"
                      value={expenseFormData.paidBy}
                      onChange={(e) => setExpenseFormData({ ...expenseFormData, paidBy: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Name of person who paid"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receipt/Notes</label>
                  <textarea
                    value={expenseFormData.receipt}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, receipt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Additional notes or receipt details"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Add Expense
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="bg-gradient-to-r from-orange-100 to-amber-100 border-t border-orange-200 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            Built by Sundeep with ❤️ for Community
            <br />
            Powered by Vercel
          </p>
          <p className="text-gray-500 text-xs mt-2">Visitors: {visitorCount.toLocaleString()}</p>
        </div>
      </footer>
    </div>
  )
}
