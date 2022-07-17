import React from "react";
import classes from './Sidebar.module.css';
import Card from "./Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

const Sidebar = (props) => {
    return (
        <Card className={classes.sidebar}>
            <div className={`${classes.item} ${props.selected === 'Checklist' ? classes.selected : ''}`}
                 onClick={() => props.onMenuChanged('Checklist')}>
                <FontAwesomeIcon icon={faListCheck} size="lg"/><span style={{ marginLeft: "15px" }}>Checklist</span>
            </div>
            <div className={`${classes.item} ${props.selected === 'Guests' ? classes.selected : ''}`}
                 onClick={() => props.onMenuChanged('Guests')}>
                <FontAwesomeIcon icon={faPeopleGroup} size="lg"/><span style={{ marginLeft: "10px" }}>Convidados</span>
            </div>
        </Card>
    );
};

export default Sidebar;