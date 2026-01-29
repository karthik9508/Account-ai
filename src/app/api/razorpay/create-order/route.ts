import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

// Pricing plans in paise (1 INR = 100 paise)
const PLANS = {
    monthly: {
        amount: 39900, // ₹399
        name: 'Premium Monthly',
        description: 'Premium subscription - Monthly',
        duration_months: 1
    },
    yearly: {
        amount: 199900, // ₹1999
        name: 'Premium Yearly',
        description: 'Premium subscription - Yearly (Save ₹2,789)',
        duration_months: 12
    }
}

export async function POST(request: NextRequest) {
    try {
        // Initialize Razorpay inside handler to avoid build-time errors
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || ''
        })

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 })
        }

        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { planType } = await request.json()

        if (!planType || !PLANS[planType as keyof typeof PLANS]) {
            return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
        }

        const plan = PLANS[planType as keyof typeof PLANS]

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: plan.amount,
            currency: 'INR',
            receipt: `prem_${user.id.slice(-8)}_${Date.now().toString(36)}`,
            notes: {
                user_id: user.id,
                user_email: user.email || '',
                plan_type: planType,
                duration_months: plan.duration_months.toString()
            }
        })

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            planName: plan.name,
            planDescription: plan.description
        })
    } catch (error) {
        console.error('Razorpay order creation error:', error)

        // Extract error details for debugging
        let errorMessage = 'Failed to create order'
        let errorDetails = ''

        if (error instanceof Error) {
            errorMessage = error.message
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }

        // Check if it's a Razorpay API error with more details
        if (typeof error === 'object' && error !== null) {
            const errObj = error as Record<string, unknown>
            if ('error' in errObj && typeof errObj.error === 'object' && errObj.error !== null) {
                const razorpayError = errObj.error as Record<string, unknown>
                errorDetails = razorpayError.description as string || ''
                console.error('Razorpay API error:', razorpayError)
            }
            if ('statusCode' in errObj) {
                console.error('Razorpay API status code:', errObj.statusCode)
            }
        }

        return NextResponse.json({
            error: errorMessage,
            details: errorDetails,
            debug: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 })
    }
}
