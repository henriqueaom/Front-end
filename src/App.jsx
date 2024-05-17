import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './service/api';
import logoclose from "./img/close.svg"
import './App.css';


function App() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [erro, setErro] = useState(false);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = () => {
    setErro(false);

    if (name.trim() !== '' && date.trim() !== '') {
      if (isFutureDate(date)) {
        post();

        setReminders([...reminders, { id, name, date }]);
        setName('');
        setDate('');
      } else {
        setErro(true);
      }

    }
  };

  const isFutureDate = (dateString) => {
 
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date > today;
  };

  const getAll = () => {
    api
      .get("getall", {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then((response) => {
        setReminders(response.data);
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  const post = async () => {
    api
      .post("post",
        { Name: name, Date: date },
        { headers: { 'Accept': 'application/json' } }
      )
      .then((response) => {
        getAll();
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
  }

  const remove = (id) => {

    api.delete(`delete/${id}`, {
      headers: { 'Accept': 'application/json' },

    }).then((response) => {

      getAll();
    }).catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
  };




  return (
    <div className="App">
      <h1>Lembrete</h1>
      <div>
        <h2>Nome do lembrete</h2>
        <div className="control-group">
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Nome do lembrete"
            value={name}
            onChange={handleNameChange}
          />
          <label htmlFor="name">Nome</label>
        </div>
        <div className="control-group-date">
          <label htmlFor="date">Data do lembrete</label>

          <div className='group-date'>
            <input
              className="field-date"
              id="date"
              type="date"
              name="date"
              placeholder="Data do lembrete"
              value={date}
              onChange={handleDateChange}
            /><br />
            {erro ? <p className='erro'>data invalida</p> : null};
          </div>
        </div>
        <button onClick={handleSubmit}>Criar</button>
      </div>
      <p>Lista de lembrete</p>
      <div className="reminder-list">
        {reminders.reduce((accumulator, reminder) => {
          const existingDateIndex = accumulator.findIndex(
            (item) => item.date === reminder.date
          );
          if (existingDateIndex !== -1) {
            accumulator[existingDateIndex].names.push(reminder.name);
          } else {
            accumulator.push({ id: reminder.id, date: reminder.date, names: [reminder.name] });
          }
          return accumulator;
        }, []).map((item, index) => (

          <div key={index} className="reminder-item">
            <span>Data: {format(item.date, 'dd/MM/yyyy')}</span>
            <ul>
              {item.names.map((name, i) => (
                <li key={i}>{name} <img onClick={() => remove(item.id)} className="group-img" src={logoclose}></img></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
