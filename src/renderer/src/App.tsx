// import { ipcRenderer } from 'electron';
import './App.css';
import { useEffect } from 'react';
import { useState } from 'react';

function App(): JSX.Element {
  const { ipcRenderer } = window.electron;

  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {

    const handleShowing = () => {
      setIsHiding(false);
    };

    const handleHiding = () => {
      setIsHiding(true);
    };

    const removeShowing = ipcRenderer.on('window-showing', handleShowing);
    const removeHiding = ipcRenderer.on('window-hiding', handleHiding);

    return () => {
      removeShowing();
      removeHiding();
    };
  }, []);
  return (
    <div className={`app-container ${isHiding ? 'hiding' : ''}`}>
      <div className='bg-blue-500'>
        tetestsetes
        <button onClick={() => {
          ipcRenderer.send('hide-window')
        }}>收起</button>
        <button onClick={() => {
          ipcRenderer.send('pin-window')
        }}>pin</button>
        <button onClick={() => {
          ipcRenderer.send('unpin-window')
        }}>unpin</button>
      </div>
    </div >
  );
}

export default App
