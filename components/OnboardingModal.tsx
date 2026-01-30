'use client'

import { useState } from 'react'

interface OnboardingModalProps {
  onClose: () => void
}

export default function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const skipOnboarding = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-primary-light-blue rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-primary-light-mode-blue dark:border-accent-green">
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
              Welcome to Base Challenge
            </h2>
            <p className="text-primary-dark-blue dark:text-primary-white">
              Build your daily streak and earn points by showing up every day on Base
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
              Earn Points Daily
            </h2>
            <p className="text-primary-dark-blue dark:text-primary-white">
              Check in every day to maintain your streak and climb the leaderboard
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent-green to-accent-green-dark bg-clip-text text-transparent">
              Share Your Success
            </h2>
            <p className="text-primary-dark-blue dark:text-primary-white">
              Generate and share your streak images to inspire others in the community
            </p>
          </div>
        )}

        <div className="flex gap-2 justify-center mt-6 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? 'w-8 bg-accent-green' : 'w-2 bg-primary-light-mode-blue dark:bg-accent-gray'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="w-full py-3 px-6 bg-accent-green hover:bg-accent-green-dark text-primary-dark-blue rounded-xl font-semibold text-lg transition-colors min-h-[48px]"
        >
          {step === totalSteps ? 'Get Started' : 'Next'}
        </button>

        {step < totalSteps && (
          <button
            onClick={skipOnboarding}
            className="w-full mt-3 py-2 text-primary-dark-blue dark:text-accent-light-gray hover:text-primary-dark-blue dark:hover:text-primary-white transition-colors min-h-[44px]"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
