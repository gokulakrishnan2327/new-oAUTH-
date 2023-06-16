import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import "./config.js";
import "./App.css"; // Import the CSS file for styling

const CLIENT_ID = '921ad15abf155829fc97'; // Replace with your actual client ID

const handleLogin = () => {
  const redirectUri = window.location.href;
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
};

const RepoDetails = ({ repo, onClose }) => {
  const { name, language, stars, forks } = repo;
  return (
    <div>
      <p>Language: {language}</p>
      <p>Stars: {stars}</p>
      <p>Forks: {forks}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const App = () => {
  const [repos, setRepos] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let query = `q=topic:react`;
    if (repoName !== "") {
      query += `&name=${repoName}`;
    }
    axios
      .get(`https://api.github.com/search/repositories?${query}`)
      .then((res) => {
        setRepos(res.data.items);
      });
  }, [repoName]);

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
  };

  const handleRepoDetailsClose = () => {
    setSelectedRepo(null);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div>
      <Router>
        <nav className={`navbar ${isNavOpen ? 'open' : ''}`}>
          <div className="navbar-brand">
            <button className="navbar-toggle" onClick={toggleNav}>
              <span className="toggle-icon"></span>
            </button>
            <Link to="/">Home</Link>
          </div>
          <ul className="navbar-links">
            <li>
              <Link to="/repos">Repos</Link>
            </li>
          </ul>
        </nav>
        <div className={`overlay ${isNavOpen ? 'open' : ''}`} onClick={closeNav}></div>
        <Switch>
          <Route exact path="/">
            <button onClick={handleLogin}>Login with GitHub</button>
          </Route>
          <Route path="/repos">
            <h2>Trending Repos</h2>
            <input placeholder="Repo Name" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
            <div className="repo-list">
             <div>
        {repos
          .filter((repo) => repo.name.toLowerCase().includes(repoName.toLowerCase()))
          .map((repo) => (
            <div key={repo.id}>
              <h3>{repo.name}</h3>
              <button onClick={() => handleRepoClick(repo)}>Show Details</button>
              {selectedRepo && selectedRepo.id === repo.id && (
                <div>
                  <p>Language: {selectedRepo.language}</p>
                  <p>Stars: {selectedRepo.stars}</p>
                  <p>Forks: {selectedRepo.forks}</p>
                  <button onClick={handleRepoDetailsClose}>Close</button>
                </div>
              )}
            </div>
          ))}
      </div>
               
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
