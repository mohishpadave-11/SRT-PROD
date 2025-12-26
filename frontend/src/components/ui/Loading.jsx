import { Loader } from 'lucide-react'

const Loading = ({ 
  size = 'md',           // 'sm', 'md', 'lg'
  variant = 'page',      // 'page', 'inline', 'button'
  text = null,           // Optional loading text
  className = ''         // Additional classes
}) => {
  // Size variants
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }
  
  // Layout variants
  const variants = {
    page: 'flex justify-center items-center h-screen',
    inline: 'flex justify-center py-12',
    button: 'flex items-center gap-2'
  }
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className={variant === 'button' ? 'flex items-center gap-2' : 'text-center'}>
        <Loader className={`${sizes[size]} animate-spin text-blue-600`} />
        {text && <span className="text-gray-600">{text}</span>}
      </div>
    </div>
  )
}

export default Loading