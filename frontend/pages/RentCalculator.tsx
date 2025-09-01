import React, { useState } from 'react';
import { DollarSign, AlertTriangle, CheckCircle, ArrowRight, Calendar, Home, Scale } from 'lucide-react';

interface RentResult {
  overcharged?: boolean;
  message: string;
  overcharge_amount?: number;
  illegal_period?: boolean;
  no_cpi?: boolean;
}

const RentCalculator = () => {
  const [step, setStep] = useState(1);
  const [rentDate, setRentDate] = useState('');
  const [oldRent, setOldRent] = useState('');
  const [newRent, setNewRent] = useState('');
  const [result, setResult] = useState<RentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateRent = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/rent-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_rent: parseFloat(oldRent),
          new_rent: parseFloat(newRent),
          date: rentDate,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
    if (step === 1 && rentDate) {
      const dateObj = new Date(rentDate);
      const illegalStart = new Date(2020, 3, 1);
      const illegalEnd = new Date(2023, 9, 1);

      if (dateObj < new Date(2014, 0, 1)) {
        setResult({ message: 'No CPI data available before January 2014', no_cpi: true });
        setStep(5);
        return;
      }

      if (dateObj >= illegalStart && dateObj <= illegalEnd) {
        setResult({ message: 'Any rent raise during this period was illegal', illegal_period: true });
        setStep(5);
        return;
      }

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
    setRentDate('');
    setOldRent('');
    setNewRent('');
    setResult(null);
  };

  const canProceed = () => {
    if (step === 1) return rentDate !== '';
    if (step === 2) return oldRent !== '';
    if (step === 3) return newRent !== '';
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .gradient-text {
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
          }
          .input-glow:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2);
          }
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }
        `}
      </style>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative py-8 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12" style={{animation: 'slideIn 0.8s ease-out'}}>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl">
              <Scale className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black mb-4 gradient-text">
            Rent Legal Check
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Check if your rent increase complies with local CPI regulations
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  step >= num 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110' 
                    : 'bg-white/20 text-blue-200 border-2 border-white/30'
                }`}>
                  {num}
                </div>
                {num < 5 && (
                  <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                    step > num ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-white/30'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-3xl p-10 transition-all duration-700 ease-out" style={{animation: 'fadeIn 0.8s ease-out 0.2s both'}}>
            
            {/* Step 1: Rent Date */}
            {step === 1 && (
              <div style={{animation: 'fadeIn 0.6s ease-out'}}>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-600/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-blue-300" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">When was your rent changed?</h2>
                  <p className="text-blue-200">Select the date when your landlord increased your rent</p>
                </div>
                
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-blue-400 z-10" />
                  <input
                    type="date"
                    value={rentDate}
                    onChange={(e) => setRentDate(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 text-2xl bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 transition-all duration-300 input-glow focus:border-blue-400 focus:bg-white/20"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Old Rent */}
            {step === 2 && (
              <div style={{animation: 'fadeIn 0.6s ease-out'}}>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <Home className="h-12 w-12 text-green-300" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What was your previous rent?</h2>
                  <p className="text-blue-200">Enter your monthly rent amount before the increase</p>
                </div>
                
                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-green-400 z-10" />
                  <input
                    type="number"
                    value={oldRent}
                    onChange={(e) => setOldRent(e.target.value)}
                    placeholder="1,200"
                    className="w-full pl-16 pr-6 py-6 text-2xl bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 transition-all duration-300 input-glow focus:border-green-400 focus:bg-white/20"
                    step="0.01"
                    min="0"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 3: New Rent */}
            {step === 3 && (
              <div style={{animation: 'fadeIn 0.6s ease-out'}}>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-600/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <DollarSign className="h-12 w-12 text-orange-300" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">What is your new rent?</h2>
                  <p className="text-blue-200">Enter your current monthly rent amount</p>
                </div>
                
                <div className="relative group">
                  <DollarSign className="absolute left-5 top-1/2 transform -translate-y-1/2 h-7 w-7 text-orange-400 z-10" />
                  <input
                    type="number"
                    value={newRent}
                    onChange={(e) => setNewRent(e.target.value)}
                    placeholder="1,300"
                    className="w-full pl-16 pr-6 py-6 text-2xl bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl text-white placeholder-blue-200 transition-all duration-300 input-glow focus:border-orange-400 focus:bg-white/20"
                    step="0.01"
                    min="0"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div style={{animation: 'fadeIn 0.6s ease-out'}}>
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 p-4 rounded-2xl w-fit mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-purple-300" />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">Ready to analyze</h2>
                  <p className="text-blue-200">Review your information before checking legality</p>
                </div>
                
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="text-blue-200 text-xl">Date</span>
                    <span className="text-white text-xl font-semibold">{new Date(rentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="text-blue-200 text-xl">Previous Rent</span>
                    <span className="text-green-400 text-2xl font-bold">${parseFloat(oldRent).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/20">
                    <span className="text-blue-200 text-xl">New Rent</span>
                    <span className="text-orange-400 text-2xl font-bold">${parseFloat(newRent).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-blue-200 text-xl">Increase Amount</span>
                    <span className="text-white text-2xl font-bold">${(parseFloat(newRent) - parseFloat(oldRent)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
              <div style={{animation: 'fadeIn 0.8s ease-out'}}>
                <div className="text-center">
                  <div className={`p-8 rounded-3xl mb-8 ${
                    result.illegal_period || result.no_cpi
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50'
                      : result.overcharged
                      ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50'
                      : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50'
                  }`}>
                    {result.illegal_period || result.no_cpi ? (
                      <>
                        <div style={{animation: 'bounce 1s ease-out'}}>
                          <AlertTriangle className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
                        </div>
                        <h3 className="text-4xl font-bold text-yellow-100 mb-4">{result.message}</h3>
                        <p className="text-yellow-200 text-xl">Please consult with a tenant rights organization for guidance</p>
                      </>
                    ) : result.overcharged ? (
                      <>
                        <div style={{animation: 'pulse 2s infinite'}}>
                          <AlertTriangle className="h-20 w-20 text-red-400 mx-auto mb-6" />
                        </div>
                        <h3 className="text-4xl font-bold text-red-100 mb-4">Illegal Rent Increase!</h3>
                        {result.overcharge_amount && (
                          <>
                            <div className="text-6xl font-black text-red-300 mb-4">
                              ${Math.abs(result.overcharge_amount).toFixed(2)}
                            </div>
                            <p className="text-red-200 text-xl">over the legal limit per month</p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{animation: 'bounce 1s ease-out'}}>
                          <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
                        </div>
                        <h3 className="text-4xl font-bold text-green-100 mb-4">Your rent increase is legal</h3>
                        <p className="text-green-200 text-xl">The increase is within CPI regulations</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-12">
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed() || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-8 rounded-2xl text-2xl uppercase tracking-wider flex items-center justify-center transition-all duration-300 button-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      ANALYZING...
                    </>
                  ) : (
                    <>
                      NEXT
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={resetCalculator}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-6 px-8 rounded-2xl text-2xl uppercase tracking-wider transition-all duration-300 button-hover shadow-xl"
                >
                  Check Another Rent
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