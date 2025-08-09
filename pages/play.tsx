import { useEffect, useState } from 'react';

const countries: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde",
  "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China",
  "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia",
  "Zimbabwe"
];

type TopCountry = { word: string; percent: number };

function calculatePercent(word: string, letter: string): number {
  const count = word.toUpperCase().split('').filter((c: string) => c === letter.toUpperCase()).length;
  return +(100 * count / word.length).toFixed(2);
}

function getTopCountries(letter: string): TopCountry[] {
  const scored: TopCountry[] = countries.map((c: string) => ({
    word: c,
    percent: calculatePercent(c, letter)
  })).filter((entry: TopCountry) => entry.percent > 0);

  const sorted: TopCountry[] = scored.sort((a, b) => b.percent - a.percent);
  const minPercent = sorted[Math.min(4, sorted.length - 1)]?.percent || 0;

  return sorted.filter((entry: TopCountry) => entry.percent >= minPercent);
}

// --- Hint state helpers ---
function getHintStorageKey(letter: string) {
  return `percentle-${letter}-hintState`;
}

function getInitialHintState(topList: { word: string }[], correctGuesses: Set<string>) {
  // Pick a random unguessed country
  const unguessed = topList.filter(entry => !correctGuesses.has(entry.word));
  if (unguessed.length === 0) return null;
  const idx = Math.floor(Math.random() * unguessed.length);
  return {
    country: unguessed[idx].word,
    step: 1,
    revealedLetters: 0,
  };
}

export default function PlayPage() {
  const [letter, setLetter] = useState<string>('G');
  const [topList, setTopList] = useState<TopCountry[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(new Set());
  const [input, setInput] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [strikes, setStrikes] = useState<number>(0);

  // --- Hint state ---
  const [hintState, setHintState] = useState<null | {
    country: string;
    step: number;
    revealedLetters: number;
  }>(null);

  // --- Load state on mount/letter change ---
  useEffect(() => {
    const newTopList = getTopCountries(letter);
    setTopList(newTopList);

    // Load guesses
    const saved = localStorage.getItem(`percentle-${letter}-correctGuesses`);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        setCorrectGuesses(new Set(arr));
      } catch {
        setCorrectGuesses(new Set());
      }
    } else {
      setCorrectGuesses(new Set());
    }

    // Load hint state
    const hintSaved = localStorage.getItem(getHintStorageKey(letter));
    if (hintSaved) {
      try {
        setHintState(JSON.parse(hintSaved));
      } catch {
        setHintState(null);
      }
    } else {
      setHintState(null);
    }
    setStrikes(0);
  }, [letter]);

  // --- Save guesses to localStorage ---
  useEffect(() => {
    localStorage.setItem(
      `percentle-${letter}-correctGuesses`,
      JSON.stringify(Array.from(correctGuesses))
    );
  }, [correctGuesses, letter]);

  // --- Save hint state to localStorage ---
  useEffect(() => {
    if (hintState) {
      localStorage.setItem(getHintStorageKey(letter), JSON.stringify(hintState));
    } else {
      localStorage.removeItem(getHintStorageKey(letter));
    }
  }, [hintState, letter]);

  // --- Reset hint if guessed or fully revealed ---
  useEffect(() => {
    if (!hintState) return;
    // If the hinted country is guessed, or all letters revealed, reset on next hint
    if (
      correctGuesses.has(hintState.country) ||
      hintState.revealedLetters >= hintState.country.length
    ) {
      setHintState(null);
    }
  }, [correctGuesses, hintState]);

  useEffect(() => {
    const val = localStorage.getItem("percentle-hardMode");
    if (val !== null) setHardMode(val === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem("percentle-hardMode", hardMode ? "true" : "false");
  }, [hardMode]);

  function handleGuess() {
    const guess = input.trim();
    if (!guess) return;

    const properCountryName = countries.find(country =>
      country.toLowerCase() === guess.toLowerCase()
    );

    if (!properCountryName || !topList.some(entry => entry.word === properCountryName)) {
      triggerErrorFeedback();
      if (hardMode) {
        setStrikes(prev => {
          const next = prev + 1;
          if (next >= 10) {
            setShowAll(true);
            setTimeout(() => setStrikes(0), 2000);
          }
          return next;
        });
      }
      return;
    }

    if (!correctGuesses.has(properCountryName)) {
      setCorrectGuesses(prev => new Set([...prev, properCountryName]));
    }

    setInput('');
  }

  function triggerErrorFeedback() {
    setShowError(true);
    setIsShaking(true);
    setInput('');
    setTimeout(() => setShowError(false), 1500);
    setTimeout(() => setIsShaking(false), 400);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleGuess();
    }
  }

  // --- Handle Hint Button ---
  function handleHint() {
    // If all countries are guessed, do nothing
    if (topList.every(entry => correctGuesses.has(entry.word))) return;

    // If no hintState or the last one was guessed/fully revealed, pick a new country
    let newHintState = hintState;
    if (
      !hintState ||
      correctGuesses.has(hintState.country) ||
      hintState.revealedLetters >= hintState.country.length
    ) {
      const unguessed = topList.filter(entry => !correctGuesses.has(entry.word));
      if (unguessed.length === 0) return;
      const idx = Math.floor(Math.random() * unguessed.length);
      newHintState = {
        country: unguessed[idx].word,
        step: 1,
        revealedLetters: 0,
      };
      setHintState(newHintState);
      return;
    }

    // Otherwise, progress the hint
    if (!newHintState) return; // Defensive: should never happen, but just in case

    if (newHintState.step === 1) {
      setHintState({ ...newHintState, step: 2 });
    } else if (newHintState.step >= 2) {
      const nextLetters = Math.min(
        newHintState.revealedLetters + 1,
        newHintState.country.length
      );
      setHintState({
        ...newHintState,
        step: newHintState.step + 1,
        revealedLetters: nextLetters,
      });
    }
  }

  // --- Render Hint Button ---
  const allGuessed = topList.every(entry => correctGuesses.has(entry.word));
  let hintButtonLabel = "Hint 1";
  if (hintState) {
    hintButtonLabel = `Hint ${hintState.step}`;
  }

  // --- Render hint info for each country ---
  function getHintDisplay(entry: { word: string, percent: number }) {
    if (!hintState || hintState.country !== entry.word) return null;
    if (hintState.step === 1) {
      // Reveal percent only
      return (
        <span style={{ color: '#f59e42', fontWeight: 600, marginLeft: 8 }}>
          {entry.percent}%
        </span>
      );
    }
    if (hintState.step >= 2) {
      // Reveal percent and underscores/letters
      const revealed = hintState.revealedLetters;
      const name = entry.word;
      let display = "";
      for (let i = 0; i < name.length; ++i) {
        if (name[i] === " ") {
          display += "  ";
        } else if (i < revealed) {
          display += name[i] + " ";
        } else {
          display += "_ ";
        }
      }
      return (
        <span style={{ color: '#f59e42', fontWeight: 600, marginLeft: 8 }}>
          {entry.percent}% &nbsp; <span style={{ letterSpacing: 2 }}>{display.trim()}</span>
        </span>
      );
    }
    return null;
  }

  function SettingsModal() {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22 }}>Settings</h2>
            <button onClick={() => setSettingsOpen(false)} className="close-btn">
              &times;
            </button>
          </div>
          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0', gap: 8 }}>
              <span style={{ fontWeight: 500, fontSize: 16 }}>
                Hard Mode
                <span style={{ color: '#888', fontSize: 13, fontWeight: 400, marginLeft: 5 }}>
                </span>
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={hardMode}
                  onChange={e => { setHardMode(e.target.checked); setStrikes(0); setShowAll(false); }}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
        </div>
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.33);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal {
            background: #fff;
            border-radius: 18px;
            padding: 1.7rem 1.7rem 1.1rem 1.7rem;
            min-width: 310px;
            max-width: 94vw;
            box-shadow: 0 16px 32px -8px #0001, 0 1.5px 6px #0001;
            position: relative;
            font-family: Inter, sans-serif;
            animation: modalIn 0.22s cubic-bezier(.8,-0.2,.7,1.5);
          }
          .close-btn {
            font-size: 2rem;
            border: none;
            background: none;
            color: #444;
            cursor: pointer;
            line-height: 1;
            transition: color 0.18s;
            padding: 0 8px;
          }
          .close-btn:hover { color: #e11d48; }
          .switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 26px;
          }
          .switch input { display: none; }
          .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background: #d1d5db; border-radius: 13px;
            transition: .3s;
          }
          .slider:before {
            position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px;
            background: #fff;
            border-radius: 50%; transition: .3s;
            box-shadow: 0 1px 4px #0002;
          }
          input:checked + .slider {
            background: #34d399;
          }
          input:checked + .slider:before {
            transform: translateX(20px);
          }
          @keyframes modalIn {
            0% { transform: scale(0.9) translateY(30px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  function StrikesBar() {
    if (!hardMode) return null;
    return (
      <div style={{
        margin: '26px 0 6px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: 7,
      }}>
        {Array.from({ length: 10 }).map((_, idx) => {
          const isActive = idx < strikes;
          return (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 7,
                background: isActive ? '#fee2e2' : '#f3f4f6',
                transition: 'background 0.18s, color 0.18s',
                userSelect: 'none',
              }}
              aria-label={isActive ? "Strike" : "No strike"}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: isActive ? '#ef4444' : '#e5e7eb',
                  transition: 'color 0.18s',
                }}
              >
                ✖️
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <> 
      <div style={{
        padding: '2rem', background: '#f9fafb', color: '#111827', fontFamily: 'Inter, sans-serif', minHeight: '100vh', position: 'relative'
      }}>
        <button
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
          style={{
            position: 'fixed',
            top: 25,
            right: 34,
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            padding: 10,
            borderRadius: '50%',
            boxShadow: '0 2px 10px #0001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none'
          }}
        >
          <img src="/gear.png" alt="Settings" style={{ width: 26, height: 26 }} />
        </button>

        {settingsOpen && <SettingsModal />}

        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <img src="/logo.png" alt="Percentle Logo" style={{ width: '160px', marginBottom: '1rem' }} />

          <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Category: <strong>Countries</strong>
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>
            Today's Letter: <strong>{letter}</strong>
          </p>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your answer..."
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '10px',
              border: showError ? '2px solid #ef4444' : '1px solid #cbd5e1',
              marginBottom: '1rem', fontSize: '1rem', backgroundColor: '#ffffff',
              color: '#111827', boxShadow: showError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
              boxSizing: 'border-box', transform: isShaking ? 'translateX(0)' : 'translateX(0)',
              animation: isShaking ? 'gentleShake 0.4s ease-in-out' : 'none',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
            }}
          />

          <style jsx>{`
            @keyframes gentleShake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-3px); }
              75% { transform: translateX(3px); }
            }
          `}</style>

          <br />
          <button
            onClick={handleGuess}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: '10px', backgroundColor: '#4ade80',
              color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginRight: '0.75rem'
            }}
          >
            Submit
          </button>


          {/* --- HINT BUTTON --- */}
          <button
            onClick={handleHint}
            disabled={allGuessed}
            style={{
              padding: '0.6rem 1.4rem',
              borderRadius: '10px',
              backgroundColor: allGuessed ? '#e5e7eb' : '#f59e42',
              color: allGuessed ? '#9ca3af' : '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: allGuessed ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginRight: '0.75rem'
            }}
          >
            {hintButtonLabel}
          </button>

          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: '0.6rem 1.4rem', borderRadius: '10px', backgroundColor: '#d1d5db',
              color: '#111827', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem'
            }}
          >
            Give Up
          </button>

          <StrikesBar />

          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            {topList.map((entry, idx) => {
              const isGuessed = correctGuesses.has(entry.word);

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isGuessed || showAll ? '#bbf7d0' : '#f0fdf4',
                    padding: '1rem',
                    borderRadius: '10px',
                    marginBottom: '0.75rem',
                    fontWeight: 500,
                    fontSize: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    border: '1px solid #d1fae5',
                    alignItems: 'center'
                  }}
                >
                  <span>
                    {isGuessed || showAll ? (
                      <strong>{entry.word}</strong>
                    ) : (
                      <>
                        {`#${idx + 1} — ???`}
                        {getHintDisplay(entry)}
                      </>
                    )}
                  </span>
                  {(isGuessed || showAll) && (
                    <span style={{ fontWeight: 600 }}>{entry.percent}%</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a href="/faq" style={{ color: "#2563eb", textDecoration: "underline", fontSize: "1rem" }}>
            FAQ
          </a>
        </div>
      </div>
    </>
  );
}
