import React, { useRef, useState } from "react";
import style1 from "../assets/style1.jpg";
import style2 from "../assets/style2.jpg";
import style3 from "../assets/style3.jpg";
import style4 from "../assets/style4.jpg";
import element3 from "../assets/element3.png";

export default function PageTwo({ onGoBack }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [personalization, setPersonalization] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [audio, setAudio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerate = async () => {
    // Clear previous error and summary
    setError("");
    setSummary("");
    setAudio("");

    if (!fileName && !selectedStyle) {
      setError("Please upload a file and select a TikTok style");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("style", selectedStyle);
      formData.append("personalization", personalization);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setAudio(data.audio);
    } catch (error) {
      setError(`Failed to generate summary: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const playHoverSound = () => {
    const audio = new Audio('/hover.mp3');
    audio.play();
  };

  const styles = [
    { id: 1, label: "Style 1", image: style1 },
    { id: 2, label: "Style 2", image: style2 },
    { id: 3, label: "Style 3", image: style3 },
    { id: 4, label: "Style 4", image: style4 },
  ];

  return (
    <div className="bg-[#FF6A1A] min-h-screen w-full relative px-10 py-8 overflow-hidden font-quicksand">

      {/* Logo */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-[#004E52] font-quicksand font-bold text-xl cursor-pointer"
        onClick={onGoBack}
      >
        <span className="text-4xl">∿</span>
        TIKTOKIFY MY NOTES
      </div>

      {/* Upload Notes */}
      <div className="bg-[#fffacd] rounded-2xl p-6 mt-20 flex justify-between items-center max-w-2xl mx-auto cursor-pointer hover:scale-105 transition-all duration-300" onMouseEnter={playHoverSound}>
        <p className="text-orange-600 font-black uppercase text-2xl">
          Upload Notes
        </p>
        <div className="flex items-center gap-4">
          <button
            className="bg-white px-6 py-3 rounded-md shadow font-arial text-[#737373]"
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
      <div className="bg-[#fffacd] rounded-2xl p-6 mt-6 max-w-2xl mx-auto cursor-pointer hover:scale-105 transition-all duration-300" onMouseEnter={playHoverSound}>
        <p className="text-orange-600 font-black uppercase text-left text-2xl">
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
      <div className="bg-[#fffacd] rounded-2xl p-6 mt-6 max-w-2xl mx-auto cursor-pointer hover:scale-105 transition-all duration-300" onMouseEnter={playHoverSound}>
        <p className="text-orange-600 font-black uppercase text-2xl">
          Any Extra Details?
        </p>

        <input
          placeholder="Make it sound stern"
          className="w-full mt-3 px-4 py-3 rounded-md bg-white border border-gray-300 font-arial placeholder:text-[#737373]"
          value={personalization}
          onChange={(e) => setPersonalization(e.target.value)}
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
          className="bg-[#0B5C66] text-white text-2xl md:text-3xl font-quicksand font-bold rounded-full px-16 py-5 shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "GENERATING..." : "GENERATE"}
        </button>
      </div>

      {/* Summary and Audio Display */}
      {(summary && audio) && (
        <div className="bg-[#fffacd] rounded-2xl p-6 mt-6 max-w-2xl mx-auto">
          <p className="text-orange-600 font-bold uppercase text-center">Generated Your Tiktok-Style Audio! Here's some things to keep in mind:</p>
          <p className="mt-4 text-black">{summary}</p>

          <div className="mt-6">
            <p className="text-orange-600 font-bold uppercase text-center mb-4">Audio Summary</p>
            <audio controls className="w-full mb-4">
              <source src={`data:audio/mpeg;base64,${audio}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="flex gap-4 justify-center">
              <a
                href={`data:audio/mpeg;base64,${audio}`}
                download="tiktok_summary_audio.mp3"
                className="bg-[#0B5C66] text-white px-6 py-3 rounded-md shadow hover:bg-opacity-80 transition-all"
              >
                Download Audio
              </a>
              <button
                onClick={() => {
                  if (navigator.share && window.File) {
                    const blob = new Blob([atob(audio)], { type: 'audio/mpeg' });
                    const file = new File([blob], 'tiktok_summary_audio.mp3', { type: 'audio/mpeg' });
                    navigator.share({
                      title: 'TikTok Summary Audio',
                      text: 'Check out this AI-generated summary audio!',
                      files: [file]
                    }).catch(console.error);
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(`data:audio/mpeg;base64,${audio}`);
                    alert('Audio link copied to clipboard');
                  }
                }}
                className="bg-[#FF5C00] text-white px-6 py-3 rounded-md shadow hover:bg-opacity-80 transition-all"
              >
                Share Audio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left side element */}
      <img
        src={element3}
        alt="Element 3"
        className="absolute left-4 top-1/3 transform -translate-y-1/2 w-64 h-64 object-contain"
      />

      {/* Right side element */}
      <img
        src={element3}
        alt="Element 3"
        className="absolute right-4 top-2/3 transform -translate-y-1/2 w-64 h-64 object-contain"
      />
    </div>
  );
}
