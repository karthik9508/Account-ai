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
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-black">Account AI</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Account AI. Built with ❤️ using Next.js & Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
