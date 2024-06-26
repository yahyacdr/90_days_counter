import { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import editIcon from "./edit-text.png";

function App() {
  const [showEditPanle, setShowEditPanel] = useState(false);
  function reducer(state, action) {
    if (action.type === "calcDate") {
      let date = new Date(
        new Date(action.initialDate).getTime() + 90 * 24 * 60 * 60 * 1000
      );
      let finalDate = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date
        .getDate()
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      let time = `${
        new Date(action.initialDate).getHours() > 11
          ? new Date(action.initialDate).getHours() - 12
          : new Date(action.initialDate).getHours()
      }:${
        new Date(action.initialDate).getMinutes() < 10
          ? "0" + new Date(action.initialDate).getMinutes()
          : new Date(action.initialDate).getMinutes()
      } ${new Date(action.initialDate).getHours() > 11 ? "PM" : "AM"}`;
      time = time[0] > 1 ? "0" + time : time;
      return {
        initialDate: action.initialDate,
        finalDate: finalDate,
        time: time,
      };
    }
  }

  let currentDate = `${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${new Date()
    .getDate()
    .toString()
    .padStart(
      2,
      "0"
    )}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}`;

  const [{ initialDate, finalDate, time }, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("date-range")) || {
      initialDate: currentDate,
      finalDate: "",
      time: "",
    }
  );

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("date-range")))
      dispatch({ type: "calcDate", initialDate: new Date() });
  }, []);

  useEffect(
    function () {
      window.localStorage.setItem(
        "date-range",
        JSON.stringify({
          initialDate: initialDate,
          finalDate: finalDate,
          time: time,
        })
      );
    },
    [initialDate, finalDate, time]
  );

  return (
    <div className="app">
      <Header>
        <TargetDate date={initialDate} finalDate={finalDate} time={time} />
      </Header>
      <Main finalDate={finalDate} initialDate={initialDate} time={time}></Main>
      {showEditPanle && (
        <EditPanel
          setShowEditPanel={setShowEditPanel}
          dispatcher={dispatch}
          date={initialDate}
        ></EditPanel>
      )}
      <Footer setShowEditPanel={setShowEditPanel}></Footer>
    </div>
  );
}

function Header({ children }) {
  return (
    <header>
      <h1>90 Days</h1>
      {children}
    </header>
  );
}

function TargetDate({ date, finalDate, time }) {
  let initialDate = `${(new Date(date).getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${new Date(date)
    .getDate()
    .toString()
    .padStart(2, "0")}/${new Date(date).getFullYear()}`;

  return (
    <div className="date-container">
      <p>
        {initialDate} {time}
      </p>
      <div className="line"></div>
      <p>
        {finalDate} {time}
      </p>
    </div>
  );
}

function Main({ finalDate, initialDate, time }) {
  function reducer(state, action) {
    const dateInitial = new Date(action.initialDate);
    const ninetyDaysLater = new Date(
      dateInitial.getTime() + 90 * 24 * 60 * 60 * 1000
    );
    const currentDate = new Date();
    const differenceMs = ninetyDaysLater - currentDate;
    let daysRemaining = differenceMs / (1000 * 60 * 60 * 24);
    let hoursRemaining =
      (differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    let minutesRemaining = (differenceMs % (1000 * 60 * 60)) / (1000 * 60);
    let secondsRemaining = (differenceMs % (1000 * 60)) / 1000;

    return {
      daysRemaining: daysRemaining,
      hoursRemaining: hoursRemaining,
      minutesRemaining: minutesRemaining,
      secondsRemaining: secondsRemaining,
    };
  }

  const [
    { daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, {
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    secondsRemaining: 0,
  });

  useEffect(() => {
    dispatch({ finalDate: finalDate, initialDate: initialDate });
    const interval = setInterval(() => {
      dispatch({ finalDate: finalDate, initialDate: initialDate });
    }, 1000);
    return () => clearInterval(interval);
  }, [finalDate, initialDate]);

  return (
    <main>
      <div className="days-remaining">
        <div className="days counter">
          <p>
            {+daysRemaining < 10
              ? "0" + Math.floor(daysRemaining)
              : Math.floor(daysRemaining)}
          </p>
          <p>Days</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{ width: 100 - (daysRemaining * 100) / 90 + "%" }}
              ></div>
              <div className="perc">
                {Math.floor(100 - (daysRemaining * 100) / 90)}%
              </div>
            </div>
          </div>
        </div>
        <div className="hours counter">
          <p>
            {+hoursRemaining < 10
              ? "0" + Math.floor(hoursRemaining)
              : Math.floor(hoursRemaining)}
          </p>
          <p>Hours</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{ width: 100 - (hoursRemaining * 100) / 24 + "%" }}
              ></div>
              <div className="perc">
                {Math.floor(100 - (hoursRemaining * 100) / 24)}%
              </div>
            </div>
          </div>
        </div>
        <div className="minutes counter">
          <p>
            {+minutesRemaining < 10
              ? "0" + Math.floor(minutesRemaining)
              : Math.floor(minutesRemaining)}
          </p>
          <p>Minutes</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{ width: 100 - (minutesRemaining * 100) / 60 + "%" }}
              ></div>
              <div className="perc">
                {Math.ceil(100 - (minutesRemaining * 100) / 60)}%
              </div>
            </div>
          </div>
        </div>
        <div className="seconds counter">
          <p>
            {+secondsRemaining < 10
              ? "0" + Math.floor(secondsRemaining)
              : Math.floor(secondsRemaining)}
          </p>
          <p>Seconds</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{ width: 100 - (secondsRemaining * 100) / 60 + "%" }}
              ></div>
              <div className="perc">
                {Math.ceil(100 - (secondsRemaining * 100) / 60)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Footer({ setShowEditPanel }) {
  return (
    <footer>
      <div className="edit-btn">
        <button onClick={() => setShowEditPanel((state) => !state)}>
          <img src={editIcon} alt="" />
        </button>
      </div>
    </footer>
  );
}

function EditPanel({ setShowEditPanel, date, finalDate, dispatcher, time }) {
  const iniDateInput = useRef();

  function calcDate(e) {
    dispatcher({ type: "calcDate", initialDate: e.target.value });
  }

  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  return (
    <div className="panel">
      <div className="x-cntnr" onClick={() => setShowEditPanel(false)}>
        <div className="x-cross-1 x-cross"></div>
        <div className="x-cross-2 x-cross"></div>
      </div>
      <input
        type="datetime-local"
        onChange={calcDate}
        value={formatDateForInput(date)}
        ref={iniDateInput}
      />
    </div>
  );
}

export default App;
