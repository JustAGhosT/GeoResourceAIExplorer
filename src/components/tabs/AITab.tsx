'use client'

import { useState } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIMessage } from '@/types'

const SAMPLE_CONVERSATIONS: AIMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your GeoResource AI Assistant. I can help you analyze mining data, explore resource distributions, and provide insights about the mining industry. What would you like to know?',
    timestamp: new Date()
  }
]

const SUGGESTED_QUESTIONS = [
  "What are the top gold producing mines in South Africa?",
  "Show me lithium mines and their production capacity",
  "Analyze diamond mine distribution across Africa",
  "What is the total production value of all mines?",
  "Which countries have the most diverse resource types?",
  "Compare copper production between different regions"
]

export function AITab() {
  const [messages, setMessages] = useState<AIMessage[]>(SAMPLE_CONVERSATIONS)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('gold')) {
      return "Based on the current data, the Witwatersrand Gold Fields is the largest gold producer in South Africa with an annual production value of $2.8 billion. This mine has been operational since 1886 and also produces uranium as a secondary resource. The mine is located in Gauteng province and is owned by AngloGold Ashanti."
    }
    
    if (lowerQuestion.includes('lithium')) {
      return "The Bikita Lithium Mine in Zimbabwe is a significant lithium producer with $85 million in annual production. Established in 1956, it's located in the Masvingo region and also produces rare earth elements. Lithium demand has been increasing significantly due to electric vehicle battery production."
    }
    
    if (lowerQuestion.includes('diamond')) {
      return "Diamond mining is concentrated in southern Africa. The Jwaneng Diamond Mine in Botswana leads with $3.2 billion in annual production, followed by the Cullinan Diamond Mine in South Africa ($150 million). These mines represent some of the world's most valuable diamond operations."
    }
    
    if (lowerQuestion.includes('total') || lowerQuestion.includes('production')) {
      return "The total tracked production value across all mines in the database is $24.5 billion annually. This includes 10 major mines across South Africa, Botswana, Zimbabwe, and Zambia, covering 11 different resource types from diamonds to rare earth elements."
    }
    
    if (lowerQuestion.includes('copper')) {
      return "Copper production is dominated by Zambian mines, particularly the Kansanshi Copper Mine ($1.1 billion) and Konkola Copper Mine ($890 million). South Africa also contributes through the Palabora Copper Mine ($680 million) in Limpopo province."
    }
    
    return "Thank you for your question! I can provide detailed analysis on mine locations, production values, resource types, and regional comparisons. The database covers major mines across southern Africa with comprehensive production and operational data. Would you like me to focus on a specific aspect of the mining data?"
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-600">Ask questions about mining data and get insights</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded-full ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    message.role === 'user' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-gray-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 bg-white border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Try asking about:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white border-t">
        <div className="flex space-x-4">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about mining data, resources, production values..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}