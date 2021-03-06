import express from "express";
import cors from "cors"
import { Low, JSONFile } from 'lowdb'
import { uuid } from 'uuidv4';
import _ from 'lodash';

const app = express()

app.use(cors());
app.use(express.json())

const db = new Low(new JSONFile('db/database.json'))
await db.read();

app.get('/guests', (req, res) => {
    res.send(db.data.guests);
})

app.post('/guests', (req, res) => {
    const name = req.body.name;
    db.data.guests.push({name: name});
    db.write();
    res.send(db.data.guests);
})

app.get('/checklist', (req, res) => {
  res.send(db.data.checklist);
})

app.post('/checklist', (req, res) => {
  let newChecklistItem = createNewChecklistItem(req.body);
  db.data.checklist.push(newChecklistItem);
  db.write();
  res.send(newChecklistItem);
})

app.delete('/checklist/:id', (req, res) => {
  _.remove(db.data.checklist, {id: req.params.id});
  db.write();
  res.send(db.data.checklist);
})

function createNewChecklistItem(body){
  let newChecklistItem = {
    id: uuid(),
    nome: body.nome,
    valor_previsto: Number(body.valor_previsto)
  }
  if (body.contratado) {
    newChecklistItem.fornecedor = body.fornecedor;
    newChecklistItem.valor_real = Number(body.valor_real);
    newChecklistItem.valor_pago = Number(body.valor_pago);
    newChecklistItem.quitado = newChecklistItem.valor_real === newChecklistItem.valor_pago
    newChecklistItem.contratado = true;
  } else {
    newChecklistItem.contratado = false;
  }
  return newChecklistItem;
}

app.listen(3001, () => {
  console.log(`Example app listening on port 3001`)
})