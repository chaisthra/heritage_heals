// app/components/IngredientIdentifier.tsx
'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

export default function IngredientIdentifier() {
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [rawResponse, setRawResponse] = useState<string>('')

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY
    if (apiKey) {
      setGenAI(new GoogleGenerativeAI(apiKey))
    } else {
      console.error("API key not found")
    }
  }, [])

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setLoading(true)
      setError(null)
      setIngredients([])
      setRawResponse('')
      
      try {
        if (!genAI) {
          throw new Error("Google Generative AI not initialized")
        }
        
        const base64Image = await getBase64(file)
        
        const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const prompt = `
          Analyze this image of a refrigerator's contents and identify the ingredients present.
          Focus on recognizing common food items, produce, dairy products, meats, and packaged goods.
          Be as specific as possible, mentioning brands if visible.
          If you're unsure about an item, you can describe it instead of naming it.
          Return the result as a simple list of ingredients, one per line.
        `
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Image, mimeType: file.type } },
        ])
        const response = await result.response
        console.log("API Response:", response) // Log the full response
        
        const rawText = response.text()
        setRawResponse(rawText)
        
        // Split the raw text into an array of ingredients
        const identifiedIngredients = rawText.split('\n').filter(item => item.trim() !== '')
        
        setIngredients(identifiedIngredients)
      } catch (error) {
        console.error("Error identifying ingredients:", error)
        setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFeedbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Feedback submitted:", feedback)
    alert("Thank you for your feedback!")
    setFeedback('')
  }

  // Helper function to convert File to base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          resolve(result.split(',')[1])
        } else {
          reject(new Error('Failed to read file as base64'))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Upload an image of your fridge contents
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      {image && (
        <div className="mt-4">
          <Image src={image} alt="Uploaded fridge contents" width={300} height={300} className="rounded-lg" />
        </div>
      )}

      {loading && <p className="mt-4 text-center">Identifying ingredients...</p>}

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      {rawResponse && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients Identified</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{rawResponse}</pre>
          </div>
        </div>
      )}

      <form onSubmit={handleFeedbackSubmit} className="mt-8">
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
          How accurate was the identification? Any feedback?
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  )
}