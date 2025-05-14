import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tyt: "bg-[hsl(var(--tyt-theme))] text-primary-foreground hover:bg-[hsl(var(--tyt-theme)_/_0.9)]",
        ayt: "bg-[hsl(var(--ayt-theme))] text-primary-foreground hover:bg-[hsl(var(--ayt-theme)_/_0.9)]",
        particle: "particle-button relative overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const ParticleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "particle", size, asChild = false, onClick, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const [particles, setParticles] = React.useState<React.ReactNode[]>([])
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const particles = []
      for (let i = 0; i < 10; i++) {
        const size = Math.random() * 10 + 5
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 50 + 30
        const color = `hsl(${Math.random() * 360}, 70%, 70%)`
        
        particles.push(
          <span
            key={`${i}-${Date.now()}`}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}px`,
              top: `${y}px`,
              backgroundColor: color,
              transform: `translate(-50%, -50%)`,
              animationDuration: `${Math.random() * 0.6 + 0.4}s`,
            }}
          />
        )
      }
      
      setParticles(particles)
      
      if (onClick) {
        onClick(e)
      }
      
      // Clear particles after animation
      setTimeout(() => {
        setParticles([])
      }, 1000)
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
        <div className="particles">{particles}</div>
      </Comp>
    )
  }
)
ParticleButton.displayName = "ParticleButton"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If variant is particle, use the ParticleButton
    if (variant === "particle") {
      return <ParticleButton className={className} size={size} asChild={asChild} {...props} ref={ref} />
    }
    
    // Otherwise, use the regular button
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants, ParticleButton }
