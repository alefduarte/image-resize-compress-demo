import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { blobToURL, urlToBlob, fromBlob, fromURL } from "image-resize-compress";
import github from "./img/GitHub-Mark-32px.png";
import "./styles.css";

function App() {
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedFileUrl, setUploadedFileUrl] = useState();

  const [imgUrl, setImgUrl] = useState();

  const [convertedFile, setConvertedFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const formRef = useRef();

  const renderDetails = (file) => (
    <div className="details">
      {file.name && (
        <>
          <span>Name: {file.name}</span>
          <br />
        </>
      )}
      {file.size && (
        <>
          <span>Size: {`${(file.size / 1024).toFixed(3)}kb`}</span>
          <br />
        </>
      )}
      {file.type && (
        <>
          <span>Format: {file.type}</span>
          <br />
        </>
      )}
    </div>
  );

  const uploadURL = () => {
    setUploadedFileUrl(imgUrl);
    urlToBlob(imgUrl).then((file) => {
      setUploadedFile(file);
    });

    const { quality, width, height, format } = formRef.current;

    fromURL(imgUrl, quality.value, width.value, height.value, format.value)
      .then((file) => {
        blobToURL(file).then((url) => setImageUrl(url));
        setConvertedFile(file);
      })
      .catch((err) => alert(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { quality, width, height, format } = e.target;
    fromBlob(
      uploadedFile,
      quality.value,
      width.value,
      height.value,
      format.value
    ).then((file) => {
      blobToURL(file).then((url) => setImageUrl(url));
      setConvertedFile(file);
    });
  };

  const fileChangedHandler = (e) => {
    const file = e.target.files[0];
    blobToURL(file).then((url) => setUploadedFileUrl(url));
    setUploadedFile(file);
  };

  const downloadFile = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = uploadedFile.name ?? "image.png";
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className="app">
      <h2>
        <a
          href="https://www.npmjs.com/package/image-resize-compress"
          target="_blank"
          rel="noopener noreferrer"
        >
          Image Resizer, Compressor and Converter
        </a>
        <a href="https://github.com/alefduarte/image-resize-compress">
          <img className="github-icon" src={github} alt="github" />
        </a>
      </h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <label>
          Quality:
          <input
            type="number"
            name="quality"
            defaultValue={90}
            min="1"
            max="100"
          />
        </label>
        <label>
          Width:
          <input name="width" type="text" defaultValue={0} />
        </label>
        <label>
          Height:
          <input name="height" type="text" defaultValue={0} />
        </label>
        <label>
          Format:
          <select defaultValue="webp" name="format">
            <option value="png">png</option>
            <option value="webp">webp</option>
            <option value="bmp">bmp</option>
            <option value="jpeg">jpeg</option>
          </select>
        </label>
        <br />
        <input type="file" onChange={fileChangedHandler} />
        <button
          type="submit"
          name="upload_button"
          disabled={!uploadedFile}
          value="file"
        >
          Upload
        </button>
      </form>
      <label>or URL:</label>
      <br />
      <input
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
        type="text"
        placeholder="Enter the image url"
        style={{ width: 500 }}
      />

      <button type="button" disabled={!imgUrl} onClick={uploadURL}>
        From URL
      </button>
      <br />
      <div className="preview">
        {uploadedFileUrl && uploadedFile && (
          <div className="image">
            <h2>Before:</h2>
            <img src={uploadedFileUrl} alt=""></img>
            <br />
            {renderDetails(uploadedFile)}
            <br />
            <button
              style={{ margin: "1rem 0px" }}
              onClick={() => downloadFile(uploadedFileUrl)}
            >
              Download
            </button>
          </div>
        )}
        {imageUrl && convertedFile && (
          <div className="image">
            <h2>After:</h2>
            <img src={imageUrl} alt=""></img>
            <br />
            {uploadedFile && (
              <span className="reduced">
                Reduced:{" "}
                {`${((uploadedFile.size - convertedFile.size) / 1024).toFixed(
                  3
                )}kb`}
              </span>
            )}
            <br />
            {renderDetails(convertedFile)}
            <br />
            <button
              style={{ margin: "1rem 0px" }}
              onClick={() => downloadFile(imageUrl)}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
