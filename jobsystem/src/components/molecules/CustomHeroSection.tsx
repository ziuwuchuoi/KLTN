import React from "react";

const CustomHeroSection = ({
  title = "Quantum Leap",
  subtitle = "Assessment Center",
  description = "Evaluate your skills, personality, and professional aptitude with our comprehensive quiz collection"
}) => {
  return (
    <div className="pt-20 pb-8 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400">
            {title}
          </span>{" "}
          {subtitle}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CustomHeroSection;