import React from "react";

const AboutUs = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center text-white flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('https://wallpaperaccess.com/full/1843880.jpg')`,
      }}
    >
      <div className="bg-black bg-opacity-50 p-10 rounded-xl max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to CookHub</h1>
        <p className="text-lg">
          Welcome to CookHub — Visit out  platform for sharing recipes, exploring
          cooking tips, and engaging with a food-loving community. Whether you're
          a beginner or a seasoned chef, we've built a space to make your culinary
          journey more enjoyable.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
