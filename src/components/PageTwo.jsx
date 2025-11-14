import React, { useRef, useState } from "react";
import style1 from "../assets/style1.jpg";
import style2 from "../assets/style2.jpg";
import style3 from "../assets/style3.jpg";
import style4 from "../assets/style4.jpg";

export default function PageTwo() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerate = () => {
    // Clear previous error
    setError("");

    if (!fileName && !selectedStyle) {
      setError("Please upload a file and select a TikTok style");
      return;
    }
    if (!fileName) {
      setError("Please upload a file");
      return;
    }
    if (!selectedStyle) {
      setError("Please select a TikTok style");
      return;
    }

    // All required fields provided, proceed
    console.log("File:", fileName);
    console.log("Selected style:", selectedStyle);
    setError(""); // clear any previous errors
    alert("Generation started!"); // replace with real action
  };

  const styles = [
    { id: 1, label: "Style 1", image: style1 },
    { id: 2, label: "Style 2", image: style2 },
    { id: 3, label: "Style 3", image: style3 },
    { id: 4, label: "Style 4", image: style4 },
  ];

  return (
    <div className="bg-[#FF5C00] min-h-screen w-full relative px-10 py-8 overflow-hidden">

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-[#004E52] font-bold text-xl">
        <span className="text-4xl">∿</span>
        TIKTOK MY NOTES 
      </div>

      {/* Upload Notes */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-20 flex justify-between items-center max-w-2xl mx-auto">
        <p className="text-orange-600 font-bold uppercase">
          Upload Notes
        </p>
        <div className="flex items-center gap-4">
          <button
            className="bg-white px-6 py-3 rounded-md shadow"
            onClick={() => fileInputRef.current.click()}
          >
            Choose File
          </button>
          {fileName && <span className="text-black font-medium">{fileName}</span>}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Choose TikTok Style */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-6 max-w-2xl mx-auto">
        <p className="text-orange-600 font-bold uppercase text-left">
          Choose TikTok Style
        </p>

        <div className="mt-4 flex gap-6 justify-center flex-wrap">
          {styles.map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`cursor-pointer flex flex-col items-center p-2 rounded-xl border-4 transition-all duration-200 ${
                selectedStyle === style.id
                  ? "border-[#0B5C66] bg-[#FFEDCC]"
                  : "border-transparent"
              }`}
            >
              <img
                src={style.image}
                alt={style.label}
                className="w-20 h-20 object-cover rounded-md transition-transform duration-200 hover:scale-110"
              />
              <p className="mt-2 text-black font-medium">{style.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization */}
      <div className="bg-[#FFF8D9] rounded-2xl p-6 mt-6 max-w-2xl mx-auto">
        <p className="text-orange-600 font-bold uppercase">
          Any Extra Details?
        </p>

        <input
          placeholder="Eg Make it sound stern"
          className="w-full mt-3 px-4 py-3 rounded-md bg-white border border-gray-300"
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="font-bold mt-4 text-center" style={{ color: "#fffacd" }}>
        {error}</p>
      )}

      {/* Generate Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-[#0B5C66] text-white rounded-full text-2xl px-20 py-4 shadow-lg"
          onClick={handleGenerate}
        >
          GENERATE
        </button>
      </div>
    </div>
  );
}