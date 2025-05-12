import React from "react";
import "./Menu.css";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Menu = (props: Props) => {
  return (
    <div className="menu">
      <h3 className="menutext">こんにちわ、メニューを選択してください。</h3>
      <div className="menubuttons">
        <button className="qrbutton" onClick={() => props.setIsOpen(true)}>
          QR読込
        </button>
      </div>
    </div>
  );
};

export default Menu;
