'use client'

import { useState } from 'react'

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (message?: string) => void
    onFailure?: (error: string) => void
    userEmail?: string
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    prefill: {
        email?: string
    }
    theme: {
        color: string
    }
    modal?: {
        ondismiss?: () => void
    }
}

interface RazorpayInstance {
    open: () => void
    close: () => void
}

interface RazorpayResponse {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

const PLANS = [
    {
        id: 'monthly',
        name: 'Monthly',
        price: 399,
        period: '/month',
        features: [
            'Unlimited transactions',
            'AI-powered transaction entry',
            'Invoice generation',
            'Financial reports',
            'Priority support'
        ],
        popular: false
    },
    {
        id: 'yearly',
        name: 'Yearly',
        price: 1999,
        originalPrice: 4788,
        period: '/year',
        savings: 'Save ₹2,789',
        features: [
            'Everything in Monthly',
            'Priority support',
            'Early access to features',
            'Dedicated support'
        ],
        popular: true
    }
]

export default function PricingModal({ isOpen, onClose, onSuccess, onFailure, userEmail }: PricingModalProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle')
    const [transactionDetails, setTransactionDetails] = useState<{
        planName: string
        amount: number
        paymentId?: string
    } | null>(null)

    if (!isOpen) return null

    const handleClose = () => {
        // Reset states when closing
        setPaymentStatus('idle')
        setError(null)
        setTransactionDetails(null)
        onClose()
    }

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                resolve(true)
                return
            }

            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment = async (planType: string) => {
        setIsLoading(true)
        setError(null)
        setPaymentStatus('idle')
        setSelectedPlan(planType)

        const plan = PLANS.find(p => p.id === planType)

        try {
            // Load Razorpay script
            const loaded = await loadRazorpayScript()
            if (!loaded) {
                setError('Failed to load payment gateway. Please try again.')
                setPaymentStatus('failed')
                setIsLoading(false)
                return
            }

            // Create order
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType })
            })

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json().catch(() => ({}))
                const errorMsg = errorData.error || errorData.details || 'Failed to create order'
                console.error('Order creation failed:', errorData)
                throw new Error(errorMsg)
            }

            const orderData = await orderResponse.json()

            // Open Razorpay checkout
            const options: RazorpayOptions = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Account AI',
                description: orderData.planDescription,
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/razorpay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan_type: planType
                            })
                        })

                        if (verifyResponse.ok) {
                            // Payment successful
                            setPaymentStatus('success')
                            setTransactionDetails({
                                planName: plan?.name || planType,
                                amount: plan?.price || orderData.amount / 100,
                                paymentId: response.razorpay_payment_id
                            })
                            onSuccess(`🎉 Payment successful! You're now a Premium member.`)
                        } else {
                            const verifyError = await verifyResponse.json().catch(() => ({}))
                            const errorMsg = verifyError.error || 'Payment verification failed. Please contact support.'
                            setError(errorMsg)
                            setPaymentStatus('failed')
                            onFailure?.(errorMsg)
                        }
                    } catch (verifyErr) {
                        console.error('Verification error:', verifyErr)
                        const errorMsg = 'Payment verification failed. Please contact support.'
                        setError(errorMsg)
                        setPaymentStatus('failed')
                        onFailure?.(errorMsg)
                    }
                    setIsLoading(false)
                },
                prefill: {
                    email: userEmail
                },
                theme: {
                    color: '#3B82F6'
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false)
                        // User dismissed the payment modal
                        if (paymentStatus === 'idle') {
                            setError('Payment was cancelled.')
                            setPaymentStatus('failed')
                        }
                    }
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (err) {
            console.error('Payment error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.'
            setError(errorMessage)
            setPaymentStatus('failed')
            onFailure?.(errorMessage)
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Success View */}
                {paymentStatus === 'success' && transactionDetails && (
                    <>
                        <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-8 text-center">
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
                            <p className="text-white/80">Welcome to Premium!</p>
                        </div>
                        <div className="p-8">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-green-500/10 pb-3">
                                        <span className="text-foreground/60">Plan</span>
                                        <span className="font-semibold text-foreground">{transactionDetails.planName}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-green-500/10 pb-3">
                                        <span className="text-foreground/60">Amount Paid</span>
                                        <span className="font-semibold text-green-600">₹{transactionDetails.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                    {transactionDetails.paymentId && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-foreground/60">Transaction ID</span>
                                            <span className="font-mono text-sm text-foreground/80">{transactionDetails.paymentId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center space-y-3">
                                <p className="text-foreground/70 text-sm">
                                    You now have unlimited access to all premium features!
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all"
                                >
                                    Start Using Premium
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Failure View */}
                {paymentStatus === 'failed' && (
                    <>
                        <div className="relative bg-gradient-to-r from-red-500 to-rose-500 px-8 py-8 text-center">
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                            <p className="text-white/80">Don&apos;t worry, you can try again</p>
                        </div>
                        <div className="p-8">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-red-600 mb-1">Error Details</h4>
                                        <p className="text-red-500/80 text-sm">{error || 'An unexpected error occurred during payment processing.'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setPaymentStatus('idle')
                                        setError(null)
                                    }}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Try Again
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 rounded-xl border-2 border-border text-foreground/70 font-semibold hover:bg-secondary transition-all"
                                >
                                    Close
                                </button>
                                <p className="text-center text-sm text-foreground/50">
                                    Need help? Contact support at support@accountai.com
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Normal Pricing View */}
                {paymentStatus === 'idle' && (
                    <>
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-8 text-center">
                            <button
                                onClick={handleClose}
                                className="absolute right-4 top-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h2>
                            <p className="text-white/80">Unlock unlimited transactions and premium features</p>
                        </div>

                        {/* Plans */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {PLANS.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`relative rounded-2xl border-2 p-6 transition-all ${plan.popular
                                            ? 'border-amber-500 bg-gradient-to-b from-amber-500/5 to-transparent'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold rounded-full">
                                                BEST VALUE
                                            </div>
                                        )}
                                        <div className="text-center mb-6">
                                            <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                                            <div className="flex items-baseline justify-center gap-1">
                                                <span className="text-4xl font-bold text-foreground">₹{plan.price}</span>
                                                <span className="text-foreground/50">{plan.period}</span>
                                            </div>
                                            {plan.originalPrice && (
                                                <div className="mt-1">
                                                    <span className="text-sm text-foreground/50 line-through">₹{plan.originalPrice}</span>
                                                    <span className="ml-2 text-sm font-medium text-green-500">{plan.savings}</span>
                                                </div>
                                            )}
                                        </div>
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handlePayment(plan.id)}
                                            disabled={isLoading}
                                            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${plan.popular
                                                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90'
                                                : 'bg-secondary text-foreground hover:bg-secondary/80'
                                                } disabled:opacity-50`}
                                        >
                                            {isLoading && selectedPlan === plan.id ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>Get {plan.name}</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <p className="text-center text-sm text-foreground/50 mt-6">
                                Secure payment powered by Razorpay. Cancel anytime.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
