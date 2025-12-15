const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 bg-blue-600 animate-spin-fill"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
