import React from "react";
//import page2img from "../assets/page2.png";

export default function PageTwo() {
  return (
    <div className="bg-[#FF5C00] min-h-screen w-full relative px-10 py-8 overflow-hidden">

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[#004E52] font-bold text-xl">
        <span className="text-4xl">∿</span>
        LOGO
      </div>

      {/* Upload Notes */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-20 flex justify-between items-center">
        <p className="text-orange-600 font-bold uppercase tracking-wider">
          Upload Notes
        </p>
        <button className="bg-white px-6 py-3 rounded-md shadow">
          Upload File
        </button>
      </div>

      {/* Audio Output Selector */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-6">
        <p className="text-orange-600 font-bold uppercase">
          Choose Audio Output
        </p>

        <div className="mt-4 flex gap-6">
          {["Text","Text","Text","Text"].map((label, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-4 border-black flex items-center justify-center">
                👤
              </div>
              <p className="mt-1 text-black">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-6">
        <p className="text-orange-600 font-bold uppercase">
          Personalization Info
        </p>

        <input
          placeholder="Eg Make it sound stern"
          className="w-full mt-3 px-4 py-3 rounded-md bg-white border border-gray-300"
        />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mt-10">
        <button className="bg-[#0B5C66] text-white rounded-full text-2xl px-20 py-4 shadow-lg">
          GENERATE
        </button>
      </div>
    </div>
  );
}