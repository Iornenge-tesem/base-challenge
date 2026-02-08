'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-light-mode-blue dark:bg-primary-dark-blue p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary-dark-blue dark:text-primary-white mb-2">
              Something went wrong
            </h2>
            <p className="text-primary-dark-blue dark:text-accent-light-gray mb-4">
              Please refresh the page and try again
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent-green text-primary-dark-blue rounded-lg font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
