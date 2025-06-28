import { useEffect, useState } from 'react';

const countries = [
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
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
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
  
  return scored.sort((a, b) => b.percent - a.percent).slice(0, 8);
}

function getMinimumTopPercentage(letter: string) {
  const scored = countries.map(c => ({
    word: c,
    percent: calculatePercent(c, letter)
  })).filter(entry => entry.percent > 0);
  
  const sorted = scored.sort((a, b) => b.percent - a.percent);
  
  // Get the 8th highest percentage (or minimum if less than 8)
  const minIndex = Math.min(7, sorted.length - 1);
  return sorted[minIndex]?.percent || 0;
}

export default function PlayPage() {
  const [letter, setLetter] = useState('M');
  const [topList, setTopList] = useState<{ word: string, percent: number }[]>([]);
  const [correctGuesses, setCorrectGuesses] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [minimumPercentage, setMinimumPercentage] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const newTopList = getTopCountries(letter);
    const minPercent = getMinimumTopPercentage(letter);
    setTopList(newTopList);
    setMinimumPercentage(minPercent);
    setCorrectGuesses(new Set()); // Reset guesses when letter changes
  }, [letter]);

  function handleGuess() {
    const guess = input.trim();
    if (!guess) return;

    // Find the country with proper capitalization
    const properCountryName = countries.find(country => 
      country.toLowerCase() === guess.toLowerCase()
    );
    
    if (!properCountryName) {
      // Show error feedback for non-existent country
      triggerErrorFeedback();
      return;
    }

    // Calculate the percentage for this guess
    const guessPercent = calculatePercent(properCountryName, letter);
    
    // Check if this country qualifies (has percentage >= minimum and > 0)
    if (guessPercent >= minimumPercentage && guessPercent > 0) {
      // Check if we haven't already guessed this country
      if (!correctGuesses.has(properCountryName)) {
        setCorrectGuesses(prev => new Set([...prev, properCountryName]));
      }
    } else {
      // Show error feedback for country that doesn't qualify
      triggerErrorFeedback();
      return;
    }
    
    setInput('');
  }

  function triggerErrorFeedback() {
    setShowError(true);
    setIsShaking(true);
    setInput('');
    
    // Hide error styling after 1.5 seconds
    setTimeout(() => setShowError(false), 1500);
    
    // Stop shaking after animation completes
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

  // Welcome popup overlay
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
          <img 
            src="/logo.png" 
            alt="Percentle Logo" 
            style={{ 
              width: '120px', 
              height: 'auto',
              marginBottom: '1.5rem',
              display: 'block',
              margin: '0 auto 1.5rem auto'
            }} 
          />
          
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem',
            margin: '0 0 1rem 0'
          }}>
            Welcome to Percentle!
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '2rem',
            margin: '0 0 2rem 0'
          }}>
            Guess the 8 countries with the highest % of today's letter.
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
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Submit
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          {topList.map((entry, idx) => {
            const isGuessed = correctGuesses.has(entry.word);
            
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isGuessed ? '#bbf7d0' : '#f0fdf4',
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
                  {isGuessed ? (
                    <strong>{entry.word}</strong>
                  ) : (
                    `#${idx + 1} — ???`
                  )}
                </span>
                {isGuessed && (
                  <span style={{ fontWeight: 600 }}>{entry.percent}%</span>
                )}
              </div>
            );
          })}
          
          {/* Show any additional accepted answers that aren't in the original top 8 */}
          {Array.from(correctGuesses).filter(country => 
            !topList.some(topEntry => topEntry.word === country)
          ).map((country, idx) => {
            const percent = calculatePercent(country, letter);
            return (
              <div
                key={`extra-${idx}`}
                style={{
                  backgroundColor: '#bbf7d0',
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
                <span><strong>{country}</strong></span>
                <span style={{ fontWeight: 600 }}>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}