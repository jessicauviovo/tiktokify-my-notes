import React from "react";
import notebookImage from "../assets/home_img.png"; // replace with your real file

export default function PageOne({ onStart }) {
  return (
    <div className="bg-[#FFF8D9] min-h-screen w-full flex flex-col items-center relative overflow-hidden">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[#004E52] font-bold text-xl">
        <span className="text-4xl">∿</span>
        LOGO
      </div>

      {/* Title */}
      <h1 className="text-orange-600 text-7xl font-extrabold text-center mt-32 leading-[0.9] tracking-tight">
        TIKTOK<br />MY<br />NOTES
      </h1>

      {/* Select Language */}
      <p className="text-orange-600 font-bold text-xl mt-6 tracking-wide">
        SELECT LANGUAGE
      </p>

      {/* Button */}
      <button
        onClick={onStart}
        className="mt-6 bg-[#0B5C66] text-white text-2xl font-semibold rounded-full px-14 py-4 shadow-lg"
      >
        GET STARTED
      </button>

      {/* Right-side notebook image */}
      <img
        src={notebookImage}
        alt="Notebook"
        className="absolute right-0 top-20 w-[40%]"
      />
    </div>
  );
}