import * as React from "react"

export interface SliderProps {
  className?: string
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, max = 100, min = 0, step = 1, disabled = false, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseInt(e.target.value)]
      onValueChange?.(newValue)
    }

    return (
      <input
        type="range"
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className || ''}`}
        ref={ref}
        value={value?.[0] || 0}
        onChange={handleChange}
        max={max}
        min={min}
        step={step}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
