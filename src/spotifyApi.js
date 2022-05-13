import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
AOS.init({ duration: 200 });

// Renders the Playlist
export function Playlist(props) {
  const [tracks, setTracks] = useState([]);

  //Recieves playlist content
  useEffect(() => {
    async function fetchPlaylist() {
      const playlist_id = "3lTTllTnRJdf4PDUz54zE4";
      const accessToken = props.accessToken;
      if (accessToken == undefined) {
        return;
      }
      const api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
      try {
        const response = await axios.get(api_url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTracks(response.data.items);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlaylist();
  }, [props.count]); //retriggers when count is updated
  return (
    <div className="playlistContainer">
      <a
        className="linkToPlaylist"
        href="https://open.spotify.com/playlist/3lTTllTnRJdf4PDUz54zE4?si=2bbdc1d917bf49b2"
        target="_blank"
      >
        <strong>The Playlist</strong>
      </a>
      <div className="playlist">
        <Songs songs={tracks.map((item) => item.track)} />
      </div>
    </div>
  );
}

//adds track to the playlist
async function addTrack(uri, accessToken, increment, handleSubmit) {
  console.log("CLICKED");
  const data = {
    position: 0,
  };
  const playlist_id = "3lTTllTnRJdf4PDUz54zE4";
  const api_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?position=0&uris=${uri}`;
  try {
    await axios.post(api_url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    increment(); //changes the state of count to update Playlist
    handleSubmit(); //changes the state of the search bar; empties it
  } catch (error) {
    console.log(error);
  }
}

function Track(props) {
  //Includes submit button in component
  if (props.searches === "True") {
    return (
      <div className="track searches">
        <a href={props.track_href} className="track" target="_blank">
          <img className="art" src={props.art} />
          {props.title} - {props.artist}
        </a>
        <button
          onClick={() =>
            addTrack(
              props.uri,
              props.accessToken,
              props.increment,
              props.handleSubmit
            )
          }
          data-id={props.uri}
        >
          Submit
        </button>
      </div>
    );
  }
  // does not include submit button
  return (
    <div className="track">
      <a href={props.track_href} className="track" target="_blank">
        <img className="art" src={props.art} />
        {props.title} - {props.artist}
      </a>
    </div>
  );
}

//For each item in array of tracks, renders track
function Songs(props) {
  return (
    <div className="songs">
      {props.songs.map((item, index) => {
        return (
          <Track
            key={index}
            track_href={item.external_urls.spotify}
            art={item.album.images[item.album.images.length - 1].url}
            title={item.name}
            artist={item.artists[0].name}
            searches={props.searches}
            uri={item.uri}
            accessToken={props.accessToken}
            increment={props.increment}
            handleSubmit={props.handleSubmit}
          />
        );
      })}
    </div>
  );
}

//Search results from song search bar
function Results(props) {
  const [searchResults, setSearchResults] = useState([]);

  //gets array of 5 tracks
  useEffect(() => {
    async function findSong(song) {
      if (song === "") {
        return;
      }
      try {
        const accessToken = props.accessToken;
        const api_url = `https://api.spotify.com/v1/search?query=${song}&type=track&limit=5`;
        const response = await axios.get(api_url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSearchResults(response.data.tracks.items);
      } catch (error) {
        console.log(error);
      }
    }

    findSong(props.submit);
  }, [props.submit]);

  //hides search result box if no input
  if (props.submit === "") {
    return <div className="playlist blank"></div>;
  }
  return (
    <div className="playlist">
      <Songs
        songs={searchResults}
        accessToken={props.accessToken}
        searches="True"
        increment={props.increment}
        handleSubmit={props.handleSubmit}
      />
    </div>
  );
}

//Search form
export function SongInput(props) {
  const [song, setSong] = useState("");

  //empties form when called
  const handleSubmit = () => {
    setSong("");
  };
  return (
    <div className="songInput">
      <form>
        <p>
          If you have any music you'd like to share, feel free to search for the
          song here and they will appear in the spotify playlist on the side
          when selected:
        </p>
        <input
          type="text"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />
      </form>
      <Results
        increment={props.increment}
        submit={song}
        accessToken={props.accessToken}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
