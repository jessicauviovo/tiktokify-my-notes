import { useRef, useState } from "react";
import style1 from "../assets/style1.png";
import style2 from "../assets/style2.png";
import style3 from "../assets/style3.png";
import style4 from "../assets/style4.png";
import element3 from "../assets/element3.png";

const translations = {
  English: {
    uploadNotes: "Upload Notes",
    chooseFile: "Choose File",
    maxSize: "Max 5MB • PDF, DOCX, TXT",
    chooseStyle: "Choose TikTok Style",
    generateBtn: "GENERATE",
    generating: "GENERATING",
    successMsg: "AUDIO GENERATED SUCCESSFULLY 🤠",
    download: "Download",
    share: "Share",
    errorUploadAndStyle: "Make sure you upload your notes and select a TikTok style 🤠",
    errorUpload: "Don't forget to upload your notes!",
    errorStyle: "Oops, you didn't select a TikTok style...",
    errorSize: "File size must be less than 5MB",
    styles: {
      1: "Soft-spoken ASMR",
      2: "Bestie Facetime",
      3: "Juicy Storytime",
      4: "True Crime Story"
    }
  },
  Spanish: {
    uploadNotes: "Subir Notas",
    chooseFile: "Elegir Archivo",
    maxSize: "Máx 5MB • PDF, DOCX, TXT",
    chooseStyle: "Elige Estilo TikTok",
    generateBtn: "GENERAR",
    generating: "GENERANDO",
    successMsg: "AUDIO GENERADO EXITOSAMENTE 🤠",
    download: "Descargar",
    share: "Compartir",
    errorUploadAndStyle: "Asegúrate de subir tus notas y seleccionar un estilo TikTok 🤠",
    errorUpload: "¡No olvides subir tus notas!",
    errorStyle: "Oops, no seleccionaste un estilo TikTok...",
    errorSize: "El tamaño del archivo debe ser menor a 5MB",
    styles: {
      1: "ASMR Suave",
      2: "FaceTime con Amiga",
      3: "Historia Jugosa",
      4: "Historia de Crimen"
    }
  },
  French: {
    uploadNotes: "Télécharger Notes",
    chooseFile: "Choisir Fichier",
    maxSize: "Max 5Mo • PDF, DOCX, TXT",
    chooseStyle: "Choisir Style TikTok",
    generateBtn: "GÉNÉRER",
    generating: "GÉNÉRATION",
    successMsg: "AUDIO GÉNÉRÉ AVEC SUCCÈS 🤠",
    download: "Télécharger",
    share: "Partager",
    errorUploadAndStyle: "Assurez-vous de télécharger vos notes et de sélectionner un style TikTok 🤠",
    errorUpload: "N'oubliez pas de télécharger vos notes!",
    errorStyle: "Oups, vous n'avez pas sélectionné de style TikTok...",
    errorSize: "La taille du fichier doit être inférieure à 5Mo",
    styles: {
      1: "ASMR Doux",
      2: "FaceTime Copine",
      3: "Histoire Captivante",
      4: "Histoire Criminelle"
    }
  },
  Hindi: {
    uploadNotes: "नोट्स अपलोड करें",
    chooseFile: "फ़ाइल चुनें",
    maxSize: "अधिकतम 5MB • PDF, DOCX, TXT",
    chooseStyle: "टिकटॉक स्टाइल चुनें",
    generateBtn: "उत्पन्न करें",
    generating: "उत्पन्न हो रहा है",
    successMsg: "ऑडियो सफलतापूर्वक उत्पन्न हुआ 🤠",
    download: "डाउनलोड",
    share: "साझा करें",
    errorUploadAndStyle: "सुनिश्चित करें कि आप अपने नोट्स अपलोड करें और एक टिकटॉक स्टाइल चुनें 🤠",
    errorUpload: "अपने नोट्स अपलोड करना न भूलें!",
    errorStyle: "ओह, आपने टिकटॉक स्टाइल नहीं चुना...",
    errorSize: "फ़ाइल का आकार 5MB से कम होना चाहिए",
    styles: {
      1: "कोमल ASMR",
      2: "बेस्टी फेसटाइम",
      3: "रोमांचक कहानी",
      4: "अपराध की कहानी"
    }
  },
  Chinese: {
    uploadNotes: "上传笔记",
    chooseFile: "选择文件",
    maxSize: "最大 5MB • PDF, DOCX, TXT",
    chooseStyle: "选择TikTok风格",
    generateBtn: "生成",
    generating: "生成中",
    successMsg: "音频生成成功 🤠",
    download: "下载",
    share: "分享",
    errorUploadAndStyle: "请确保上传笔记并选择TikTok风格 🤠",
    errorUpload: "别忘了上传你的笔记！",
    errorStyle: "哎呀，你没有选择TikTok风格...",
    errorSize: "文件大小必须小于5MB",
    styles: {
      1: "轻声ASMR",
      2: "闺蜜视频通话",
      3: "精彩故事",
      4: "真实犯罪故事"
    }
  }
};

export default function PageTwo({ onGoBack, language }) {
  const t = translations[language] || translations.English;
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [audio, setAudio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError(t.errorSize);
        setFileName("");
        return;
      }
      setFileName(file.name);
      setError("");
    }
  };

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.currentTime = 30;
    audio.play();
  };

  const handleGenerate = async () => {
    playClickSound();
    // Clear previous error and summary
    setError("");
    setSummary("");
    setAudio("");

    if (!fileName && !selectedStyle) {
      setError(t.errorUploadAndStyle);
      return;
    }

    if(!fileName) {
      setError(t.errorUpload);
      return;
    }

    if(!selectedStyle) {
      setError(t.errorStyle);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("style", selectedStyle);
      formData.append("language", language);

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch("https://tiktokify-my-notes.onrender.com/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear timeout if request succeeds

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // If response isn't JSON, keep the statusText
        }
        throw new Error(`Backend Error: ${errorMessage}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setAudio(data.audio);
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request timed out after 30 seconds. Please try again 🤠');
      } else {
        setError(`Oops, there was a processing error. Details: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const playHoverSound = () => {
    const audio = new Audio('/hover.mp3');
    audio.play();
  };

  const styles = [
    { id: 1, label: "Soft-spoken ASMR", image: style1 },
    { id: 2, label: "Bestie Facetime", image: style2 },
    { id: 3, label: "Juicy Storytime", image: style3 },
    { id: 4, label: "True Crime Story", image: style4 },
  ];

  return (
    <div className="bg-[#FF6A1A] min-h-screen w-full relative px-10 py-8 overflow-hidden font-quicksand">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <p className="text-white text-4xl font-quicksand font-bold">
            {t.generating.toUpperCase()}
            <span className="inline-block animate-bounce">.</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '0.2s'}}>.</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '0.4s'}}>.</span>
          </p>
        </div>
      )}

      {/* Logo */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-[#fffacd] font-quicksand font-bold text-xl cursor-pointer"
        onClick={onGoBack}
      >
        <span className="text-4xl">∿</span>
        TIKTOKIFY MY NOTES
      </div>

      {/* Upload Notes */}
      <div className="bg-[#fffacd] rounded-2xl p-6 mt-20 flex justify-between items-center max-w-2xl mx-auto cursor-pointer hover:scale-105 transition-all duration-300" onMouseEnter={playHoverSound}>
        <p className="text-orange-600 font-black uppercase text-2xl">
          {t.uploadNotes}
        </p>
        <div className="flex flex-col items-center gap-2">
          <button
            className="bg-white px-6 py-3 rounded-md shadow font-arial text-[#737373]"
            onClick={() => fileInputRef.current.click()}
          >
            {t.chooseFile}
          </button>
          <p className="text-xs text-gray-600 font-arial">{t.maxSize}</p>
          {fileName && <span className="text-[#555555] font-medium font-arial">{fileName}</span>}
        </div>
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Choose TikTok Style */}
      <div className="bg-[#fffacd] rounded-2xl p-6 mt-6 max-w-2xl mx-auto cursor-pointer hover:scale-105 transition-all duration-300" onMouseEnter={playHoverSound}>
        <p className="text-orange-600 font-black uppercase text-left text-2xl">
          {t.chooseStyle}
        </p>

        <div className="mt-4 flex gap-4 justify-center flex-nowrap overflow-x-auto">
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
                className="w-32 h-32 object-cover rounded-md transition-all duration-200 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,200,0,1)]"
              />
              <p className="mt-2 text-sm font-bold text-[#555555] text-center">
                {t.styles[style.id]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="font-bold mt-4 text-center" style={{ color: "#fffacd" }}>
        {error}</p>
      )}

      {/* Generate Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-[#0f606b] text-white text-2xl md:text-3xl font-quicksand font-bold rounded-full px-16 py-5 shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? t.generating.toUpperCase() + "..." : t.generateBtn}
        </button>
      </div>

      {/* Summary and Audio Display */}
      {(summary && audio) && (
        <div ref={() => setTimeout(() => document.querySelector('.summary-section')?.scrollIntoView({behavior: 'smooth'}), 100)} className="max-w-2xl mx-auto mt-6 summary-section">
          <p className="text-white font-bold uppercase text-center">{t.successMsg}</p>

          <div className="mt-6">

            <audio controls className="w-full mb-4 px-4">
              <source src={`data:audio/mpeg;base64,${audio}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            <div className="flex gap-4 justify-center mb-8">
              <a
                href={`data:audio/mpeg;base64,${audio}`}
                download="tiktokify_audio.mp3"
                className="bg-[#FFFFFF] text-[#555555] font-arial px-6 py-3 rounded-md shadow hover:bg-opacity-80 transition-all"
              >
                <span>📥  </span>{t.download}
              </a>
              <button
                onClick={() => {
                  if (navigator.share && window.File) {
                    const blob = new Blob([atob(audio)], { type: 'audio/mpeg' });
                    const file = new File([blob], 'tiktokify_audio.mp3', { type: 'audio/mpeg' });
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
                className="bg-[#FFFFFF] text-[#555555] font-arial px-6 py-3 rounded-md shadow hover:bg-opacity-80 transition-all"
              >
                <span>🔗 </span>{t.share}
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