import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { blobToURL, urlToBlob, fromBlob, fromURL } from "image-resize-compress";
import github from "./img/GitHub-Mark-32px.png";
import "./styles.css";

const getSize = (size) => (size / 1024).toFixed(3);

function App() {
  const [uploadedFile, setUploadedFile] = useState();
  const [uploadedFileUrl, setUploadedFileUrl] = useState();

  const [imgUrl, setImgUrl] = useState();

  const [convertedFile, setConvertedFile] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [reduced, setReduced] = useState(null);
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
          <span>Size: {`${getSize(file.size)}kb`}</span>
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

  const renderReduced = () =>
    reduced >= 0 ? (
      <span className="reduced">Reduced: {`${reduced}kb`}</span>
    ) : (
      <span className="increased">
        Increased: {`${reduced * -1}kb`}
        <br />
        Try changing image format or quality
      </span>
    );
  const uploadURL = (e) => {
    e.preventDefault();
    let size;
    setUploadedFileUrl(imgUrl);
    urlToBlob(imgUrl).then((file) => {
      setUploadedFile(file);
      size = file.size;
    });

    const { quality, width, height, format } = formRef.current;

    fromURL(imgUrl, quality.value, width.value, height.value, format.value)
      .then((file) => {
        blobToURL(file).then((url) => setImageUrl(url));
        setConvertedFile(file);
        setTimeout(() => {
          setReduced(getSize(size - file.size));
        }, 100);
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
      setReduced(getSize(uploadedFile.size - file.size));
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
      <h1>
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
      </h1>
      <h3>
        Sample page for demonstrating{" "}
        <code className="tag">image-resize-compress</code> package.
        <br />
        You may check more about this package{" "}
        <a
          href="https://www.npmjs.com/package/image-resize-compress"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </h3>
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
        <button type="submit" disabled={!uploadedFile}>
          Upload
        </button>
      </form>
      <form onSubmit={uploadURL}>
        <label>or URL:</label>
        <br />
        <input
          className="url-input"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          type="text"
          placeholder="Enter the image url"
        />
        <button type="submit" disabled={!imgUrl}>
          From URL
        </button>
      </form>
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
            {uploadedFile && renderReduced()}
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
