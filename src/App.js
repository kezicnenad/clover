import React, { useState, useEffect } from 'react';
import ModalDialog from "./components/Modal";
import Spinner from "./components/Spinner";

import './App.css';

function App() {

  const [playlist, setPlaylist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [error, setError] = useState('Loading');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetch("https://cors-anywhere.herokuapp.com/api.deezer.com/chart")
    .then((response) => response.json())
    .then((result) => {
      setPlaylist(result.tracks.data);
      setError('Ok');
      })
    .catch((err) => {
      console.log(err);
      setError('Error');
    });
  }

  const fetchAscending = () => {
    const ascending = [...playlist].sort((a, b) => a.duration - b.duration);
    setPlaylist(ascending);
  }

  const fetchDescending = () => {
    const descending = [...playlist].sort((a, b) => b.duration - a.duration);
    setPlaylist(descending);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const selectSong = (e, id) => {
    e.preventDefault();
    const filter = playlist.filter(item => item.id === id);
    setSelectedItem(filter);
    handleOpenModal();
  }

  const duration = (seconds) => {
    const time = new Date(seconds * 1000).toISOString().slice(14, 19);
    return time;
  }

  return (
    <div className="container text-center">
      <div className="row header">
        <h1>Top Pop</h1>
        {error === "Loading" && <Spinner />}
        {error === "Error" && <p>Error while fetching API</p>}
      </div>

      {error === "Ok" && (
        <div className="container filter">
          <button className="btn btn-warning" onClick={fetchData}>
            Default
          </button>
          <button className="btn btn-warning" onClick={fetchAscending}>
            Ascending
          </button>
          <button className="btn btn-warning" onClick={fetchDescending}>
            Descending
          </button>
        </div>
      )}

      <div className="row">
        {playlist.map((item, index) => (
          <div
            className="song"
            key={index}
            onClick={(e) => selectSong(e, item.id)}
          >
            <img
              className="album-cover"
              src={item.album.cover_big}
              alt={item.title}
            />
            <h6 className="artist">Artist: {item.artist.name}</h6>
            <h6 className="album">Album: {item.album.title}</h6>
            <h6 className="title">Title: {item.title}</h6>
            <h6>
              Duration: {duration(item.duration)}
              {/* {durationMinutes && (durationMinutes >= 10 ? durationMinutes : "0" + durationMinutes)}:
              {durationSeconds && (durationSeconds >= 10 ? durationSeconds : "0" + durationSeconds)} */}
            </h6>
          </div>
        ))}
      </div>
      <ModalDialog
        show={showModal}
        handleCloseModal={handleCloseModal}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default App;
