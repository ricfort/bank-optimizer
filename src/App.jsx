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
  const [rejectedCompanies, setRejectedCompanies] = useState(new Set())
  const [approvedCompanies, setApprovedCompanies] = useState(new Set())
  const [swipingOut, setSwipingOut] = useState(new Set())
  const [showFinalAnalysis, setShowFinalAnalysis] = useState(false)

  const filteredCompanies = displayedCompanies.filter(company => !rejectedCompanies.has(company.id))
  
  const getShareholderScore = (shareholders) => {
    if (!shareholders) return 50
    // Score based on number of institutional/strategic investors
    const institutionalKeywords = ['Fund', 'Capital', 'Ventures', 'Partners', 'Institutional', 'Pension', 'Sovereign']
    const score = shareholders.reduce((acc, sh) => {
      const hasInstitutional = institutionalKeywords.some(keyword => sh.includes(keyword))
      return acc + (hasInstitutional ? 15 : 5)
    }, 50)
    return Math.min(score, 100)
  }

  const getCompatibilityScore = (company) => {
    const confidenceWeight = 0.35
    const tailoredWeight = 0.45
    const shareholderWeight = 0.20
    
    const shareholderScore = getShareholderScore(company.shareholders)
    
    return Math.round(
      company.confidence * confidenceWeight +
      company.confidenceB * tailoredWeight +
      shareholderScore * shareholderWeight
    )
  }

  const approvedCompaniesList = displayedCompanies.filter(c => approvedCompanies.has(c.id))
  const allReviewed = showConfidenceB && 
                      displayedCompanies.length > 0 && 
                      (approvedCompanies.size + rejectedCompanies.size) === displayedCompanies.length &&
                      approvedCompaniesList.length > 0

  useEffect(() => {
    if (selectedCustomer) {
      const customerCompanies = configData.companies[selectedCustomer.id]
      setCompanies(customerCompanies)
      setDisplayedCompanies(customerCompanies)
      setIsOptimized(false)
      setIsOptimizing(false)
      setShowConfidenceB(false)
      setRejectedCompanies(new Set())
      setApprovedCompanies(new Set())
      setSwipingOut(new Set())
      setShowFinalAnalysis(false)
    }
  }, [selectedCustomer])

  // Check if all companies have been reviewed
  useEffect(() => {
    if (allReviewed && !showFinalAnalysis) {
      setTimeout(() => setShowFinalAnalysis(true), 500)
    }
  }, [allReviewed, showFinalAnalysis])

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
      // Sort by confidenceB and take top 5
      const sorted = [...displayedCompanies].sort((a, b) => b.confidenceB - a.confidenceB)
      const top5 = sorted.slice(0, 5)
      setDisplayedCompanies(top5)
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

  const getCompanyInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const getInitialsColor = (confidence) => {
    if (confidence >= 90) return 'bg-gradient-to-br from-blue-600 to-blue-700'
    if (confidence >= 80) return 'bg-gradient-to-br from-blue-500 to-blue-600'
    if (confidence >= 70) return 'bg-gradient-to-br from-gray-600 to-gray-700'
    return 'bg-gradient-to-br from-gray-500 to-gray-600'
  }

  const getStatusBadge = (confidence) => {
    if (confidence >= 95) return { text: 'PRIME TARGET', color: 'bg-green-600' }
    if (confidence >= 85) return { text: 'HIGH PRIORITY', color: 'bg-blue-600' }
    if (confidence >= 75) return { text: 'QUALIFIED', color: 'bg-gray-600' }
    return null
  }

  const handleApprove = (companyId) => {
    setApprovedCompanies(prev => new Set([...prev, companyId]))
  }

  const handleReject = (companyId) => {
    // Start swipe animation
    setSwipingOut(prev => new Set([...prev, companyId]))
    // Remove from list after animation completes
    setTimeout(() => {
      setRejectedCompanies(prev => new Set([...prev, companyId]))
      setSwipingOut(prev => {
        const newSet = new Set(prev)
        newSet.delete(companyId)
        return newSet
      })
    }, 400)
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

        {!showFinalAnalysis && (
          <>
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

        {/* Loading Overlay */}
        {isOptimizing && (
          <div className="mb-5 bg-white rounded shadow border border-gray-300 p-8 animate-slide-up">
            <div className="flex items-center justify-center gap-4">
              <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
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
              <div>
                <p className="text-lg font-bold text-gray-900">✨ Scout Agent Analyzing...</p>
                <p className="text-sm text-gray-600">Filtering top prospects from portfolio</p>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedCustomer && !showFinalAnalysis && (
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
              disabled={!isOptimized || isAIOptimizing || showConfidenceB}
              className={`flex-1 py-3 px-6 text-sm font-bold rounded uppercase tracking-wide transition-all duration-200 ${
                !isOptimized || isAIOptimizing || showConfidenceB
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
                  ✨ Analyzing Customer Persona...
                </span>
              ) : showConfidenceB ? (
                '✓ AI Analysis Complete'
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span> Customer Persona AI Analysis
                </span>
              )}
            </button>
          </div>
        )}

        {/* Companies Display */}
        {selectedCustomer && displayedCompanies.length > 0 && (
          <div className={`animate-slide-up ${isOptimizing ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center mb-4 bg-white rounded shadow border border-gray-300 p-5">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                {showConfidenceB ? 'Final Recommendations' : isOptimized ? 'Optimized Portfolio' : 'Investment Opportunities'} <span className="text-blue-600">({filteredCompanies.length})</span>
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
              {filteredCompanies.map((company, index) => {
                const statusBadge = getStatusBadge(company.confidence)
                const isApproved = approvedCompanies.has(company.id)
                const isSwiping = swipingOut.has(company.id)
                return (
                <div
                  key={company.id}
                  className={`bg-white rounded-lg shadow-md border border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                    isSwiping ? 'swipe-out' : ''
                  }`}
                  style={{
                    animationDelay: isSwiping ? '0ms' : `${index * 50}ms`,
                    animation: isSwiping ? 'swipeOut 0.4s ease-in forwards' : 'slideUp 0.5s ease-out forwards',
                    opacity: isSwiping ? 1 : 0,
                  }}
                >
                  {/* Top Accent Bar */}
                  <div className={`h-1.5 ${getInitialsColor(company.confidence)}`}></div>
                  
                  <div className="p-6 relative">
                    {/* Header with Logo and Name */}
                    <div className="flex items-start gap-5 mb-5">
                      <div className="flex-shrink-0">
                        {company.logo ? (
                          <div className="w-16 h-16 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img 
                              src={company.logo} 
                              alt={company.name}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="w-full h-full ${getInitialsColor(company.confidence)} flex items-center justify-center rounded-lg">
                                    <span class="text-white text-xl font-bold tracking-tight">
                                      ${getCompanyInitials(company.name)}
                                    </span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        ) : (
                          <div className={`w-16 h-16 rounded-lg ${getInitialsColor(company.confidence)} flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                            <span className="text-white text-xl font-bold tracking-tight">
                              {getCompanyInitials(company.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {company.name}
                            </h3>
                            {statusBadge && (
                              <span className={`inline-block px-2 py-0.5 ${statusBadge.color} text-white text-xs font-bold rounded uppercase tracking-wider`}>
                                {statusBadge.text}
                              </span>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Score</div>
                            <div className="px-3 py-1.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-bold rounded-lg shadow-md">
                              {company.confidence}
                            </div>
                          </div>
                        </div>
                        
                        {/* Financial Metrics */}
                        {company.revenue && (
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-3 rounded-lg border border-green-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xs text-green-800 font-bold uppercase tracking-wide">Revenue</p>
                              </div>
                              <p className="text-lg font-bold text-gray-900">{company.revenue}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p className="text-xs text-blue-800 font-bold uppercase tracking-wide">EBITDA</p>
                              </div>
                              <p className="text-lg font-bold text-gray-900">{company.ebitda}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shareholders */}
                    {company.shareholders && (
                      <div className="mb-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Key Shareholders</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {company.shareholders.map((shareholder, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-white text-gray-700 text-xs font-semibold rounded-md border border-gray-300 shadow-sm hover:shadow transition-shadow"
                            >
                              {shareholder}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Investment Reasoning */}
                    {company.reasoning && showConfidenceB && (
                      <div className="mb-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-blue-600 shadow-sm animate-fade-in">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-sm">✨</span>
                            </div>
                            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                              Investment Rationale
                            </p>
                          </div>
                          {!isApproved && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(company.id)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded uppercase tracking-wide transition-colors shadow-sm"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleReject(company.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded uppercase tracking-wide transition-colors shadow-sm"
                              >
                                ✕ Reject
                              </button>
                            </div>
                          )}
                          {isApproved && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded uppercase tracking-wide shadow-sm">
                              ✓ Approved
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 leading-relaxed text-sm pl-8">{company.reasoning}</p>
                      </div>
                    )}

                    {/* Confidence Bars */}
                    <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Initial Confidence Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold uppercase tracking-wider">
                          <span>Initial Score</span>
                          <span className="text-blue-600 text-sm">{company.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-300 h-2.5 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 shadow"
                            style={{ width: getConfidenceWidth(company.confidence) }}
                          ></div>
                        </div>
                      </div>

                      {/* AI-Optimized Confidence Bar */}
                      {showConfidenceB && (
                        <div className="animate-fade-in pt-3 border-t border-gray-300">
                          <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold uppercase tracking-wider">
                            <span className="flex items-center">
                              <span className="mr-1.5">✨</span> Client-Tailored Score
                            </span>
                            <span className="text-blue-600 text-sm">{company.confidenceB}%</span>
                          </div>
                          <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-3 rounded-full transition-all duration-1000 shadow-md ${getConfidenceColor(
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
              )})}
            
            </div>
          </div>
        )}
          </>
        )}

        {/* Final Analysis Section */}
        {showFinalAnalysis && approvedCompaniesList.length > 0 && (
          <div className="animate-slide-up">
            {/* Header Section */}
            <div className="bg-white border-b-4 border-blue-800 shadow-md mb-6">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Analysis Report</h2>
                    <p className="text-base text-gray-700 font-medium">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-800 font-bold uppercase tracking-wide mb-1">Selected Companies</div>
                    <div className="text-5xl font-bold text-blue-800">{approvedCompaniesList.length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border-2 border-gray-300 shadow-md">
                <div className="px-4 py-3 bg-gray-100 border-b-2 border-gray-300">
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Average Compatibility</div>
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-4xl font-bold text-blue-900">
                    {Math.round(approvedCompaniesList.reduce((acc, c) => acc + getCompatibilityScore(c), 0) / approvedCompaniesList.length)}%
                  </div>
                </div>
              </div>
              <div className="bg-white border-2 border-gray-300 shadow-md">
                <div className="px-4 py-3 bg-gray-100 border-b-2 border-gray-300">
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Top Match Score</div>
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-4xl font-bold text-blue-900">
                    {Math.max(...approvedCompaniesList.map(c => getCompatibilityScore(c)))}%
                  </div>
                </div>
              </div>
              <div className="bg-white border-2 border-gray-300 shadow-md">
                <div className="px-4 py-3 bg-gray-100 border-b-2 border-gray-300">
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Portfolio Status</div>
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-2xl font-bold text-green-700 uppercase tracking-wide">Approved</div>
                </div>
              </div>
            </div>

              {/* Approved Companies List */}
              <div className="space-y-4">
                {approvedCompaniesList
                  .sort((a, b) => getCompatibilityScore(b) - getCompatibilityScore(a))
                  .map((company, index) => {
                    const compatibilityScore = getCompatibilityScore(company)
                    const shareholderScore = getShareholderScore(company.shareholders)
                    
                    return (
                      <div
                        key={company.id}
                        className="bg-white border border-gray-300 shadow-sm"
                        style={{
                          animation: `slideUp 0.5s ease-out ${index * 100}ms forwards`,
                          opacity: 0,
                        }}
                      >
                        {/* Company Header */}
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Rank Badge */}
                              <div className="w-12 h-12 bg-blue-900 text-white rounded flex items-center justify-center font-bold text-xl shadow-md">
                                {index + 1}
                              </div>
                              {/* Company Logo */}
                              <div className="flex-shrink-0">
                                {company.logo ? (
                                  <img 
                                    src={company.logo} 
                                    alt=""
                                    className="w-14 h-14 object-contain bg-white p-1.5 border-2 border-gray-300 shadow-sm"
                                    onError={(e) => {
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`w-14 h-14 ${getInitialsColor(company.confidence)} items-center justify-center border-2 border-gray-300 shadow-sm`}
                                  style={{ display: company.logo ? 'none' : 'flex' }}
                                >
                                  <span className="text-white text-base font-bold tracking-tight">
                                    {getCompanyInitials(company.name)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900">{company.name}</h3>
                                <div className="text-sm text-gray-700 font-medium mt-1">Target Company</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-800 font-bold uppercase tracking-wide mb-1">Compatibility Score</div>
                              <div className="text-4xl font-bold text-blue-900">{compatibilityScore}%</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* Score Breakdown Table */}
                          <div className="mb-6">
                            <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-300 pb-2">
                              Compatibility Analysis
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="border-2 border-gray-300 bg-gray-50 p-4">
                                <div className="text-xs text-gray-800 font-bold uppercase tracking-wide mb-2">Market Score</div>
                                <div className="flex items-end gap-2">
                                  <span className="text-3xl font-bold text-gray-900">{company.confidence}</span>
                                  <span className="text-gray-700 font-bold text-sm mb-1">/ 100</span>
                                </div>
                                <div className="mt-3 bg-gray-300 h-2 w-full rounded">
                                  <div 
                                    className="bg-blue-800 h-2 rounded transition-all duration-1000"
                                    style={{ width: `${company.confidence}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="border-2 border-gray-300 bg-gray-50 p-4">
                                <div className="text-xs text-gray-800 font-bold uppercase tracking-wide mb-2">Client Fit</div>
                                <div className="flex items-end gap-2">
                                  <span className="text-3xl font-bold text-gray-900">{company.confidenceB}</span>
                                  <span className="text-gray-700 font-bold text-sm mb-1">/ 100</span>
                                </div>
                                <div className="mt-3 bg-gray-300 h-2 w-full rounded">
                                  <div 
                                    className="bg-blue-800 h-2 rounded transition-all duration-1000"
                                    style={{ width: `${company.confidenceB}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="border-2 border-gray-300 bg-gray-50 p-4">
                                <div className="text-xs text-gray-800 font-bold uppercase tracking-wide mb-2">Shareholder Quality</div>
                                <div className="flex items-end gap-2">
                                  <span className="text-3xl font-bold text-gray-900">{shareholderScore}</span>
                                  <span className="text-gray-700 font-bold text-sm mb-1">/ 100</span>
                                </div>
                                <div className="mt-3 bg-gray-300 h-2 w-full rounded">
                                  <div 
                                    className="bg-blue-800 h-2 rounded transition-all duration-1000"
                                    style={{ width: `${shareholderScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Financial Data */}
                          {company.revenue && (
                            <div className="mb-6">
                              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-300 pb-2">
                                Financial Metrics
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-gray-300 bg-white p-4">
                                  <div className="text-xs text-gray-800 font-bold uppercase tracking-wide mb-2">Revenue</div>
                                  <div className="text-2xl font-bold text-gray-900">{company.revenue}</div>
                                </div>
                                <div className="border-2 border-gray-300 bg-white p-4">
                                  <div className="text-xs text-gray-800 font-bold uppercase tracking-wide mb-2">EBITDA</div>
                                  <div className="text-2xl font-bold text-gray-900">{company.ebitda}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Shareholders */}
                          {company.shareholders && company.shareholders.length > 0 && (
                            <div className="mb-6">
                              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-300 pb-2">
                                Key Shareholders
                              </div>
                              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                                <ul className="text-sm text-gray-900 space-y-2 font-medium">
                                  {company.shareholders.slice(0, 5).map((sh, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-blue-800 mt-0.5 font-bold">•</span>
                                      <span>{sh}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Investment Rationale */}
                          {company.reasoning && (
                            <div>
                              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 border-b-2 border-gray-300 pb-2">
                                Investment Rationale
                              </div>
                              <div className="bg-blue-50 border-2 border-blue-300 p-4">
                                <p className="text-base text-gray-900 leading-relaxed font-medium">{company.reasoning}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedCustomer && !showFinalAnalysis && (
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
                    <div className="text-lg font-bold text-gray-900 mb-2">Customer Persona</div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      Impersonates the client's preferences to tailor recommendations to their unique profile
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
        
        @keyframes swipeOut {
          0% {
            opacity: 1;
            transform: translateX(0) rotateZ(0deg);
          }
          50% {
            opacity: 0.5;
            transform: translateX(-50px) rotateZ(-5deg);
          }
          100% {
            opacity: 0;
            transform: translateX(-120%) rotateZ(-10deg);
            height: 0;
            margin: 0;
            padding: 0;
          }
        }
        
        .swipe-out {
          animation: swipeOut 0.4s ease-in forwards;
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
