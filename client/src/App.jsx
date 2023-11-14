import React, { useState, useEffect } from 'react';

// Context Providers for Blockchain (Simplified for Mockup)
const BlockchainProvider = ({ children }) => <>{children}</>;

// Component to Select and Set up a Trade
const TradeInterface = ({ onTradeSetup }) => {
  const [tradeDetails, setTradeDetails] = useState({ asset: '', amount: 0, recipient: '' });

  const handleTradeSetup = () => {
    onTradeSetup(tradeDetails);
  };

  return (
    <div>
      <h2>Trade Setup</h2>
      <input type="text" placeholder="Asset" onChange={e => setTradeDetails({ ...tradeDetails, asset: e.target.value })} />
      <input type="number" placeholder="Amount" onChange={e => setTradeDetails({ ...tradeDetails, amount: e.target.value })} />
      <input type="text" placeholder="Recipient Address" onChange={e => setTradeDetails({ ...tradeDetails, recipient: e.target.value })} />
      <button onClick={handleTradeSetup}>Set up Trade</button>
    </div>
  );
};

// Component to Confirm the Trade
const TradeConfirmation = ({ tradeDetails, onConfirm }) => {
  if (!tradeDetails) return null;

  return (
    <div>
      <h2>Confirm Trade</h2>
      <p>Asset: {tradeDetails.asset}</p>
      <p>Amount: {tradeDetails.amount}</p>
      <p>Recipient: {tradeDetails.recipient}</p>
      <button onClick={onConfirm}>Confirm Trade</button>
    </div>
  );
};

// Component to Handle Trade Timeout
const TradeTimeout = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  return <div>Time remaining for trade: {timeLeft} seconds</div>;
};

// Main App Component
function App() {
  const [tradeDetails, setTradeDetails] = useState(null);
  const [tradeConfirmed, setTradeConfirmed] = useState(false);

  const handleTradeSetup = details => {
    setTradeDetails(details);
  };

  const handleConfirm = () => {
    // Logic to handle trade confirmation
    setTradeConfirmed(true);
  };

  const handleTimeout = () => {
    // Logic to handle trade timeout (revert or cancel trade)
    setTradeDetails(null);
    setTradeConfirmed(false);
  };

  return (
    <BlockchainProvider>
      <div id="App">
        <div className="container">
          {!tradeConfirmed && <TradeInterface onTradeSetup={handleTradeSetup} />}
          {tradeDetails && !tradeConfirmed && <TradeConfirmation tradeDetails={tradeDetails} onConfirm={handleConfirm} />}
          {tradeConfirmed && <TradeTimeout duration={600} onTimeout={handleTimeout} />}
        </div>
      </div>
    </BlockchainProvider>
  );
}

export default App;
