import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-slate-900">
            SkillTree 🌳
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Discover Your Skills. Find Your Career Path.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Discover Skills</h3>
            <p className="text-slate-600">
              Identify your capabilities through guided assessment and behavioral anchors
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Find Careers</h3>
            <p className="text-slate-600">
              Match with 70+ careers based on your personality and skills
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Track Growth</h3>
            <p className="text-slate-600">
              See what skills to learn next for your dream career
            </p>
          </div>
        </div>

        {/* Build in Public */}
        <div className="text-center mt-16 text-slate-600">
          <p>Built in public. Follow the journey on Twitter.</p>
          <p className="text-sm mt-2">
            Phase 0: Foundation Setup - In Progress ✨
          </p>
        </div>
      </div>
    </main>
  )
}
