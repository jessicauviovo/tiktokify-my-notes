import React, { useState } from "react";
import PageOne from "./components/PageOne";
import PageTwo from "./components/PageTwo";

function App() {
  const [page, setPage] = useState("page1");

  return (
    <div className="min-h-screen w-full">
      {page === "page1" && <PageOne onStart={() => setPage("page2")} />}
      {page === "page2" && <PageTwo />}
    </div>
  );
}

export default App;