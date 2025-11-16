import React, { useState } from "react";
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";

function App() {
  const [page, setPage] = useState("page1");
  const [language, setLanguage] = useState("English");

  return (
    <div className="min-h-screen w-full">
      {page === "page1" && (
        <PageOne 
          onStart={() => setPage("page2")} 
          language={language}
          setLanguage={setLanguage}
        />
      )}
      {page === "page2" && (
        <PageTwo 
          onGoBack={() => setPage("page1")} 
          language={language}
        />
      )}
    </div>
  );
}

export default App;
