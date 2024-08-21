import { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import editIcon from "./edit-text.png";

function App() {
  const [showEditPanle, setShowEditPanel] = useState(false);
  function reducer(state, action) {
    switch (action.type) {
      case "calcFinalDate":
        let date = new Date(
          new Date(action.payload).getTime() + 90 * 24 * 60 * 60 * 1000
        );
        let finalDate = `${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date
          .getDate()
          .toString()
          .padStart(2, "0")}/${date.getFullYear()}`;
        let time = `${
          new Date(action.payload).getHours() > 11
            ? new Date(action.payload).getHours() - 12
            : new Date(action.payload).getHours()
        }:${
          new Date(action.payload).getMinutes() < 10
            ? "0" + new Date(action.payload).getMinutes()
            : new Date(action.payload).getMinutes()
        } ${new Date(action.payload).getHours() > 11 ? "PM" : "AM"}`;
        time = time[0] > 1 ? "0" + time : time;
        return {
          ...state,
          initialDate: action.initialDate,
          finalDate: finalDate,
          time: time,
        };
      case "calcTimeRemaining":
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
          ...state,
          daysRemaining: daysRemaining,
          hoursRemaining: hoursRemaining,
          minutesRemaining: minutesRemaining,
          secondsRemaining: secondsRemaining,
        };
      case "calcTimePassed":
      default:
        throw new Error("Unkown action.type");
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

  const [
    {
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      secondsRemaining,
      initialDate,
      finalDate,
      time,
    },
    dispatch,
  ] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("initial-state")) || {
      initialDate: currentDate,
      finalDate: "",
      time: "",
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0,
    }
  );

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("initial-state")))
      dispatch({ type: "calcFinalDate", payload: new Date() });
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
            {Number(daysRemaining) < 10 && Number(daysRemaining) > 0
              ? "0" + Math.floor(Number(daysRemaining))
              : Math.floor(Number(daysRemaining))}
          </p>
          <p>Days</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{
                  width: 100 - (Number(secondsRemaining) * 100) / 90 + "%",
                }}
              ></div>
              <div className="perc">
                {Math.floor(100 - (Number(secondsRemaining) * 100) / 90)}%
              </div>
            </div>
          </div>
        </div>
        <div className="hours counter">
          <p>
            {Number(hoursRemaining) < 10 && Number(hoursRemaining) > 0
              ? "0" + Math.floor(Number(hoursRemaining))
              : Math.floor(Number(hoursRemaining))}
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
            {Number(minutesRemaining) < 10 && Number(minutesRemaining) > 0
              ? "0" + Math.floor(Number(minutesRemaining))
              : Math.floor(Number(minutesRemaining))}
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
            {Number(secondsRemaining) < 10 && Number(secondsRemaining)
              ? "0" + Math.floor(Number(secondsRemaining))
              : Math.floor(Number(secondsRemaining))}
          </p>
          <p>Seconds</p>
          <div className="proggress-bar">
            <div className="bar">
              <div
                className="proggress"
                style={{
                  width: 100 - (Number(secondsRemaining) * 100) / 60 + "%",
                }}
              ></div>
              <div className="perc">
                {Math.ceil(100 - (Number(secondsRemaining) * 100) / 60)}%
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
