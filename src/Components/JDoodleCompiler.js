import React, { useState } from "react";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/php/php";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/sql/sql";
import "codemirror/mode/swift/swift";
import "codemirror/mode/perl/perl";
import "codemirror/mode/go/go";
import "codemirror/mode/r/r";
//import "codemirror/mode/bash/bash";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import BackButton from "../SharedComponents/BackButton";

const JDoodleCompiler = () => {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("nodejs");
  const [output, setOutput] = useState("");

  const languages = [
    { name: "JavaScript", value: "nodejs", mode: "javascript", version: "4" },
    { name: "Python 3", value: "python3", mode: "python", version: "3" },
    { name: "Java", value: "java", mode: "clike", version: "4" },
    { name: "C++", value: "cpp17", mode: "clike", version: "0" },
    { name: "C", value: "c", mode: "clike", version: "0" },
    { name: "PHP", value: "php", mode: "php", version: "3" },
    { name: "Ruby", value: "ruby", mode: "ruby", version: "0" },
    { name: "Swift", value: "swift", mode: "swift", version: "3" },
    { name: "Perl", value: "perl", mode: "perl", version: "0" },
    { name: "Go", value: "go", mode: "go", version: "3" },
    { name: "R", value: "r", mode: "r", version: "0" },
    { name: "Bash", value: "bash", mode: "bash", version: "3" },
    { name: "SQL", value: "sql", mode: "sql", version: "0" },
  ];
  
  const executeCode = async () => {
    const selectedLang = languages.find((lang) => lang.value === language);
    const clientId = "ec3a6c53dc6ea51855762b1b37f4bef3";
    const clientSecret = "64d97462bc7ea6e3f8d0e56a6ccd00a0c7ea59155ded7f263453506f40dd22df";
    const script = code;
    const versionIndex = selectedLang.version;

    try {
      const response = await axios.post(
        "https://thingproxy.freeboard.io/fetch/https://api.jdoodle.com/v1/execute",
        { clientId, clientSecret, script, language, versionIndex }
      );
      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error executing code");
    }
  };

  return (
    <div className="container my-4">
      <BackButton />
      <h2 className="text-center mb-4">Online Code Compiler {language}</h2>

      <div className="row">
        <div className="col-12">
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              label="Language"
              onChange={(e) => {setLanguage(e.target.value); setCode("// Write your code here");}}
              value={language}
            >
              {languages.map(({ value, name }) => (
                <MenuItem key={value} value={value}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="py-3">
            <h5>Code Editor</h5>
            <CodeMirror
              value={code}
              options={{
                mode: languages.find((lang) => lang.value === language)?.mode,
                theme: "material",
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => setCode(value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="py-3">
            <h5>Output</h5>
            <div className="border p-2 h-100">
            <pre>{output}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-primary" onClick={executeCode}>
          Run Code
        </button>
      </div>
    </div>
  );
};

export default JDoodleCompiler;