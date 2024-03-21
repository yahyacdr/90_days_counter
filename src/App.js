import { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import editIcon from "./edit-text.png";

function App() {
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
      }:${new Date(action.initialDate).getMinutes()}`;
      return {
        initialDate: action.initialDate,
        finalDate: finalDate,
        time: time,
      };
    } else if (action.type === "calcRemainingDays") {
    }
  }

  let currentDate = `${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${new Date()
    .getDate()
    .toString()
    .padStart(2, "0")}/${new Date().getFullYear()}`;
  let currentTime = `${
    new Date(currentDate).getHours() > 11
      ? new Date(currentDate).getHours() - 12
      : new Date(currentDate).getHours()
  }:${new Date(currentDate).getMinutes()}`;

  const [{ initialDate, finalDate, time }, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("date-range")) || {
      initialDate: currentDate,
      finalDate: "",
      time: currentTime,
    }
  );
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
        <TargetDate
          dispatcher={dispatch}
          date={initialDate}
          finalDate={finalDate}
          time={time}
        />
      </Header>
      <Main finalDate={finalDate} initialDate={initialDate}></Main>
      <Footer></Footer>
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

function TargetDate({ date, finalDate, dispatcher, time }) {
  const iniDateInput = useRef();
  const targetTime = useRef(
    `${finalDate} ${+time[0] > 1 ? "0" + time : time} ${
      new Date(date).getHours() > 11 ? "PM" : "AM"
    }`
  );

  function calcDate(e) {
    dispatcher({ type: "calcDate", initialDate: e.target.value });
  }
  return (
    <div className="date-container">
      <input
        type="datetime-local"
        onChange={calcDate}
        value={date}
        ref={iniDateInput}
      />
      <div className="line"></div>
      <p>{targetTime.current}</p>
    </div>
  );
}

function Main({ finalDate, initialDate }) {
  function reducer(state, action) {
    const dateInitial = new Date(action.initialDate);
    const date = new Date();
    date.setHours(dateInitial.getHours());
    date.setMinutes(dateInitial.getMinutes());
    date.setSeconds(dateInitial.getSeconds());
    const dateNow = new Date();
    const timeDiff = (date - dateNow) / 1000;
    const hoursRemaining = Math.floor(timeDiff / (60 * 60));
    const minutesRemaining =
      59 - -Math.floor(date.getMinutes() - dateNow.getMinutes()).toFixed(0);
    const secondsRemaining = 59 - -(date.getSeconds() - dateNow.getSeconds());
    const daysRemaining = Math.ceil(
      (new Date(finalDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

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
          <p>{+daysRemaining < 10 ? "0" + daysRemaining : daysRemaining}</p>
          <p>Days</p>
          <div className="proggress-bar">
            <div className="bar">
              <div className="proggress"></div>
              <div className="perc">60%</div>
            </div>
          </div>
        </div>
        <div className="hours counter">
          <p>{+hoursRemaining < 10 ? "0" + hoursRemaining : hoursRemaining}</p>
          <p>Hours</p>
          <div className="proggress-bar">
            <div className="bar">
              <div className="proggress"></div>
              <div className="perc">60%</div>
            </div>
          </div>
        </div>
        <div className="minutes counter">
          <p>
            {+minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining}
          </p>
          <p>Minutes</p>
          <div className="proggress-bar">
            <div className="bar">
              <div className="proggress"></div>
              <div className="perc">60%</div>
            </div>
          </div>
        </div>
        <div className="seconds counter">
          <p>
            {+secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining}
          </p>
          <p>Seconds</p>
          <div className="proggress-bar">
            <div className="bar">
              <div className="proggress"></div>
              <div className="perc">60%</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <div className="edit-btn">
        <button>
          <img src={editIcon} alt="" />
        </button>
      </div>
    </footer>
  );
}

export default App;
