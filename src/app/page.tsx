import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Account AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute top-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-sm text-secondary-foreground mb-8 border border-border">
                <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                AI Accounting App - Smart AI Based Accounting
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Record Expenses with
                <span className="block text-primary">
                  Natural Language
                </span>
              </h1>

              <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed">
                Simply type <span className="font-semibold text-foreground">"Paid ₹5000 for office rent"</span> and let AI
                automatically categorize, organize, and track your transactions. No more manual bookkeeping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-xl shadow-primary/30"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-xl shadow-primary/30"
                    >
                      Start Free Trial →
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-4 rounded-xl bg-card border-2 border-border text-foreground font-semibold text-lg hover:border-primary hover:bg-secondary transition-all"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badge */}
              <p className="mt-6 text-sm text-foreground/60">
                ✓ No credit card required &nbsp; ✓ Free forever for individuals
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete AI Accounting Features
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Powerful AI based accounting features designed for small businesses and freelancers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Accounting Entry</h3>
                <p className="text-foreground/70">
                  Just type naturally. Our AI understands context, extracts amounts, dates, and categories automatically.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Smart Reports</h3>
                <p className="text-foreground/70">
                  Get instant Profit & Loss statements, Cash Flow analysis, and category breakdowns at a glance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <span className="text-2xl">💱</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Multi-Currency</h3>
                <p className="text-foreground/70">
                  Support for 11+ currencies. Switch between INR, USD, EUR, GBP and more with a single click.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Works Everywhere</h3>
                <p className="text-foreground/70">
                  Access your accounts from any device. Desktop, tablet, or mobile - your data syncs instantly.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Bank-Level Security</h3>
                <p className="text-foreground/70">
                  Your data is encrypted and secure. We never share your financial information with anyone.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                  <span className="text-2xl">📤</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Export Anytime</h3>
                <p className="text-foreground/70">
                  Download your transactions as CSV. Import into Excel, Tally, or share with your accountant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How it works
              </h2>
              <p className="text-lg text-foreground/70">
                Three simple steps to financial clarity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Type Naturally</h3>
                <p className="text-foreground/70">
                  "Received ₹50,000 from client for website project"
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Categorizes</h3>
                <p className="text-foreground/70">
                  Automatically tagged as Income, amount ₹50,000, party: client
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Track & Report</h3>
                <p className="text-foreground/70">
                  View summaries, generate reports, export data anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Have questions? We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as we can.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Email Card */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Email Us</h3>
                <p className="text-foreground/70 mb-4">We&apos;ll respond within 24 hours</p>
                <a href="mailto:support@accountai.tech" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  info@accountai.tech
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Call Us</h3>
                <p className="text-foreground/70 mb-4">Mon-Fri from 9am to 6pm</p>
                <a href="tel:+918695018620" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  +91 8695018620
                </a>
              </div>

              {/* Location Card */}
              <div className="bg-card rounded-2xl border border-border p-8 text-center hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Visit Us</h3>
                <p className="text-foreground/70 mb-4">Come say hello</p>
                <p className="text-primary font-semibold">
                  Tirupur, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center">
              <p className="text-foreground/70 mb-6">Follow us on social media</p>
              <div className="flex justify-center gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary hover:bg-secondary transition-all group">
                  <svg className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary hover:bg-secondary transition-all group">
                  <svg className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary hover:bg-secondary transition-all group">
                  <svg className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-primary hover:bg-secondary transition-all group">
                  <svg className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to simplify your accounting?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Join thousands of businesses using AI to manage their finances effortlessly.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 rounded-xl bg-card text-foreground font-bold text-lg hover:bg-secondary transition-all transform hover:scale-105 shadow-2xl"
            >
              Get Started Free →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-foreground">Account AI</span>
              </div>
              <p className="text-foreground/70 mb-6 max-w-md">
                AI-powered accounting that understands natural language. Record expenses, track income, and generate reports effortlessly.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-foreground/60">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-foreground/60">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-foreground/60">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-primary transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Contact</h4>
              <ul className="space-y-3">
                {/* TODO: Replace with your actual contact details */}
                <li className="flex items-center gap-2 text-foreground/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@accountai.tech" className="hover:text-primary transition-colors">info@accountai.tech</a>
                </li>
                <li className="flex items-center gap-2 text-foreground/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+918695018620" className="hover:text-primary transition-colors">+91 8695018620</a>
                </li>
                <li className="flex items-start gap-2 text-foreground/70">
                  <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Tirupur, Tamil Nadu, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-foreground/50 text-sm">
                © 2024 Account AI - AI Accounting App. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="text-foreground/50 hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Widget */}
      <a
        href="https://wa.me/918695018620?text=Hi%2C%20I%27m%20interested%20in%20Account%20AI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Tooltip */}
        <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  )
}
