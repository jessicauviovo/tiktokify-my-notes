import React, { useState } from "react";
import notebookImage from "../assets/home_img.png";

export default function PageOne({ onStart }) {
  const [language, setLanguage] = useState("English"); // default language

  return (
    <div className="bg-[#FFF8D9] min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[#004E52] font-bold text-xl">
        <span className="text-4xl">∿</span>
        LOGO
      </div>

      {/* Main Content: left title + right image */}
      <div className="flex flex-1 items-center justify-center px-16 mt-32 gap-8">
        {/* Left Side: Title, language dropdown, button */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-orange-600 text-7xl md:text-8xl font-extrabold leading-[0.9] tracking-tight text-center">
            TIKTOKIFY<br />MY<br />NOTES
          </h1>

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-2 px-4 py-3 text-xl md:text-2xl font-bold text-orange-600 border-2 border-orange-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#FFF8D9]"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>

          <button
            onClick={onStart}
            className="mt-4 bg-[#0B5C66] text-white text-2xl md:text-3xl font-semibold rounded-full px-16 py-5 shadow-lg"
          >
            GET STARTED
          </button>
        </div>

        {/* Right Side: Notebook Image */}
        <img
          src={notebookImage}
          alt="Notebook"
          className="w-[35%] md:w-[40%] object-contain"
        />
      </div>
    </div>
  );
}
