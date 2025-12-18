import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-black">
                Account AI
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-600 hover:text-black transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25"
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
              <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-sm text-blue-700 mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                AI-Powered Accounting for Everyone
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
                Record Expenses with
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                  Natural Language
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                Simply type <span className="font-semibold text-black">"Paid ₹5000 for office rent"</span> and let AI
                automatically categorize, organize, and track your transactions. No more manual bookkeeping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/30"
                  >
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/30"
                    >
                      Start Free Trial →
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-4 rounded-xl bg-white border-2 border-gray-200 text-black font-semibold text-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badge */}
              <p className="mt-6 text-sm text-gray-500">
                ✓ No credit card required &nbsp; ✓ Free forever for individuals
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Everything you need to manage finances
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed for small businesses and freelancers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">AI-Powered Entry</h3>
                <p className="text-gray-600">
                  Just type naturally. Our AI understands context, extracts amounts, dates, and categories automatically.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Smart Reports</h3>
                <p className="text-gray-600">
                  Get instant Profit & Loss statements, Cash Flow analysis, and category breakdowns at a glance.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                  <span className="text-2xl">💱</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Multi-Currency</h3>
                <p className="text-gray-600">
                  Support for 11+ currencies. Switch between INR, USD, EUR, GBP and more with a single click.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Works Everywhere</h3>
                <p className="text-gray-600">
                  Access your accounts from any device. Desktop, tablet, or mobile - your data syncs instantly.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/30">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Bank-Level Security</h3>
                <p className="text-gray-600">
                  Your data is encrypted and secure. We never share your financial information with anyone.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                  <span className="text-2xl">📤</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Export Anytime</h3>
                <p className="text-gray-600">
                  Download your transactions as CSV. Import into Excel, Tally, or share with your accountant.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                How it works
              </h2>
              <p className="text-lg text-gray-600">
                Three simple steps to financial clarity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">
                  1
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Type Naturally</h3>
                <p className="text-gray-600">
                  "Received ₹50,000 from client for website project"
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">
                  2
                </div>
                <h3 className="text-xl font-bold text-black mb-3">AI Categorizes</h3>
                <p className="text-gray-600">
                  Automatically tagged as Income, amount ₹50,000, party: client
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-600">
                  3
                </div>
                <h3 className="text-xl font-bold text-black mb-3">Track & Report</h3>
                <p className="text-gray-600">
                  View summaries, generate reports, export data anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions? We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as we can.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Email Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">We&apos;ll respond within 24 hours</p>
                {/* TODO: Replace with your email */}
                <a href="mailto:support@accountai.tech" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  support@accountai.tech
                </a>
              </div>

              {/* Phone Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:border-green-300 hover:shadow-xl hover:shadow-green-100/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Mon-Fri from 9am to 6pm</p>
                {/* TODO: Replace with your phone number */}
                <a href="tel:+919876543210" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  +91 98765 43210
                </a>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Come say hello</p>
                {/* TODO: Replace with your address */}
                <p className="text-purple-600 font-semibold">
                  Chennai, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center">
              <p className="text-gray-600 mb-6">Follow us on social media</p>
              <div className="flex justify-center gap-4">
                {/* TODO: Replace # with your social media links */}
                <a href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-blue-700 hover:bg-blue-50 transition-all group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-pink-400 hover:bg-pink-50 transition-all group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-red-400 hover:bg-red-50 transition-all group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to simplify your accounting?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of businesses using AI to manage their finances effortlessly.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl"
            >
              Get Started Free →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-xl font-bold text-black">Account AI</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                AI-powered accounting that understands natural language. Record expenses, track income, and generate reports effortlessly.
              </p>
              <div className="flex gap-3">
                {/* TODO: Replace # with your social media links */}
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-blue-100 hover:text-blue-700 transition-colors text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-black mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-black mb-4">Contact</h4>
              <ul className="space-y-3">
                {/* TODO: Replace with your actual contact details */}
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@accountai.tech" className="hover:text-blue-600 transition-colors">info@accountai.tech</a>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+918695018620" className="hover:text-blue-600 transition-colors">+91 8695018620</a>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
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
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2024 Account AI. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
