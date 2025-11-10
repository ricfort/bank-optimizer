import { useState, useEffect } from 'react'
import configData from './data/config.json'

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [companies, setCompanies] = useState([])
  const [displayedCompanies, setDisplayedCompanies] = useState([])
  const [isOptimized, setIsOptimized] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isAIOptimizing, setIsAIOptimizing] = useState(false)
  const [showConfidenceB, setShowConfidenceB] = useState(false)

  useEffect(() => {
    if (selectedCustomer) {
      const customerCompanies = configData.companies[selectedCustomer.id]
      setCompanies(customerCompanies)
      setDisplayedCompanies(customerCompanies)
      setIsOptimized(false)
      setIsOptimizing(false)
      setShowConfidenceB(false)
    }
  }, [selectedCustomer])

  const handleOptimize = () => {
    setIsOptimizing(true)
    // Simulate AI processing
    setTimeout(() => {
      // Sort by confidence and take top 10
      const sorted = [...companies].sort((a, b) => b.confidence - a.confidence)
      const top10 = sorted.slice(0, 10)
      setDisplayedCompanies(top10)
      setIsOptimized(true)
      setShowConfidenceB(false)
      setIsOptimizing(false)
    }, 1500)
  }

  const handleAIOptimize = () => {
    setIsAIOptimizing(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsAIOptimizing(false)
      setShowConfidenceB(true)
    }, 2000)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-600'
    if (confidence >= 60) return 'bg-amber-500'
    return 'bg-red-600'
  }

  const getConfidenceWidth = (confidence) => {
    return `${confidence}%`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Moody's Orbis Style Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Lazard_Logo_1.svg" 
                alt="Lazard" 
                className="h-7 bg-white px-3 py-1 rounded"
              />
              <div className="border-l border-blue-600 pl-4">
                <h1 className="text-xl font-bold text-white">
                  Portfolio Intelligence Platform
                </h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200 uppercase tracking-wide">
                Advanced Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Customer Selection */}
        <div className="bg-white rounded shadow border border-gray-300 p-6 mb-5 animate-slide-up">
          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Client Selection
          </label>
          <select
            className="w-full p-3 text-base border border-gray-400 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
            value={selectedCustomer?.id || ''}
            onChange={(e) => {
              const customer = configData.customers.find(
                (c) => c.id === parseInt(e.target.value)
              )
              setSelectedCustomer(customer)
            }}
          >
            <option value="">-- Select a client --</option>
            {configData.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.type}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        {selectedCustomer && (
          <div className="flex gap-3 mb-5 animate-slide-up">
            <button
              onClick={handleOptimize}
              disabled={isOptimized || isOptimizing}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded uppercase tracking-wide transition-all duration-200 ${
                isOptimized || isOptimizing
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md'
              }`}
            >
              {isOptimizing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  ✨ AI Analyzing Portfolio...
                </span>
              ) : isOptimized ? (
                '✓ Portfolio Optimized'
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span> AI Optimize Portfolio (Top 10)
                </span>
              )}
            </button>
            <button
              onClick={handleAIOptimize}
              disabled={!isOptimized || isAIOptimizing}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded uppercase tracking-wide transition-all duration-200 ${
                !isOptimized || isAIOptimizing
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 shadow hover:shadow-md'
              }`}
            >
              {isAIOptimizing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  ✨ AI Analyzing Client History...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span> AI-Enhanced Analysis for Client
                </span>
              )}
            </button>
          </div>
        )}

        {/* Companies Display */}
        {selectedCustomer && displayedCompanies.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-4 bg-white rounded shadow border border-gray-300 p-5">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                {isOptimized ? 'Optimized Portfolio' : 'Investment Opportunities'} <span className="text-blue-600">({displayedCompanies.length})</span>
              </h2>
              {showConfidenceB && (
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600"></div>
                    <span>HIGH ≥80</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500"></div>
                    <span>MED 60-79</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600"></div>
                    <span>LOW &lt;60</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4 max-h-[800px] overflow-y-auto pr-2">
              {displayedCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded shadow border border-gray-300 hover:border-blue-500 transition-all duration-200 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideUp 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="p-6">
                    {/* Header with Logo and Name */}
                    <div className="flex items-start gap-5 mb-5">
                      {company.logo && (
                        <div className="flex-shrink-0">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-16 h-16 rounded bg-blue-50 p-2 border border-blue-200"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {company.name}
                          </h3>
                          <span className="ml-4 px-3 py-1 bg-blue-600 text-white text-base font-bold rounded">
                            {company.confidence}
                          </span>
                        </div>
                        
                        {/* Financial Metrics */}
                        {company.revenue && (
                          <div className="flex gap-4 mt-3">
                            <div className="bg-blue-50 px-3 py-2 rounded border border-blue-200">
                              <p className="text-xs text-blue-800 font-bold mb-1 uppercase tracking-wide">Revenue</p>
                              <p className="text-base font-bold text-gray-900">{company.revenue}</p>
                            </div>
                            <div className="bg-blue-50 px-3 py-2 rounded border border-blue-200">
                              <p className="text-xs text-blue-800 font-bold mb-1 uppercase tracking-wide">EBITDA</p>
                              <p className="text-base font-bold text-gray-900">{company.ebitda}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shareholders */}
                    {company.shareholders && (
                      <div className="mb-5 bg-gray-50 rounded p-3 border-l-4 border-blue-600">
                        <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Key Shareholders</p>
                        <div className="flex flex-wrap gap-2">
                          {company.shareholders.map((shareholder, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white text-gray-700 text-xs font-semibold rounded border border-gray-300"
                            >
                              {shareholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Reasoning */}
                    {company.reasoning && showConfidenceB && (
                      <div className="mb-5 bg-blue-50 rounded p-3 border-l-4 border-blue-600 animate-fade-in">
                        <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wider flex items-center">
                          <span className="mr-2">✨</span> AI Investment Rationale
                        </p>
                        <p className="text-gray-800 leading-relaxed text-sm">{company.reasoning}</p>
                      </div>
                    )}

                    {/* Confidence Bars */}
                    <div className="space-y-3">
                      {/* Initial Confidence Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-1 font-bold uppercase tracking-wider">
                          <span>Initial Score</span>
                          <span className="text-blue-600">{company.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2">
                          <div
                            className="bg-blue-600 h-2 transition-all duration-1000"
                            style={{ width: getConfidenceWidth(company.confidence) }}
                          ></div>
                        </div>
                      </div>

                      {/* AI-Optimized Confidence Bar */}
                      {showConfidenceB && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between text-xs text-gray-600 mb-1 font-bold uppercase tracking-wider">
                            <span className="flex items-center">
                              <span className="mr-1.5">✨</span> Client-Tailored Score
                            </span>
                            <span className="text-blue-600">{company.confidenceB}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2.5">
                            <div
                              className={`h-2.5 transition-all duration-1000 ${getConfidenceColor(
                                company.confidenceB
                              )}`}
                              style={{ 
                                width: getConfidenceWidth(company.confidenceB),
                                animationDelay: `${index * 100}ms`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedCustomer && (
          <div className="animate-fade-in bg-white rounded shadow border border-gray-300 p-12">
            <div className="max-w-3xl mx-auto">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Multi-Agent Portfolio Intelligence Platform
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Select a client from the dropdown above to activate our three-tier AI agent system 
                  for comprehensive portfolio analysis and optimization recommendations.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded border border-blue-200">
                    <div className="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wider">Agent 1</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">Scout</div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      Identifies and analyzes 100+ prospects across the market landscape
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded border border-blue-200">
                    <div className="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wider">Agent 2</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">Tailor</div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      Customizes recommendations based on client history and preferences
                    </div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded border border-blue-200">
                    <div className="text-blue-600 font-bold text-sm mb-2 uppercase tracking-wider">Agent 3</div>
                    <div className="text-lg font-bold text-gray-900 mb-2">Jury</div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      Validates and scores final recommendations with confidence metrics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

export default App
