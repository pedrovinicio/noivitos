import React from "react";
import classes from './Sidebar.module.css';
import Card from "./Card";

const Sidebar = (props) => {
    return (
        <Card className={classes.sidebar}>
            <div className={`${classes.item} ${props.selected === 'Checklist' ? classes.selected : ''}`}
                 onClick={() => props.onMenuChanged('Checklist')}>
                Checklist
            </div>
            <div className={`${classes.item} ${props.selected === 'Guests' ? classes.selected : ''}`}
                 onClick={() => props.onMenuChanged('Guests')}>
                Convidados
            </div>
        </Card>
    );
};

export default Sidebar;