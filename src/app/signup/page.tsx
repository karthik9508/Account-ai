import Link from 'next/link'
import { signup, signInWithGoogle } from '@/app/actions/auth'

export default async function SignupPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; message?: string }>
}) {
    const params = await searchParams
    const error = params.error
    const message = params.message

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                            <span className="text-primary-foreground font-bold text-2xl">A</span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                        <p className="text-foreground/60">Get started for free</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50/10 border border-red-500/20">
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 rounded-lg bg-green-50/10 border border-green-500/20">
                            <p className="text-green-500 text-sm text-center">{message}</p>
                        </div>
                    )}

                    {/* Google Sign Up */}
                    <form className="mb-6">
                        <button
                            formAction={signInWithGoogle}
                            className="w-full py-3 px-4 rounded-lg bg-card border-2 border-border text-foreground font-semibold hover:bg-secondary hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-foreground/50">or sign up with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-lg bg-input/50 border border-border text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            <p className="mt-1 text-xs text-foreground/50">Minimum 6 characters</p>
                        </div>

                        <button
                            formAction={signup}
                            className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-foreground/50">Already have an account?</span>
                        </div>
                    </div>

                    {/* Sign In Link */}
                    <Link
                        href="/login"
                        className="block w-full py-3 px-4 rounded-lg border-2 border-border text-foreground font-semibold text-center hover:border-primary/50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-foreground/50 hover:text-primary transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
