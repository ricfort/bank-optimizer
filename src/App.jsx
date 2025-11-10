import { useState, useEffect } from 'react'
import configData from './data/config.json'

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [companies, setCompanies] = useState([])
  const [displayedCompanies, setDisplayedCompanies] = useState([])
  const [isOptimized, setIsOptimized] = useState(false)
  const [isAIOptimizing, setIsAIOptimizing] = useState(false)
  const [showConfidenceB, setShowConfidenceB] = useState(false)

  useEffect(() => {
    if (selectedCustomer) {
      const customerCompanies = configData.companies[selectedCustomer.id]
      setCompanies(customerCompanies)
      setDisplayedCompanies(customerCompanies)
      setIsOptimized(false)
      setShowConfidenceB(false)
    }
  }, [selectedCustomer])

  const handleOptimize = () => {
    // Sort by confidence and take top 10
    const sorted = [...companies].sort((a, b) => b.confidence - a.confidence)
    const top10 = sorted.slice(0, 10)
    setDisplayedCompanies(top10)
    setIsOptimized(true)
    setShowConfidenceB(false)
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
    <div className="min-h-screen bg-gray-50">
      {/* Lazard Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Lazard_Logo_1.svg" 
              alt="Lazard" 
              className="h-8"
            />
            <div className="text-right">
              <h1 className="text-2xl font-serif text-gray-900 font-bold">
                Portfolio Optimization Platform
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Intelligent Investment Solutions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Customer Selection */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6 animate-slide-up">
          <label className="block text-xl font-serif font-semibold text-gray-900 mb-4">
            Client Selection
          </label>
          <select
            className="w-full p-4 text-lg border border-gray-300 rounded focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900 focus:ring-opacity-20 transition-all duration-200 font-serif"
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
          <div className="flex gap-4 mb-6 animate-slide-up">
            <button
              onClick={handleOptimize}
              disabled={isOptimized}
              className={`flex-1 py-4 px-8 text-lg font-serif font-semibold rounded transition-all duration-200 border ${
                isOptimized
                  ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800 text-white border-blue-900 shadow-sm hover:shadow'
              }`}
            >
              {isOptimized ? '✓ Portfolio Optimized' : 'Optimize Portfolio (Top 10)'}
            </button>
            <button
              onClick={handleAIOptimize}
              disabled={!isOptimized || isAIOptimizing}
              className={`flex-1 py-4 px-8 text-lg font-serif font-semibold rounded transition-all duration-200 border ${
                !isOptimized || isAIOptimizing
                  ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 text-blue-900 border-blue-900 shadow-sm hover:shadow'
              }`}
            >
              {isAIOptimizing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                  Analyzing Client History...
                </span>
              ) : (
                'AI-Enhanced Analysis for Client'
              )}
            </button>
          </div>
        )}

        {/* Companies Display */}
        {selectedCustomer && displayedCompanies.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                {isOptimized ? 'Optimized Portfolio' : 'Investment Opportunities'} ({displayedCompanies.length})
              </h2>
              {showConfidenceB && (
                <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <span>High (≥80)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
                    <span>Medium (60-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                    <span>Low (&lt;60)</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-5 max-h-[800px] overflow-y-auto pr-2">
              {displayedCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideUp 0.5s ease-out forwards',
                    opacity: 0,
                  }}
                >
                  <div className="p-8">
                    {/* Header with Logo and Name */}
                    <div className="flex items-start gap-6 mb-6">
                      {company.logo && (
                        <div className="flex-shrink-0">
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-20 h-20 rounded bg-gray-50 p-3 border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                            {company.name}
                          </h3>
                          <span className="ml-4 px-4 py-2 bg-blue-900 text-white text-lg font-bold rounded shadow">
                            {company.confidence}
                          </span>
                        </div>
                        
                        {/* Financial Metrics */}
                        {company.revenue && (
                          <div className="flex gap-6 mt-3">
                            <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200">
                              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">Revenue</p>
                              <p className="text-lg font-bold text-gray-900 font-serif">{company.revenue}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200">
                              <p className="text-xs text-gray-600 font-semibold mb-1 uppercase tracking-wide">EBITDA</p>
                              <p className="text-lg font-bold text-gray-900 font-serif">{company.ebitda}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shareholders */}
                    {company.shareholders && (
                      <div className="mb-6 bg-gray-50 rounded p-4 border border-gray-200">
                        <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Key Shareholders</p>
                        <div className="flex flex-wrap gap-2">
                          {company.shareholders.map((shareholder, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white text-gray-700 text-sm font-medium rounded border border-gray-300"
                            >
                              {shareholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Reasoning */}
                    {company.reasoning && showConfidenceB && (
                      <div className="mb-6 bg-blue-50 rounded p-4 border border-blue-200 animate-fade-in">
                        <p className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">Investment Rationale</p>
                        <p className="text-gray-800 leading-relaxed font-serif italic">{company.reasoning}</p>
                      </div>
                    )}

                    {/* Confidence Bars */}
                    <div className="space-y-4">
                      {/* Initial Confidence Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-700 mb-2 font-semibold">
                          <span className="uppercase tracking-wide">Initial Assessment</span>
                          <span>{company.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2.5">
                          <div
                            className="bg-blue-900 h-2.5 rounded transition-all duration-1000"
                            style={{ width: getConfidenceWidth(company.confidence) }}
                          ></div>
                        </div>
                      </div>

                      {/* AI-Optimized Confidence Bar */}
                      {showConfidenceB && (
                        <div className="animate-fade-in">
                          <div className="flex justify-between text-sm text-gray-700 mb-2 font-semibold">
                            <span className="uppercase tracking-wide">AI-Enhanced Score</span>
                            <span className="font-bold">{company.confidenceB}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded h-3">
                            <div
                              className={`h-3 rounded transition-all duration-1000 ${getConfidenceColor(
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
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-6 text-gray-400">📊</div>
            <p className="text-xl text-gray-600 font-serif">
              Select a client to begin portfolio optimization
            </p>
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
