import { useEffect, useState } from 'react';

const countries = [
  // Kosovo included
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

function calculatePercent(word: string, letter: string) {
  const count = word.toUpperCase().split('').filter(c => c === letter.toUpperCase()).length;
  return +(100 * count / word.length).toFixed(2);
}

function getTopCountries(letter: string) {
  const scored = countries.map(c => ({
    word: c,
    percent: calculatePercent(c, letter)
  })).filter(entry => entry.percent > 0);

  const sorted = scored.sort((a, b) => b.percent - a.percent);
  const minPercent = sorted[Math.min(4, sorted.length - 1)]?.percent || 0;

  return sorted.filter(entry => entry.percent >= minPercent);
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
  const [letter, setLetter] = useState('O');
  const [topList, setTopList] = useState<{ word: string, percent: number }[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showError, setShowError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  function handleGuess() {
    const guess = input.trim();
    if (!guess) return;

    const properCountryName = countries.find(country =>
      country.toLowerCase() === guess.toLowerCase()
    );

    if (!properCountryName || !topList.some(entry => entry.word === properCountryName)) {
      triggerErrorFeedback();
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleGuess();
    }
  }

  function startGame() {
    setShowWelcome(false);
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

  if (showWelcome) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <img src="/logo.png" alt="Percentle Logo" style={{
            width: '120px',
            height: 'auto',
            marginBottom: '1.5rem',
            display: 'block',
            margin: '0 auto 1.5rem auto'
          }} />
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Welcome to Percentle!
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Guess the countries with the highest % of today's letter.
          </p>
          <button
            onClick={startGame}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.875rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      background: '#f9fafb',
      color: '#111827',
      fontFamily: 'Inter, sans-serif',
      minHeight: '100vh'
    }}>
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your answer..."
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: showError ? '2px solid #ef4444' : '1px solid #cbd5e1',
            marginBottom: '1rem',
            fontSize: '1rem',
            backgroundColor: '#ffffff',
            color: '#111827',
            boxShadow: showError ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 1px 3px rgba(0,0,0,0.06)',
            boxSizing: 'border-box',
            transform: isShaking ? 'translateX(0)' : 'translateX(0)',
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
            padding: '0.6rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: '#4ade80',
            color: 'white',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginRight: '0.75rem'
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
            padding: '0.6rem 1.4rem',
            borderRadius: '10px',
            backgroundColor: '#d1d5db',
            color: '#111827',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Give Up
        </button>

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
    </div>
  );
}
