import React from "react";

const OnlineCodeCompiler = () => {
  return (
    <div className="compiler-wrapper">
    <h2 className="text-center text-primary my-3">Node.js Code Compiler</h2>
    <div className="iframe-container">
      <iframe
        src="https://www.jdoodle.com/embed/v1/7b8d6603f298e400"
        title="Node.js Compiler"
        allowFullScreen
      ></iframe>
    </div>
  </div>
  );
};

export default OnlineCodeCompiler;
