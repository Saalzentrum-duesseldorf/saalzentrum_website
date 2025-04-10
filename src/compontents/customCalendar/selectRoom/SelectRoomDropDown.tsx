import React, { useState } from "react";
import "./SelectRoomDropDown.scss";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

interface SelectRoomDropDownProps {
  onRoomChange: (room: string) => void;
  initialRoom?: string;
}

const SelectRoomDropDown: React.FC<SelectRoomDropDownProps> = ({ 
  onRoomChange, 
  initialRoom = "" 
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>(initialRoom);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
    onRoomChange(room);
  };

  return (
    <div className="select-room-dropdown">
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="down">
        <DropdownToggle caret className="room-dropdown-toggle">
          {selectedRoom === "" ? "Raum" : selectedRoom}
        </DropdownToggle>
        <DropdownMenu container="body" className="room-dropdown-menu">
          <DropdownItem onClick={() => handleRoomSelect("")}>Alle Räume</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Saal 1")}>Saal 1</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Nebenraum 1B")}>Nebenraum 1B</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Saal 2")}>Saal 2</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Nebenraum 2B")}>Nebenraum 2B</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Saal 3")}>Saal 3</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Nebenraum 3B")}>Nebenraum 3B</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Saal 4")}>Saal 4</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Nebenraum 4B")}>Nebenraum 4B</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Besprechungsraum 2OG")}>Besprechungsraum 2OG</DropdownItem>
          <DropdownItem onClick={() => handleRoomSelect("Sonstiges")}>Sonstiges</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default SelectRoomDropDown;