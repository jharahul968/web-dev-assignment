import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://storage.googleapis.com/programiz-static/hiring/software/job-listing-page-challenge/data.json"
        );
        const jsonData = await response.json();
        setJobs(jsonData);
        setFilteredJobs(jsonData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleKeywordClick = (keyword) => {
    const updatedKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter((key) => key !== keyword)
      : [...selectedKeywords, keyword];

    setSelectedKeywords(updatedKeywords);

    if (updatedKeywords.length === 0) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        updatedKeywords.every((key) => job.keywords.includes(key))
      );
      setFilteredJobs(filtered);
    }
  };

  const handleRemoveKeyword = (keyword) => {
    const updatedKeywords = selectedKeywords.filter((key) => key !== keyword);
    setSelectedKeywords(updatedKeywords);

    if (updatedKeywords.length === 0) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        updatedKeywords.every((key) => job.keywords.includes(key))
      );
      setFilteredJobs(filtered);
    }
  };

  if (filteredJobs.length === 0) {
    return <div>Loading...</div>;
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div>
      <div className="top-bar"></div>
      {selectedKeywords.length > 0 && (
        <div className="top-keywords">
          {selectedKeywords.map((keyword) => (
            <button key={keyword}>
              {keyword}
              <span
                className="remove-btn"
                onClick={() => handleRemoveKeyword(keyword)}
              >
                &#10005;
              </span>
            </button>
          ))}
          {selectedKeywords.length > 0 && (
            <button
              className="clear-btn"
              // onClick={()=>setSelectedKeywords([]) }
              onClick={() => {
                setFilteredJobs(jobs);
                setSelectedKeywords([]);
              }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      <ul className="all-jobs">
        {filteredJobs.map((job) => (
          <li key={job.position}>
            <div className="job_list">
              <div className="image">
                <img
                  src={job.company_logo}
                  alt={job.company}
                  className="logo"
                />
              </div>
              <div>
                <p>{job.company}</p>
                <h3>{job.position}</h3>
                <div className="job_desc">
                  <p className="job-location">{job.location}</p>
              <ul className="job-desc-list">
                <li className="middle-job">
                  <p className="job-posted-time">{getTimeAgo(job.posted_on)}</p>
                  </li>
                  <li className="middle-job">
                  <p className="job-type">{job.timing}</p>
                  </li>
                  </ul>
                </div>
              </div>
              <div className="keywords">
                {job.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    className={
                      selectedKeywords.includes(keyword) ? "active" : ""
                    }
                    onClick={() => handleKeywordClick(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
