import React, { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, ArrowRight, Calendar } from 'lucide-react';

interface RentResult {
  overcharged: boolean | null;
  message: string;
  overcharge_amount?: number;
  months_since_change?: number;
  error?: boolean;
}

const RentCalculator = () => {
  const [step, setStep] = useState(1);
  const [lastChangeDate, setLastChangeDate] = useState('');
  const [oldRent, setOldRent] = useState('');
  const [newRent, setNewRent] = useState('');
  const [result, setResult] = useState<RentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRent = async () => {
    setIsLoading(true);
    
    try {
      // FastAPI endpoint URL (adjust port if needed)
      const response = await fetch('http://localhost:8000/rent-calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_rent: parseFloat(oldRent),
          new_rent: parseFloat(newRent),
          last_change_date: lastChangeDate,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: RentResult = await response.json();
      setResult(data);
      setStep(5);
    } catch (error) {
      console.error('Error calculating rent:', error);
      alert('Error calculating rent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && lastChangeDate) {
      setStep(2);
    } else if (step === 2 && oldRent) {
      setStep(3);
    } else if (step === 3 && newRent) {
      setStep(4);
    } else if (step === 4) {
      calculateRent();
    }
  };

  const resetCalculator = () => {
    setStep(1);
    setLastChangeDate('');
    setOldRent('');
    setNewRent('');
    setResult(null);
  };

  const canProceed = () => {
    if (step === 1) return lastChangeDate !== '';
    if (step === 2) return oldRent !== '';
    if (step === 3) return newRent !== '';
    if (step === 4) return true;
    return false;
  };

  // CSS-in-JS animation styles
  const fadeInStyle: React.CSSProperties = {
    animation: 'fadeIn 0.5s ease-out',
  };

  return (
    <div className="min-h-screen bg-blue-600">
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      {/* Header */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Empty header space */}
        </div>
      </div>

      {/* Tool Card */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-lg">
          <div className="bg-gray-100 rounded-lg p-8 transition-all duration-500 ease-in-out">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4" style={{ 
                letterSpacing: '0.15em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                RENT CALCULATOR
              </p>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight" style={{ 
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                Check if you're being overcharged
              </h2>
              
              <p className="text-base text-gray-700 leading-relaxed mb-8" style={{ 
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                lineHeight: '1.5'
              }}>
                Use this calculator to see if your rent increase exceeds the legal 4% CPI limit.
              </p>
            </div>

            <div className="space-y-6">
              {/* Step 1: Last Change Date */}
              {step === 1 && (
                <div style={fadeInStyle}>
                  <label className="block text-lg font-semibold text-gray-900 mb-3" style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                  }}>
                    When was your rent last changed?
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-4 h-6 w-6 text-gray-400" />
                    <input
                      type="date"
                      value={lastChangeDate}
                      onChange={(e) => setLastChangeDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      autoFocus
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Note: You can only check for overcharges if the rent was changed within the last 14 months.
                  </p>
                </div>
              )}

              {/* Step 2: Old Rent */}
              {step === 2 && (
                <div style={fadeInStyle}>
                  <label className="block text-lg font-semibold text-gray-900 mb-3" style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                  }}>
                    What is your old rent?
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-4 h-6 w-6 text-gray-400" />
                    <input
                      type="number"
                      value={oldRent}
                      onChange={(e) => setOldRent(e.target.value)}
                      placeholder="1,200"
                      className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      step="0.01"
                      min="0"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 3: New Rent */}
              {step === 3 && (
                <div style={fadeInStyle}>
                  <label className="block text-lg font-semibold text-gray-900 mb-3" style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segue UI", sans-serif' 
                  }}>
                    What is your new rent?
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-4 h-6 w-6 text-gray-400" />
                    <input
                      type="number"
                      value={newRent}
                      onChange={(e) => setNewRent(e.target.value)}
                      placeholder="1,300"
                      className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      step="0.01"
                      min="0"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div style={fadeInStyle}>
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ 
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                    }}>
                      Ready to check your rent
                    </h3>
                    <div className="space-y-2 text-gray-700" style={{ 
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                    }}>
                      <p>Last change date: <span className="font-semibold">{lastChangeDate}</span></p>
                      <p>Old rent: <span className="font-semibold">${parseFloat(oldRent).toFixed(2)}</span></p>
                      <p>New rent: <span className="font-semibold">${parseFloat(newRent).toFixed(2)}</span></p>
                      <p className="text-sm text-gray-600">Legal limit (4% CPI): <span className="font-semibold">${(parseFloat(oldRent) * 1.04).toFixed(2)}</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Results */}
              {step === 5 && result && (
                <div style={fadeInStyle}>
                  <div className={`rounded-lg p-6 text-center ${
                    result.error
                      ? 'bg-yellow-50 border-2 border-yellow-200'
                      : result.overcharged === null
                      ? 'bg-yellow-50 border-2 border-yellow-200'
                      : result.overcharged 
                      ? 'bg-red-50 border-2 border-red-200' 
                      : 'bg-green-50 border-2 border-green-200'
                  }`}>
                    {result.error || result.overcharged === null ? (
                      <>
                        <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-yellow-800 mb-2" style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontWeight: '700'
                        }}>
                          Cannot Check
                        </h3>
                        <p className="text-lg text-yellow-700" style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        }}>
                          {result.message}
                        </p>
                        {result.months_since_change && (
                          <p className="text-sm text-yellow-600 mt-2">
                            {result.months_since_change} months since last change
                          </p>
                        )}
                      </>
                    ) : result.overcharged ? (
                      <>
                        <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-800 mb-2" style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontWeight: '700'
                        }}>
                          You are being overcharged!
                        </h3>
                        {result.overcharge_amount && (
                          <p className="text-lg text-red-700" style={{ 
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                          }}>
                            ${Math.abs(result.overcharge_amount).toFixed(2)} over the legal limit per month
                          </p>
                        )}
                        {result.months_since_change && (
                          <p className="text-sm text-red-600 mt-2">
                            {result.months_since_change} months since last change
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-800 mb-2" style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontWeight: '700'
                        }}>
                          Your rent is legal
                        </h3>
                        <p className="text-lg text-green-700" style={{ 
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        }}>
                          Within the 4% CPI limit
                        </p>
                        {result.months_since_change && (
                          <p className="text-sm text-green-600 mt-2">
                            {result.months_since_change} months since last change
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || isLoading}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    letterSpacing: '0.15em',
                    fontWeight: '700'
                  }}
                >
                  {isLoading ? (
                    'CHECKING...'
                  ) : step < 4 ? (
                    <>
                      NEXT
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    'CHECK IF I AM BEING OVERCHARGED'
                  )}
                </button>
              ) : (
                <button
                  onClick={resetCalculator}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-8 rounded text-sm uppercase tracking-wider transition-colors"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    letterSpacing: '0.15em',
                    fontWeight: '700'
                  }}
                >
                  CHECK ANOTHER RENT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculator;