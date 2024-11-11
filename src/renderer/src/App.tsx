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

    ipcRenderer.on('window-showing', handleShowing);
    ipcRenderer.on('window-hiding', handleHiding);

    return () => {
      ipcRenderer.removeListener('window-showing', handleShowing);
      ipcRenderer.removeListener('window-hiding', handleHiding);
    };
  }, []);
  return (
    <div className={`app-container ${isHiding ? 'hiding' : ''}`}>
      <div className='text-red-500'>
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
    </div>
  );
}

export default App
