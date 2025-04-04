import React, { useState } from 'react';

export default function NewsItem({ description,description2, title, imageUrl, newsUrl, author, time, source }) {
  const [newsStatus, setNewsStatus] = useState(null);

  const checkNews = async () => {
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ news: description2 }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setNewsStatus(data.prediction);
    } catch (error) {
      console.error("Error checking news:", error);
      setNewsStatus("Error in checking news");
    }
  };
  
  
  return (
    <div className='my-3'>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", top:"0",  right: "0" }}>
          <span className="badge rounded-pill bg-danger">{source}</span>
        </div>
        <img src={imageUrl || "https://via.placeholder.com/150"} className="card-img-top" alt="News" />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text"><small className="text-muted">By {author || "Unknown"} on {new Date(time).toGMTString()}</small></p>
          <a rel="noreferrer" href={newsUrl} target="_blank" className="btn btn-dark">Read More</a>
          <button onClick={checkNews} className="btn btn-primary mx-2">Check News</button>
          {newsStatus && <p className="mt-2">Prediction: <strong>{newsStatus}</strong></p>}
        </div>
      </div>
    </div>
  );
}
