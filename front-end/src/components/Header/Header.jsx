import "./Header.css";
import { FaBell } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
    const [active, setActive] = useState("challenges")
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">V2Sec Training</h1>

        <button 
            className={`menu-btn ${active === "challenges" ? "active" : ""}`} 
            onClick={() => setActive("challenges")}   
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M5.5 11V16.25C5.5 16.4625 5.42855 16.6406 5.28565 16.7844C5.14273 16.9281 4.96565 17 4.7544 17C4.54313 17 4.36458 16.9281 4.21875 16.7844C4.07292 16.6406 4 16.4625 4 16.25V3.75C4 3.5375 4.07188 3.35937 4.21563 3.21562C4.35938 3.07187 4.5375 3 4.75 3H10.4113C10.5954 3 10.7547 3.05274 10.8892 3.15821C11.0236 3.26368 11.1092 3.39844 11.1458 3.5625L11.5 5H15.25C15.4625 5 15.6406 5.07187 15.7844 5.21562C15.9281 5.35937 16 5.5375 16 5.75V12.25C16 12.4625 15.9281 12.6406 15.7844 12.7844C15.6406 12.9281 15.4625 13 15.25 13H11.5833C11.4088 13 11.253 12.9473 11.1159 12.8418C10.9788 12.7363 10.8916 12.6016 10.8542 12.4375L10.5 11H5.5Z"
              fill="currentColor"
            />
          </svg>
          Challenges
        </button>

        <button 
            className={`menu-btn ${active === "scoreboard" ? "active" : ""}`} 
            onClick={() => setActive("scoreboard")}   
        >
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" alt="">
                <path id="Vector" d="M4 15.5H7V9H4V15.5ZM8.5 15.5H11.5V4.5H8.5V15.5ZM13 15.5H16V10.5H13V15.5ZM2.5 15.5V9C2.5 8.5875 2.64674 8.23438 2.94021 7.94063C3.23354 7.64688 3.58625 7.5 3.99833 7.5H6.99479V4.5C6.99479 4.0875 7.14146 3.73438 7.43479 3.44063C7.72826 3.14688 8.08139 3 8.49417 3H11.4965C11.9094 3 12.2628 3.14688 12.5567 3.44063C12.8507 3.73438 12.9977 4.0875 12.9977 4.5V9H16C16.4125 9 16.7656 9.14688 17.0594 9.44063C17.3531 9.73438 17.5 10.0875 17.5 10.5V15.5C17.5 15.9125 17.3531 16.2656 17.0592 16.5594C16.7653 16.8531 16.412 17 15.9994 17H3.99396C3.58132 17 3.22917 16.8531 2.9375 16.5594C2.64583 16.2656 2.5 15.9125 2.5 15.5Z" fill="currentColor"></path>
                </svg>
            Scoreboard</button>
      </div>

      <div className="header-right">
        <div className="countdown">
          Ends in <strong>555</strong> Days <strong>18</strong> Hours{" "}
          <strong>24</strong> Mins
        </div>
        <FaBell className="icon bell" />
        <div className="avatar">🧊</div>
      </div>
    </header>
  );
}
