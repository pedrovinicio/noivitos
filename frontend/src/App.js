import './App.css';
import Sidebar from './components/UI/Sidebar';
import GuestList from './components/UI/GuestList';
import Checklist from './components/UI/Checklist';
import React, {useState} from "react";

function App() {

  const [currentMenu, setCurrentMenu] = useState('Checklist');

  const onMenuChanged = (newMenu) => {
    setCurrentMenu(newMenu);
  }

  return (
    <div className="App">
      <Sidebar onMenuChanged={onMenuChanged} selected={currentMenu}></Sidebar>
      {(currentMenu === 'Checklist') && <Checklist>Checklist</Checklist>}
      {(currentMenu === 'Guests') && <GuestList>Convidados</GuestList>}
    </div>
  );
}

export default App;
