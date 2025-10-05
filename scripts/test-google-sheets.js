// Test script to verify Google Sheets integration
// Run this with: node scripts/test-google-sheets.js

const testRegistration = async () => {
  const testData = {
    fullName: "Test User",
    email: "test@example.com",
    address: "123 Test Street, Test City, TX 12345",
    mobile: "555-123-4567",
    adults: 2,
    kids: 1,
    timestamp: new Date().toISOString(),
    signedInUser: "test@example.com",
  }

  try {
    console.log("Testing Google Sheets integration...")
    console.log("Sending test data:", testData)

    const response = await fetch("http://localhost:3000/api/submit-registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    if (response.ok) {
      console.log("✅ SUCCESS: Test data submitted successfully!")
      console.log("Response:", result)
      console.log("Check your Google Sheet to verify the data was added.")
    } else {
      console.log("❌ ERROR: Failed to submit test data")
      console.log("Response:", result)
    }
  } catch (error) {
    console.log("❌ NETWORK ERROR:", error.message)
    console.log("Make sure your development server is running on localhost:3000")
  }
}

// Run the test
testRegistration()
