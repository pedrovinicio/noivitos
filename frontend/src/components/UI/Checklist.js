import React, {useState, useEffect} from "react";
import classes from './Checklist.module.css';
import Card from "./Card";
import api from "../../services/Api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons'

const Checklist = () => {

    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({});

    // Fetch all services
    useEffect(() => {
        fetchChecklist();
    }, []);

    function fetchChecklist() {
        api
          .get("/checklist")
          .then((response) => setItems(response.data))
          .catch((err) => {
            console.error("ops! ocorreu um erro no fetchChecklist" + err);
        });
    }

    function onAddChecklistItem(e) {
        e.preventDefault();
        api
            .post("/checklist", newItem)
            .then((response) => setItems(response.data))
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
        setNewItem({
            nome: '',
            descricao: '',
            valor_previsto: '',
            valor_real: '',
            valor_pago: '',
            contratado: false
        });
    }

    function onDeleteChecklistItem(e, item){
        e.preventDefault();
        api
            .delete(`/checklist/${item.id}`)  
            .then((response) => setItems(response.data))
            .catch((err) => {
                alert("ops! ocorreu um erro" + err);
            });
    }

    function updateNewItem(e, property) {
        e.preventDefault();
        newItem[property] = e.target.value;
        setNewItem(newItem);
        console.log(newItem);
    }

    function onCheckboxChange(e, property) {
        newItem[property] = e.target.checked;
        setNewItem(newItem);
    }

    return (
        <Card className={classes.checklist}>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descricao</th>
                        <th>Valor Previsto</th>
                        <th>Valor Real</th>
                        <th>Diferenca</th>
                        <th>Valor pago</th>
                        <th>Contratado</th>
                        <th>Quitado</th>
                        <th>Acoes</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) =>
                        <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{item.descricao}</td>
                            <td>{item.valor_previsto && <div style={{ textAlign: "right" }}>R$ {item.valor_previsto.toFixed(2)}</div>}</td>
                            <td>{item.valor_real && <div style={{ textAlign: "right" }}>R$ {item.valor_real.toFixed(2)}</div>}</td>
                            <td>
                                {item.contratado && (item.valor_previsto-item.valor_real >= 0) &&
                                    <div style={{ color: "green", textAlign: "right"  }}>
                                        <span>R$ {Math.abs(item.valor_previsto-item.valor_real).toFixed(2)}</span>
                                    </div>
                                }
                                {item.contratado && (item.valor_previsto-item.valor_real < 0) &&
                                    <div style={{ color: "red", textAlign: "right" }}>
                                       <span>R$ {Math.abs(item.valor_previsto-item.valor_real).toFixed(2)}</span>
                                    </div>
                                }
                            </td>
                            <td>{item.valor_pago && <div style={{ textAlign: "right" }}>R$ {item.valor_pago.toFixed(2)}</div>}</td>
                            {item.contratado && <td className={classes.iconResolved}><FontAwesomeIcon icon={faSquareCheck} size="lg"/></td>}
                            {!item.contratado && <td className={classes.iconPending}><FontAwesomeIcon icon={faSquareXmark} size="lg"/></td>}
                            {item.quitado && <td className={classes.iconResolved}><FontAwesomeIcon icon={faSquareCheck} size="lg"/></td>}
                            {!item.quitado && <td className={classes.iconPending}><FontAwesomeIcon icon={faSquareXmark} size="lg"/></td>}
                            <td className={classes.actionButtons}>
                                <button>Editar</button>
                                <button onClick={(e) => onDeleteChecklistItem(e, item)}>Excluir</button>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td style={{ textAlign: "center" }}>
                            <input value={newItem.nome} onChange={evt => updateNewItem(evt, 'nome')}></input>
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <input value={newItem.descricao} onChange={evt => updateNewItem(evt, 'descricao')}></input>
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <input value={newItem.valor_previsto} onChange={evt => updateNewItem(evt, 'valor_previsto')}></input>
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <input value={newItem.valor_real} onChange={evt => updateNewItem(evt, 'valor_real')}></input>
                        </td>
                        <td></td>
                        <td style={{ textAlign: "center" }}>
                            <input value={newItem.valor_pago} onChange={evt => updateNewItem(evt, 'valor_pago')}></input>
                        </td>
                        <td style={{ textAlign: "center" }}>
                            <input type="checkbox" style={{ width: "17px", height: "17px" }} checked={newItem.contratado} onChange={evt => onCheckboxChange(evt, 'contratado')}></input>
                        </td>
                        <td></td>
                        <td className={classes.actionButtons}>
                            <button onClick={onAddChecklistItem}>Adicionar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Card>
    );
};

export default Checklist;