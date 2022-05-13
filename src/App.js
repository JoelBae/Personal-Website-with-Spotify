import React, { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Playlist, SongInput } from "./spotifyApi.js";

AOS.init({ duration: 1000 });

function App() {
  const [token, setToken] = useState("");

  //get access token from backend
  async function getToken() {
    const response = await fetch("/token");
    const json = await response.json();
    setToken(json.accessToken);
  }
  getToken();

  //get new access token from backend every hour
  setInterval(() => getToken(), 1000 * 60 * 60);

  //don't render anything if no token exists
  if (token === "") {
    return;
  }

  return (
    <div className="container">
      <Intro />
      <About accessToken={token} />
      <Projects />
      <Contacts />
    </div>
  );
}

function Intro() {
  return (
    <div className="intro">
      <h3 style={{ fontSize: "30px" }} data-aos="fade-in">
        My name is
      </h3>
      <div className="name" data-aos="fade-in" data-aos-delay="500">
        <strong>Joel Bae.</strong>
      </div>
      <div data-aos="fade-in" data-aos-delay="900">
        <h2>I'm a student at the Universtiy of Waterloo.</h2>
        <h4>I'm interested in Mathematics, Software, and Statistics.</h4>
      </div>
    </div>
  );
}

function About(props) {
  const [count, setCount] = useState(0);
  //Used to rerender Playlist
  const increment = () => {
    setCount(count + 1);
  };
  return (
    <div className="about" data-aos="fade-in">
      <div className="aboutContainer">
        <h3>About Me</h3>
        Hello! I am currently in my 2A term at the University of Waterloo
        studying Mathematics. My hobbies include: music production, web
        development, video games, and music. The technologies I know are:
        Javascript, Node.js, React, Java, and C.
        <SongInput increment={increment} accessToken={props.accessToken} />
      </div>

      <Playlist count={[count, setCount]} accessToken={props.accessToken} />
    </div>
  );
}

function Projects() {
  return (
    <div className="projects" data-aos="fade-in" data-aos-offset="250">
      <h3>Projects</h3>
      <ul>
        <li>
          <a href="https://joelbae.github.io/polytonle/" target="_blank">
            Polytonle: Wordle type game for chords and ear training.
          </a>
        </li>
        <li>More to come!</li>
      </ul>
    </div>
  );
}

function Contacts() {
  return (
    <div className="contact">
      <h3 data-aos="fade-in">Contact Info:</h3>
      <ul className="emails" data-aos="fade-in" data-aos-delay="250">
        <li>
          <a href="mailto:js2bae@uwaterloo.ca">Contact via school email</a>
        </li>
        <li>
          <a href="mailto:joelsongbae2112@gmail.com">
            Contact via personal email
          </a>
        </li>
      </ul>

      <a
        className="socials"
        data-aos="fade-in"
        data-aos-delay="750"
        href="https://github.com/JoelBae"
        target="_blank"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="50"
          height="50"
        >
          <path
            fillRule="evenodd"
            color="rgb(240, 248, 255)"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
      </a>
    </div>
  );
}

export default App;
