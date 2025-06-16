'use client'

import { FiInstagram } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { FiArrowRight, FiCheck, FiTrendingUp, FiUsers, FiAward, FiZap } from 'react-icons/fi'
import dynamic from 'next/dynamic'

// Dynamically import the AnimatedParticles component with no SSR
const AnimatedParticles = dynamic(
  () => import('./components/AnimatedParticles'),
  { ssr: false }
)

// Target date for launch (June 20, 2025)
const targetDate = new Date('2025-06-20T00:00:00')

// Target users for launch
const TARGET_USERS = 500

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [currentUsers, setCurrentUsers] = useState(0)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recentSignups, setRecentSignups] = useState<Array<{ email: string; time: string }>>([])

  // Fetch current user count and recent signups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/waitlist')
        const data = await response.json()
        if (data.success) {
          setCurrentUsers(data.count)
          if (data.recentSignups) {
            setRecentSignups(data.recentSignups)
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully joined the waitlist!')
        setEmail('')
        // Update user count
        setCurrentUsers(prev => prev + 1)
      } else {
        toast.error(data.error || 'Failed to join waitlist')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (currentUsers / TARGET_USERS) * 100
  const usersNeeded = TARGET_USERS - currentUsers

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Add the AnimatedParticles component */}
        <AnimatedParticles />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Logo and Brand */}
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-primary tracking-wider">
                LIFT<span className="text-accent">DRILL</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mt-2 rounded-full" />
            </motion.div>

            {/* Live Launch Status */}
            <motion.div 
              variants={fadeInUp}
              className="max-w-2xl mx-auto p-6 bg-blue-gray/50 backdrop-blur-sm rounded-xl border border-blue-black shadow-lg shadow-primary/10"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <FiZap className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-primary font-semibold">Live Launch Status</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-gray/50 rounded-lg border border-blue-black">
                  <div className="text-3xl font-bold text-primary mb-1">{currentUsers}</div>
                  <div className="text-light-gray text-sm">Current Signups</div>
                </div>
                <div className="text-center p-4 bg-blue-gray/50 rounded-lg border border-blue-black">
                  <div className="text-3xl font-bold text-accent mb-1">{usersNeeded}</div>
                  <div className="text-light-gray text-sm">Users Needed to Launch</div>
                </div>
              </div>
            </motion.div>

            {/* Launch Badge with Live Counter */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm shadow-lg shadow-primary/10 group hover:bg-primary/20 transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-primary font-medium group-hover:scale-105 transition-transform">
                {currentUsers >= TARGET_USERS ? 'Launching Now!' : `${usersNeeded} More to Launch!`}
              </span>
            </motion.div>

            {/* Main Title with 3D Effect */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight relative"
            >
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Where Fitness Meets Fortune
              </motion.span>
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl -z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.h1>

            {/* Subtitle with Typing Effect */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-light-gray max-w-2xl mx-auto leading-relaxed"
            >
              The first-ever platform where your gains translate to real rewards. 
              <motion.span 
                className="font-semibold text-primary inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {" "}Compete. Win. Get Paid.{" "}
              </motion.span>
              Join the revolution in fitness gaming! 💪
            </motion.p>

            {/* Features Grid with Hover Effects */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
            >
              {[
                {
                  icon: "🏆",
                  title: "Daily Challenges",
                  description: "Compete in daily fitness challenges with real cash prizes",
                  gradient: "from-primary/20 to-accent/20"
                },
                {
                  icon: "💰",
                  title: "Instant Payouts",
                  description: "Get paid instantly when you win challenges",
                  gradient: "from-accent/20 to-primary/20"
                },
                {
                  icon: "🎮",
                  title: "Gamified Fitness",
                  description: "Level up your fitness journey with exciting game mechanics",
                  gradient: "from-primary/20 to-accent/20"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group p-6 bg-blue-gray backdrop-blur-sm rounded-xl border border-blue-black shadow-lg shadow-primary/10 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: "rgba(26, 31, 46, 0.9)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <motion.div 
                      className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-light-gray group-hover:text-white transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Countdown Timer with Glow Effect */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mt-12"
            >
              {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div
                  key={unit}
                  className="flex flex-col items-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-blue-gray backdrop-blur-sm rounded-2xl border border-blue-black shadow-lg shadow-primary/10 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-300">
                      <span className="text-3xl md:text-4xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                        {value}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-sm font-medium text-light-gray capitalize group-hover:text-primary transition-colors duration-300">
                    {unit}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Live Progress Bar */}
            <motion.div 
              variants={fadeInUp}
              className="max-w-md mx-auto mt-8 space-y-4"
            >
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-light-gray">
                  {currentUsers >= TARGET_USERS ? 'Launch Ready! 🚀' : 'Join the Launch Crew'}
                </span>
                <motion.span 
                  className="text-primary font-semibold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
              <div className="h-3 bg-blue-gray rounded-full overflow-hidden shadow-inner shadow-black/20 relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 0%'],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent relative z-10"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-light-gray text-center">
                {currentUsers >= TARGET_USERS ? (
                  '🎉 We\'ve reached our target! Launching soon!'
                ) : (
                  `Only ${usersNeeded} more signups needed to launch! 🎯`
                )}
              </p>
            </motion.div>

            {/* Waitlist Form */}
            <motion.form 
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto mt-8 space-y-4"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to join"
                  className="w-full px-6 py-4 rounded-xl bg-blue-gray backdrop-blur-sm border border-blue-black shadow-lg shadow-primary/10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-white placeholder-light-gray"
                  required
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium shadow-lg shadow-primary/20 hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Join Now <FiArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>
              </div>
              <p className="text-sm text-light-gray text-center">
                🔒 Join the waitlist. No credit card required.
              </p>
            </motion.form>

            {/* Launch Benefits */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                { 
                  icon: "💪", 
                  text: `${currentUsers}+ Active Athletes`, 
                  color: "from-primary/20 to-accent/20",
                  highlight: currentUsers
                },
                { 
                  icon: "🏅", 
                  text: "Daily Cash Prizes", 
                  color: "from-accent/20 to-primary/20",
                  highlight: "Ready"
                },
                { 
                  icon: "🎯", 
                  text: "Real-time Leaderboards", 
                  color: "from-primary/20 to-accent/20",
                  highlight: "Live"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group flex items-center gap-3 p-4 bg-blue-gray backdrop-blur-sm rounded-xl border border-blue-black shadow-lg shadow-primary/10 relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: "rgba(26, 31, 46, 0.9)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  <motion.span 
                    className="text-2xl relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 10 }}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="relative z-10">
                    <span className="text-light-gray font-medium group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                    {item.highlight && (
                      <span className="block text-xs text-primary mt-1">
                        {typeof item.highlight === 'number' ? `${item.highlight}+` : item.highlight}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links with Enhanced Hover Effects */}
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center gap-6 mt-12"
            >
              {[
                { icon: FiInstagram, href: "https://instagram.com/liftdrill", rotate: 5 },
               
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-blue-gray backdrop-blur-sm border border-blue-black shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-200 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: social.rotate }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <social.icon className="w-6 h-6 text-primary relative z-10 group-hover:text-accent transition-colors duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer with Gradient Border */}
      <footer className="relative py-8 px-4 text-center text-light-gray text-sm">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <p>© 2024 LiftDrill. The future of fitness gaming.</p>
      </footer>
    </main>
  )
} 
