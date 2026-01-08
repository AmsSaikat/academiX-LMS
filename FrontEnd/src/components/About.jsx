import React from "react";

const About = () => {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          A Modern Learning Platform Built to Scale
        </h2>

        <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-3xl">
          This Learning Management System is designed for educators, startups,
          and organizations that want to deliver professional online courses
          with full control, performance, and future growth in mind.
        </p>

        {/* Value Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Built for Creators
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Instructors can create courses, upload structured video lectures,
              manage content visibility, and publish with confidence using a
              dedicated creator dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Designed for Learners
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Students enjoy a clean learning experience with organized
              lectures, preview access, and smooth video playback — optimized
              for focus and retention.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Ready for Growth
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Built on a scalable MERN architecture with cloud media storage,
              this LMS is ready for monetization, analytics, AI tools, and
              enterprise expansion.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              What Makes Us Different?
            </h3>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li>• Role-based access for admins, instructors, and students</li>
              <li>• Secure video lecture management with preview control</li>
              <li>• Clean dashboards for course creation and management</li>
              <li>• RESTful backend with scalable database design</li>
              <li>• Built for customization and future feature upgrades</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ideal For
            </h3>
            <ul className="space-y-3 text-gray-700 text-lg">
              <li>• Online course creators & educators</li>
              <li>• Coaching and training platforms</li>
              <li>• EdTech startups and MVP launches</li>
              <li>• Corporate training systems</li>
              <li>• Custom learning platforms</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 text-white rounded-3xl p-10 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Turn Knowledge into a Scalable Learning Business
          </h3>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            Whether you are launching your first course or building a full
            learning ecosystem, this LMS provides the foundation you need to
            grow, customize, and succeed.
          </p>

          <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
