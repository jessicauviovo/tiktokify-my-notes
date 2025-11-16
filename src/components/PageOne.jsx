import React, { useState } from "react";
import notebookImage from "../assets/home_img.png";

import element2 from "../assets/element2.png";

export default function PageOne({ onStart, language, setLanguage }) {
  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.play();
  };

  return (
    <div className="bg-[#FFF8D9] min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Main Content: left title + right image */}
      <div className="flex flex-1 items-center justify-center px-16 mt-16 gap-8">
        {/* Left Side: Title, language dropdown, button */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-[#fe5900] text-7xl md:text-8xl font-extrabold leading-[0.9] tracking-wide text-center">
            TIKTOKIFY<br />MY<br />NOTES
          </h1>

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 px-6 py-2 text-base md:text-lg font-arial font-bold text-[#555555] border-2 border-[#555555] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#555555] bg-[#FFF8D9]"
          >
            <option value="English">English</option>
            <option value="Chinese">Chinese</option>
            <option value="French">French</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
          </select>

          <button
            onClick={() => { playClickSound(); onStart(); }}
            className="mt-4 bg-[#0B5C66] hover:bg-[#094952] text-white text-2xl md:text-3xl font-quicksand font-bold rounded-full px-16 py-5 shadow-lg hover:scale-105 transition-all duration-300"
          >
            GET STARTED
          </button>
        </div>

        {/* Right Side: Home Image */}
        <img
          src={notebookImage}
          alt="Notebook"
          className="w-[35%] md:w-[45%] object-contain rotate-[12deg]"
        />
      </div>

      {/* Top right element */}
      <img
        src={element2}
        alt="Element 2"
        className="absolute top-14 right-14 w-60 h-60 object-contain"
      />


    </div>
  );
}
