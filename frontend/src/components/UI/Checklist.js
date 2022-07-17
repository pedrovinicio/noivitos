import React, {useState, useEffect} from "react";
import classes from './Checklist.module.css';
import Card from "./Card";
import api from "../../services/Api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from "./ConfirmationModal";
import _ from 'lodash';
import Button from "./Button";

const Checklist = () => {

    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({});
    const [deleteConfirmation, setDeleteConfirmation] = useState()
    const [summary, setSummary] = useState({})

    // Fetch all services
    useEffect(() => {
        function fetchChecklist() {
            api
                .get("/checklist")
                .then((response) => {
                    setItems(response.data);
                    setSummary({
                        budget_prediction: (_.reduce(items, (sum, item) => sum + item.valor_previsto, 0)).toFixed(2),
                        budget_real: (_.reduce(items, (sum, item) => sum + (item.valor_real ? item.valor_real : 0), 0)).toFixed(2),
                        budget_saved: (_.reduce(items, (sum, item) => {
                            return sum + (item.contratado ? (Number(item.valor_previsto)-Number(item.valor_real)) : 0)
                        }, 0)).toFixed(2),
                        total_paid: (_.reduce(items, (sum, item) => sum + (item.valor_pago ? item.valor_pago : 0), 0)).toFixed(2),
                        items_settled: _.reduce(items, (sum, item) => sum + (item.contratado ? 1 : 0), 0),
                        items_paid: _.reduce(items, (sum, item) => sum + (item.quitado ? 1 : 0), 0),
                        items_total: items.length
                    })
                })
                .catch((err) => {
                console.error("ops! ocorreu um erro no fetchChecklist" + err);
            });
        }

        fetchChecklist();
    }, [items]);
  
    

    function onAddChecklistItem(e) {
        e.preventDefault();
        api
            .post("/checklist", newItem)
            .then(() => window.location.reload())
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    }

    function openDeleteConfirmationModal(e, item) {
        e.preventDefault();
        setDeleteConfirmation({
            title: "Remover?",
            message: "Voce tem certeza que deseja remover " + item.nome + "?",
            item: item
        });
    }

    function cancelDeleteConfirmationModal(){
        setDeleteConfirmation(null);
    }

    function onDeleteChecklistItem(item){
        api
            .delete(`/checklist/${item.id}`)  
            .then(() => window.location.reload())
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
        <div>
            <Card className={classes.checklist}>
                <div className={classes.summaryTitle}>Resumo do checklist</div>
                <div className={classes.summaryRow}>
                    <div className={classes.summaryTextContainerLeft}>
                        <span style={{ fontWeight: "bold" }}>Orcamento previsto:</span>
                        <span style={{ marginLeft: "2rem" }}>R${summary.budget_prediction}</span>
                    </div>
                    <div className={classes.summaryTextContainerRight}>
                        <span style={{ fontWeight: "bold" }}>Orcamento real:</span>
                        <span style={{ marginLeft: "2rem" }}>R${summary.budget_real}</span>
                    </div>
                </div>
                <div className={classes.summaryRow}>
                    <div className={classes.summaryTextContainerLeft}>
                        <span style={{ fontWeight: "bold" }}>Total pago:</span>
                        <span style={{ marginLeft: "5.8rem" }}>R${summary.total_paid}</span>
                    </div>
                    <div className={classes.summaryTextContainerRight}>
                        <span style={{ fontWeight: "bold" }}>Economizado:</span>
                        <span style={{ marginLeft: "2.9rem" }}>R${summary.budget_saved}</span>
                         
                    </div>
                </div>
                <div className={classes.summaryRowLast}>
                    <div className={classes.summaryTextContainerLeft}>
                        <span style={{ fontWeight: "bold" }}>Itens contratados:</span>
                        <span style={{ marginLeft: "3rem" }}>{summary.items_settled}/{summary.items_total}</span>
                    </div>
                    <div className={classes.summaryTextContainerRight}>
                        <span style={{ fontWeight: "bold" }}>Itens quitados:</span>
                        <span style={{ marginLeft: "2.7rem" }}>{summary.items_paid}/{summary.items_total}</span>
                    </div>
                </div>
            </Card>
            <Card className={classes.checklist}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "left" }}>Descricao</th>
                            <th style={{ textAlign: "left" }}>Fornecedor</th>
                            <th style={{ textAlign: "right" }}>Previsto</th>
                            <th style={{ textAlign: "right" }}>Real</th>
                            <th style={{ textAlign: "right" }}>Diferenca</th>
                            <th style={{ textAlign: "right" }}>Pago</th>
                            <th>Contratado</th>
                            <th>Quitado</th>
                            <th>Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) =>
                            <tr key={item.id}>
                                <td style={{ width: "200px", fontWeight: "bold" }}>{item.nome}</td>
                                <td style={{ width: "150px" }}>{item.fornecedor}</td>
                                <td>{item.valor_previsto && <div style={{ textAlign: "right" }}>R${item.valor_previsto.toFixed(2)}</div>}</td>
                                <td>{item.valor_real && <div style={{ textAlign: "right" }}>R${item.valor_real.toFixed(2)}</div>}</td>
                                <td>
                                    {item.contratado && (item.valor_previsto-item.valor_real >= 0) &&
                                        <div style={{ color: "green", textAlign: "right"  }}>
                                            R${Math.abs(item.valor_previsto-item.valor_real).toFixed(2)}
                                        </div>
                                    }
                                    {item.contratado && (item.valor_previsto-item.valor_real < 0) &&
                                        <div style={{ color: "red", textAlign: "right" }}>
                                        R${Math.abs(item.valor_previsto-item.valor_real).toFixed(2)}
                                        </div>
                                    }
                                </td>
                                <td>{item.valor_pago && <div style={{ textAlign: "right" }}>R${item.valor_pago.toFixed(2)}</div>}</td>
                                {item.contratado && <td className={classes.iconResolved}><FontAwesomeIcon icon={faSquareCheck} size="lg"/></td>}
                                {!item.contratado && <td className={classes.iconPending}><FontAwesomeIcon icon={faSquareXmark} size="lg"/></td>}
                                {item.quitado && <td className={classes.iconResolved}><FontAwesomeIcon icon={faSquareCheck} size="lg"/></td>}
                                {!item.quitado && <td className={classes.iconPending}><FontAwesomeIcon icon={faSquareXmark} size="lg"/></td>}
                                <td style={{ display: "flex", width: "150px" }} className={classes.actionButtons}>
                                    <Button>Editar</Button>
                                    <Button onClick={(e) => openDeleteConfirmationModal(e, item)}>Excluir</Button>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td>
                                <input className={classes.tableInput} value={newItem.nome} onChange={evt => updateNewItem(evt, 'nome')}></input>
                            </td>
                            <td>
                                <input className={classes.tableInput} value={newItem.descricao} onChange={evt => updateNewItem(evt, 'fornecedor')}></input>
                            </td>
                            <td>
                                <input className={classes.tableInput} value={newItem.valor_previsto} onChange={evt => updateNewItem(evt, 'valor_previsto')}></input>
                            </td>
                            <td>
                                <input className={classes.tableInput} value={newItem.valor_real} onChange={evt => updateNewItem(evt, 'valor_real')}></input>
                            </td>
                            <td></td>
                            <td>
                                <input className={classes.tableInput} value={newItem.valor_pago} onChange={evt => updateNewItem(evt, 'valor_pago')}></input>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <input type="checkbox" style={{ width: "17px", height: "17px" }} checked={newItem.contratado} onChange={evt => onCheckboxChange(evt, 'contratado')}></input>
                            </td>
                            <td></td>
                            <td className={classes.actionButtons}>
                                <Button onClick={onAddChecklistItem}>Adicionar</Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {deleteConfirmation && <ConfirmationModal title={deleteConfirmation.title} message={deleteConfirmation.message} item={deleteConfirmation.item} onConfirm={onDeleteChecklistItem} onCancel={cancelDeleteConfirmationModal}></ConfirmationModal>}
            </Card>
        </div>
        
    );
};

export default Checklist;