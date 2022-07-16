import React, {useState, useEffect} from "react";
import classes from './GuestList.module.css';
import Card from "./Card";
import api from "../../services/Api";

const GuestList = () => {

    const [guests, setGuests] = useState([]);

    // Fetch all services
    useEffect(() => {
        fetchGuests();
    }, []);

    function fetchGuests() {
        api
          .get("/guests")
          .then((response) => setGuests(response.data))
          .catch((err) => {
            console.error("ops! ocorreu um erro no getGuests" + err);
        });
    }

    return (
        <Card className={classes.guestList}>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Acoes</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) =>
                        <tr>
                            <td>{guest.id}</td>
                            <td>{guest.name}</td>
                            <td>
                                <button>Editar</button>
                                <button>Excluir</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Card>
    );
};

export default GuestList;