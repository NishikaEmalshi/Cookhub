import React, { useState } from "react";
import aboutImage from "../../assets/img.jpg";

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
      {/* Left Content */}
      <div className="w-full md:w-1/2 bg-[#1e1b18] text-white flex flex-col justify-center px-8 md:px-16 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm uppercase tracking-widest text-yellow-500 mb-2">
            About Us
          </h2>
          <h1 className="text-5xl font-bold font-serif mb-6 text-white">SpiceUp</h1>

          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="bg-transparent border border-white px-6 py-2 rounded-md text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Read More
            </button>
          )}

          {showMore && (
            <div className="space-y-5 text-lg leading-relaxed text-gray-300 transition-all duration-500 mt-4">
              <p>
                SpiceUp is a skill-sharing web app made specially for people who love cooking and want to grow together as a community.
              </p>
              <p>
                👉 <strong>To bring cooking lovers together</strong> — to learn, teach, and share.
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Post your cooking journey, tips, and favorite recipes.</li>
                <li>Watch and try ideas shared by others.</li>
                <li>Ask questions and get community help.</li>
                <li>Connect with home cooks and foodies.</li>
              </ul>
              <p>
                🌍 <strong>Our Mission</strong>: To make cooking a shared joy — about learning, helping, and inspiring one another.
              </p>
              <p>💬 Join us and let's Spice Up your skills! 🌶️</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full">
        <img
          src={aboutImage}
          alt="Cooking"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default AboutUs;
