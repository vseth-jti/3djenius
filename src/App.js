import './App.css';
import EngineObject from './engineObject';
import ParkingScene from './parkingScene';
import React, {useState} from 'react';


function App() {
  const [showEngineObject, setShowEngineObject] = useState(true); // Start with EngineObject

  const toggleScene = () => {
    setShowEngineObject(!showEngineObject);
  };

  return (
    <div className="App">
      <button onClick={toggleScene}>
        {showEngineObject ? 'Switch to Site Visit' : 'Switch to Evidence Viewer'}
      </button>

      {/* Conditional Rendering */}
      {showEngineObject ? <EngineObject /> : <ParkingScene />} 
    </div>
  );
}

export default App;
