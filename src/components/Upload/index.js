import React, { useState } from "react";
import { Checkbox, Button, FormControlLabel } from "@material-ui/core";
import { uploadFile } from "../../helpers/api";
import Diagram from "../Diagram";
import { createDiagram } from "../../helpers/symboleoToMermaid";
import "./style.css";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("symboleo");
  const [chart, setChart] = useState("");

  const upload = () => {
    setLoading(true);
    file?.[0] &&
      uploadFile(file[0], type)
        .then((response) => {
          if (response?.data) {
            const chart = createDiagram(response.data);
            chart && setChart(chart);
          }
          setLoading(false);
        })
        .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="uploadContainer">
        <div className="contractTypes">
          <FormControlLabel
            control={
              <Checkbox
                value="symboleo"
                onChange={(event) => setType(event.target.value)}
                checked={type === "symboleo"}
              />
            }
            label="Symboleo"
          />
        </div>
        <div className="uploadGroup">
          <Button variant="contained" component="label">
            Choose File
            <input
              type="file"
              hidden
              accept="txt"
              onChange={(event) => setFile(event.target.files)}
            />
          </Button>
          {file && <span className="fileName">{file[0]?.name}</span>}

          <Button
            variant="contained"
            component="label"
            disabled={!file}
            onClick={upload}
          >
            Upload
          </Button>
        </div>
      </div>

      {!loading && chart && <Diagram chart={chart} />}
    </>
  );
};

export default Upload;
