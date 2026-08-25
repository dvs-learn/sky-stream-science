"use client";

import { useEffect, useMemo, useState } from "react";

type Lab = "water" | "weather" | "climate";

const phaseNotes = {
  evaporation: { label: "Evaporation", cue: "Liquid → gas", note: "Energy from the Sun warms liquid water. Some molecules escape into the air as water vapor.", color: "#f4b942" },
  transpiration: { label: "Transpiration", cue: "Plants release vapor", note: "Plants take in liquid water through their roots and release water vapor from tiny openings in their leaves.", color: "#2ca58d" },
  condensation: { label: "Condensation", cue: "Gas → liquid", note: "Water vapor cools high in the atmosphere and gathers into tiny liquid droplets that form clouds.", color: "#f47963" },
  precipitation: { label: "Precipitation", cue: "Water falls", note: "When cloud droplets or ice crystals become heavy enough, water returns to Earth as rain, snow, sleet, or hail.", color: "#4169e1" },
  collection: { label: "Collection", cue: "Water gathers", note: "Water collects in oceans, rivers, lakes, soil, groundwater, and ice before continuing through the cycle.", color: "#2ca58d" },
} as const;

type Phase = keyof typeof phaseNotes;

const stationData = {
  coast: { place: "Coastal Plain", temp: 78, humidity: 82, pressure: 1006, wind: "SE · 18 mph", sky: "Dark clouds moving inland", accent: "#4169e1" },
  piedmont: { place: "Piedmont", temp: 72, humidity: 56, pressure: 1018, wind: "W · 6 mph", sky: "Scattered fair-weather clouds", accent: "#2ca58d" },
  mountains: { place: "Mountains", temp: 61, humidity: 68, pressure: 1012, wind: "NW · 12 mph", sky: "Clouds building near ridges", accent: "#f47963" },
} as const;

type Region = keyof typeof stationData;

const questions = [
  {
    prompt: "A puddle becomes smaller on a warm, sunny afternoon. Which process moved most of that water into the air?",
    options: ["Condensation", "Evaporation", "Precipitation", "Collection"],
    answer: 1,
    explanation: "Sunlight supplied energy, allowing liquid water to become water vapor.",
  },
  {
    prompt: "Which evidence would be most useful for predicting tomorrow's weather?",
    options: ["One year's average temperature", "Today's air pressure, clouds, and wind", "The town's elevation only", "A climate map from 30 years ago"],
    answer: 1,
    explanation: "A forecast uses current atmospheric measurements and patterns moving toward the area.",
  },
  {
    prompt: "Which statement describes climate instead of weather?",
    options: ["It is raining this morning.", "Wind gusts reached 20 mph today.", "Winters are usually milder near the coast.", "A cold front arrives tonight."],
    answer: 2,
    explanation: "Climate describes typical patterns measured over a long period of time.",
  },
  {
    prompt: "How can the Atlantic Ocean influence weather and climate along North Carolina's coast?",
    options: ["It stops all wind.", "It adds moisture and can make temperature changes milder.", "It prevents clouds from forming.", "It makes every day the same temperature."],
    answer: 1,
    explanation: "Ocean water heats and cools slowly, adds moisture to the air, and can help create local sea breezes.",
  },
  {
    prompt: "Water vapor cools and forms tiny droplets in a cloud. What happened?",
    options: ["Evaporation", "Runoff", "Condensation", "Collection"],
    answer: 2,
    explanation: "Condensation is the change from water vapor (gas) to liquid droplets.",
  },
] as const;

function Challenge() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const current = questions[index];

  const choose = (optionIndex: number) => {
    if (choice !== null) return;
    setChoice(optionIndex);
    if (optionIndex === current.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setChoice(null);
  };

  const reset = () => {
    setIndex(0);
    setChoice(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <section className="challenge-section" id="challenge" aria-labelledby="challenge-title">
      <div className="challenge-intro">
        <p className="eyebrow">Field check · 5 questions</p>
        <h2 id="challenge-title">Ready to prove your forecast?</h2>
        <p>Use evidence from the labs. You&apos;ll get a scientific explanation after every answer.</p>
        <div className="standard-chips" aria-label="North Carolina standards addressed"><span>ESS.5.1.1</span><span>ESS.5.1.2</span><span>ESS.5.1.3</span><span>ESS.5.1.4</span></div>
      </div>

      <div className="quiz-card">
        {!finished ? (
          <>
            <div className="quiz-progress"><span>QUESTION {index + 1} / {questions.length}</span><div><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div></div>
            <h3>{current.prompt}</h3>
            <div className="quiz-options">
              {current.options.map((option, optionIndex) => {
                const revealed = choice !== null;
                const state = revealed && optionIndex === current.answer ? "correct" : revealed && optionIndex === choice ? "incorrect" : "";
                return <button key={option} className={state} disabled={revealed} onClick={() => choose(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>;
              })}
            </div>
            {choice !== null && <div className="answer-note" role="status"><strong>{choice === current.answer ? "Correct — evidence wins!" : "Good try — adjust your model."}</strong><p>{current.explanation}</p><button onClick={next}>{index === questions.length - 1 ? "See my result" : "Next question"} →</button></div>}
          </>
        ) : (
          <div className="result-card" role="status">
            <span className="result-score">{score}/{questions.length}</span>
            <h3>{score === 5 ? "Forecast expert!" : score >= 3 ? "Strong field work!" : "Keep observing!"}</h3>
            <p>{score === 5 ? "You connected water-cycle processes, weather evidence, and climate patterns." : "Revisit a lab, change a variable, and try the field check again."}</p>
            <button onClick={reset}>Try again</button>
          </div>
        )}
      </div>
    </section>
  );
}

function WaterLab() {
  const [phase, setPhase] = useState<Phase>("evaporation");
  const [heat, setHeat] = useState(62);
  const active = phaseNotes[phase];

  return (
    <section className="lab-grid" aria-labelledby="water-title">
      <div className="lab-copy">
        <p className="eyebrow">Lab 01 · Use a model</p>
        <h2 id="water-title">Follow one drop through the cycle.</h2>
        <p className="lede">Select each process, then change the Sun&apos;s energy to see what speeds up evaporation.</p>
        <div className="phase-list" role="list" aria-label="Water cycle processes">
          {(Object.keys(phaseNotes) as Phase[]).map((key, index) => (
            <button key={key} className={`phase-button ${phase === key ? "active" : ""}`} onClick={() => setPhase(key)} style={{ "--phase-color": phaseNotes[key].color } as React.CSSProperties} aria-pressed={phase === key}>
              <span className="number">0{index + 1}</span>
              <span><strong>{phaseNotes[key].label}</strong><small>{phaseNotes[key].cue}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="model-card water-model">
        <div className="model-topline"><span>Interactive model</span><span className="live-dot">● LIVE</span></div>
        <div className={`cycle-stage phase-${phase}`}>
          <div className="sun" aria-hidden="true"><span>☀</span></div>
          <div className="cloud" aria-hidden="true"><span>☁</span></div>
          <div className="cycle-arrow arrow-up" aria-hidden="true">↑ ↑ ↑</div>
          <div className="cycle-arrow arrow-down" aria-hidden="true">↓ ↓ ↓</div>
          <div className="mountains" aria-hidden="true">▲▲</div>
          <div className="water-band" aria-hidden="true">≈ ≈ ≈ ≈</div>
          <div className="drop-marker" aria-hidden="true">●</div>
          <div className="stage-label label-air">ATMOSPHERE</div>
          <div className="stage-label label-earth">EARTH&apos;S SURFACE</div>
        </div>
        <div className="phase-explanation" style={{ borderColor: active.color }} aria-live="polite">
          <div><span className="phase-dot" style={{ background: active.color }} /><strong>{active.label}</strong></div>
          <p>{active.note}</p>
        </div>
        <label className="range-control">
          <span><strong>Sun&apos;s energy</strong><output>{heat}%</output></span>
          <input type="range" min="10" max="100" value={heat} onChange={(event) => setHeat(Number(event.target.value))} />
          <small>{heat > 70 ? "Faster evaporation: more water molecules gain enough energy to enter the air." : heat > 40 ? "Steady evaporation is adding water vapor to the atmosphere." : "Slower evaporation: fewer molecules have enough energy to escape."}</small>
        </label>
      </div>
    </section>
  );
}

function WeatherLab() {
  const [region, setRegion] = useState<Region>("coast");
  const [forecast, setForecast] = useState<"storm" | "fair" | "cool" | null>(null);
  const station = stationData[region];
  const correct = region === "coast" ? "storm" : region === "piedmont" ? "fair" : "cool";

  return (
    <section className="lab-grid" aria-labelledby="weather-title">
      <div className="lab-copy">
        <p className="eyebrow">Lab 02 · Analyze data</p>
        <h2 id="weather-title">Read the instruments. Build a forecast.</h2>
        <p className="lede">Weather is what the atmosphere is doing now. Compare measurements from three practice stations in North Carolina.</p>
        <div className="region-tabs" role="tablist" aria-label="North Carolina practice stations">
          {(Object.keys(stationData) as Region[]).map((key) => (
            <button key={key} role="tab" aria-selected={region === key} onClick={() => { setRegion(key); setForecast(null); }}>{stationData[key].place}</button>
          ))}
        </div>
        <div className="instrument-grid">
          <article><span>Temperature</span><strong>{station.temp}°F</strong><small>thermometer</small></article>
          <article><span>Humidity</span><strong>{station.humidity}%</strong><small>hygrometer</small></article>
          <article><span>Air pressure</span><strong>{station.pressure}</strong><small>mb · barometer</small></article>
          <article><span>Wind</span><strong className="wind-value">{station.wind}</strong><small>anemometer + vane</small></article>
        </div>
      </div>

      <div className="model-card forecast-card" style={{ "--station-accent": station.accent } as React.CSSProperties}>
        <div className="model-topline"><span>Station report</span><span>Practice data</span></div>
        <div className="station-heading"><span className="station-pin">◎</span><div><small>NORTH CAROLINA</small><h3>{station.place}</h3></div></div>
        <div className="sky-note"><span>OBSERVATION</span><p>{station.sky}</p></div>
        <div className="forecast-question">
          <h3>What is the best short-term forecast?</h3>
          <div className="forecast-options">
            <button onClick={() => setForecast("storm")} aria-pressed={forecast === "storm"}>Rain or storm likely</button>
            <button onClick={() => setForecast("fair")} aria-pressed={forecast === "fair"}>Fair, mild weather</button>
            <button onClick={() => setForecast("cool")} aria-pressed={forecast === "cool"}>Cool and breezy</button>
          </div>
          {forecast && <div className={`forecast-feedback ${forecast === correct ? "correct" : "try"}`} role="status"><strong>{forecast === correct ? "Strong forecast!" : "Recheck the clues."}</strong><p>{forecast === correct ? "You used several measurements together—the way meteorologists do." : "Look at pressure, humidity, wind, and the sky observation as a group."}</p></div>}
        </div>
      </div>
    </section>
  );
}

function ClimateLab() {
  const [factor, setFactor] = useState<"season" | "elevation" | "ocean">("season");
  const rows = useMemo(() => factor === "season" ? [
    { place: "Typical July", value: 84, note: "many years of summer data" },
    { place: "Typical January", value: 46, note: "many years of winter data" },
  ] : factor === "elevation" ? [
    { place: "High mountain", value: 42, note: "higher elevation · cooler" },
    { place: "Piedmont", value: 64, note: "lower elevation · warmer" },
  ] : [
    { place: "Coastal town", value: 58, note: "near ocean · milder" },
    { place: "Inland town", value: 42, note: "farther inland · bigger swings" },
  ], [factor]);

  return (
    <section className="lab-grid" aria-labelledby="climate-title">
      <div className="lab-copy">
        <p className="eyebrow">Lab 03 · Spot a pattern</p>
        <h2 id="climate-title">Climate is a long-term story.</h2>
        <p className="lede">Weather can change by the hour. Climate describes typical conditions measured over many years.</p>
        <div className="time-comparison">
          <article><span className="time-tag coral">TODAY</span><h3>Weather</h3><p>“A thunderstorm may arrive this afternoon.”</p></article>
          <span className="versus">≠</span>
          <article><span className="time-tag blue">MANY YEARS</span><h3>Climate</h3><p>“Summers in this region are usually warm and humid.”</p></article>
        </div>
        <div className="factor-toggle" role="group" aria-label="Choose a climate factor">
          <button className={factor === "season" ? "active" : ""} onClick={() => setFactor("season")}>Seasons</button>
          <button className={factor === "elevation" ? "active" : ""} onClick={() => setFactor("elevation")}>Elevation</button>
          <button className={factor === "ocean" ? "active" : ""} onClick={() => setFactor("ocean")}>Atlantic Ocean</button>
        </div>
      </div>

      <div className="model-card climate-card">
        <div className="model-topline"><span>Pattern finder</span><span>Illustrative averages</span></div>
        <h3>{factor === "season" ? "Same place, different seasons" : factor === "elevation" ? "Same day, different elevations" : "Winter: coast compared with inland"}</h3>
        <div className="bar-chart" aria-label="Illustrative temperature comparison">
          {rows.map((row) => <div className="bar-row" key={row.place}><div><strong>{row.place}</strong><small>{row.note}</small></div><div className="bar-track"><span style={{ width: `${row.value}%` }} /></div><output>{row.value}°F</output></div>)}
        </div>
        <div className="pattern-callout"><span aria-hidden="true">↳</span><p>{factor === "season" ? "Daily weather changes, but repeated seasonal patterns appear when scientists compare data collected over many years." : factor === "elevation" ? "As elevation increases, air temperature usually decreases. That helps make mountain climates cooler." : "The Atlantic Ocean heats and cools slowly. It can make coastal temperatures milder, add moisture, and create local sea breezes in North Carolina."}</p></div>
        <p className="data-note">Numbers are simplified practice data created for comparing patterns—not a live forecast.</p>
      </div>
    </section>
  );
}

export default function Home() {
  const [activeLab, setActiveLab] = useState<Lab>("water");
  const [visited, setVisited] = useState<Lab[]>(["water"]);

  useEffect(() => {
    const saved = window.localStorage.getItem("sky-stream-visited");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Lab[];
        setVisited(parsed.filter((lab) => ["water", "weather", "climate"].includes(lab)));
      } catch {
        window.localStorage.removeItem("sky-stream-visited");
      }
    }
  }, []);

  const openLab = (lab: Lab) => {
    setActiveLab(lab);
    setVisited((current) => {
      const next = current.includes(lab) ? current : [...current, lab];
      window.localStorage.setItem("sky-stream-visited", JSON.stringify(next));
      return next;
    });
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Sky and Stream Science Lab home"><span className="brand-mark" aria-hidden="true">S²</span><span><strong>SKY &amp; STREAM</strong><small>SCIENCE LAB</small></span></a>
        <div className="header-meta"><div className="progress-pill" aria-label={`${visited.length} of 3 labs explored`}><span style={{ width: `${(visited.length / 3) * 100}%` }} /><strong>{visited.length}/3 LABS</strong></div><div className="grade-stamp"><span>NC</span><strong>GRADE 5</strong></div></div>
      </header>
      <section className="intro" id="top"><div><p className="eyebrow">Earth systems field desk</p><h1>Think like a <em>weather scientist.</em></h1></div><p>Change a variable, compare evidence, and explain the patterns connecting water, weather, and climate.</p></section>
      <nav className="lab-nav" aria-label="Science labs">
        <button className={activeLab === "water" ? "active" : ""} onClick={() => openLab("water")}><span className="nav-index">01</span><span><strong>Water Cycle</strong><small>Model the movement</small></span></button>
        <button className={activeLab === "weather" ? "active" : ""} onClick={() => openLab("weather")}><span className="nav-index">02</span><span><strong>Weather Lab</strong><small>Read the data</small></span></button>
        <button className={activeLab === "climate" ? "active" : ""} onClick={() => openLab("climate")}><span className="nav-index">03</span><span><strong>Climate Clues</strong><small>Find the pattern</small></span></button>
      </nav>
      <div className="lab-shell">{activeLab === "water" && <WaterLab />}{activeLab === "weather" && <WeatherLab />}{activeLab === "climate" && <ClimateLab />}</div>
      <Challenge />
      <footer>
        <div><strong>Built for curious fifth graders.</strong><p>Aligned to the Earth&apos;s Systems strand in the 2023 North Carolina K–12 Science Standards.</p></div>
        <a href="https://www.dpi.nc.gov/districts-schools/classroom-resources/office-teaching-and-learning/standard-course-study/science/standard-course-study-supporting-resources" target="_blank" rel="noreferrer">View NCDPI science resources ↗</a>
      </footer>
    </main>
  );
}
