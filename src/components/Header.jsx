import "../styles/Header.css";
import menu from "../assets/hamburger-menu-icon.svg";
import { useEffect } from "react";

function Header() {
    useEffect(() => {
        function closeNavOnOutsideClick(event) {
            const navbar = document.querySelector(".navbar-container");
            const hamburger = event.target.closest(".hamburger-menu");

            if (!event.target.closest(".navbar-container") && !hamburger) {
                navbar?.classList.remove("navbar-open");
            }
        }

        document.addEventListener("click", closeNavOnOutsideClick);

        return () => document.removeEventListener("click", closeNavOnOutsideClick);
    }, []);

    function displayNav() {
        const navbar = document.querySelector(".navbar-container");
        navbar?.classList.toggle("navbar-open");
    }

    return (
        <div className="header-container">
            <button onClick={displayNav} className="hamburger-menu">
                <img src={menu} />
            </button>

            <p>
                Academic Performance Evaluation System
            </p>
        </div>
    );
}

export default Header;