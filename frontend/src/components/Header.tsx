import React, { useEffect, useState } from "react";
import "../styles/Header.css"
import Tabs from "../types/header";
import { useNavigate } from "react-router-dom";
import MainPaths from "../routes/paths/mainPaths";

export default function Header() {
    const [tab, setTab] = useState<Tabs>()
    const navigate = useNavigate()

    useEffect(() => {
        const currentUrl = window.location.href
        const relativeUrl = currentUrl.replace(`http://localhost:3000`, "")
        if(relativeUrl === MainPaths.HOME) {
            setTab(Tabs.HOME)
        } else if(relativeUrl === MainPaths.ABOUT) {
            setTab(Tabs.ABOUT)
        } else if(relativeUrl === MainPaths.CONTACT) {
            setTab(Tabs.CONTACT)
        }
    }, []);

    const handleSelectTab = (tab: Tabs) => {
        setTab(tab)

        if(tab === Tabs.HOME) {
            return navigate(MainPaths.HOME);
        } else if (tab === Tabs.ABOUT) {
            return navigate(MainPaths.ABOUT);
        }
    }

    return (
        <>
            <div className="topnav" id="myTopnav">
                <a className={tab === Tabs.HOME ? 'active' : ''} onClick={() => handleSelectTab(Tabs.HOME)}>Home</a>
                <a className={tab === Tabs.CONTACT ? 'active' : ''} onClick={() => handleSelectTab(Tabs.CONTACT)}>Contact</a>
                <a className={tab === Tabs.ABOUT ? 'active' : ''} onClick={() => handleSelectTab(Tabs.ABOUT)}>About</a>
                <a className="icon">
                    <i className="fa fa-bars"></i>
                </a>
            </div>
        </>
    )
}