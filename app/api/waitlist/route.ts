import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('waitlist_users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Insert new user
    const { data, error } = await supabase
      .from('waitlist_users')
      .insert([
        { 
          email,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to register email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data,
      message: 'Successfully joined the waitlist!'
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Supabase count error:', countError)
      return NextResponse.json(
        { error: 'Failed to get user count' },
        { status: 500 }
      )
    }

    // Get recent signups (last 10)
    const { data: recentSignups, error: signupsError } = await supabase
      .from('waitlist_users')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    if (signupsError) {
      console.error('Supabase signups error:', signupsError)
      return NextResponse.json(
        { error: 'Failed to get recent signups' },
        { status: 500 }
      )
    }

    // Format the recent signups data
    const formattedSignups = recentSignups.map(signup => ({
      email: signup.email,
      time: formatTimeAgo(new Date(signup.created_at))
    }))

    return NextResponse.json({ 
      success: true,
      count: count || 0,
      recentSignups: formattedSignups
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return date.toLocaleDateString()
} 