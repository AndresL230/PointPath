'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import TransactionsTable from "./components/TransactionsTable";
import CreditOption from "./components/CreditOption";

export default function Home() {
  const [showCardRecommendation, setShowCardRecommendation] = useState(false);
  const [purchaseType, setPurchaseType] = useState('Select');
  const [amount, setAmount] = useState('');
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [userCards, setUserCards] = useState([]);
  const [availableCredits, setAvailableCredits] = useState([]);
  const [recommendedCard, setRecommendedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = "user01";
  const categories = ['dining', 'groceries', 'travel', 'gas', 'streaming', 'flights', 'hotels', 'transit'];

  useEffect(() => {
    if (showCardRecommendation) {
      fetchUserCards();
    } else {
      // clear credits when hiding the recommendation panel to reload for new user
      setAvailableCredits([]);
    }
  }, [showCardRecommendation]);

  const fetchUserCards = async () => {
    try {
      const userRes = await fetch(`http://localhost:8000/api/users/${userId}`);
      const userData = await userRes.json();
      
      const cardsRes = await fetch('http://localhost:8000/api/cards');
      const cardsData = await cardsRes.json();
      const allCards = Array.isArray(cardsData) ? cardsData : (cardsData.cards || []);
      
      const userCardIds = userData.cards.map(c => c.card_id);
      const userCardDetails = allCards.filter(card => userCardIds.includes(card.id));
      
      setUserCards(userCardDetails);
      
      // extract all available credits from user's cards
      const credits = [];
      userCardDetails.forEach(card => {
        if (card.credits && card.credits.length > 0) {
          card.credits.forEach(credit => {
            credits.push({
              ...credit,
              cardName: card.name,
              cardId: card.id
            });
          });
        }
      });
      setAvailableCredits(credits);
    } catch (err) {
      console.error("Failed to fetch user cards:", err);
    }
  };

  const handleGetRecommendation = async () => {
    setLoading(true);
    try {
      // build query parameters for GET request
      const params = new URLSearchParams({
        user_id: userId,
        category: purchaseType,
        amount: amount.toString()
      });
      
      console.log('Sending recommendation request:', { userId, purchaseType, amount });
      
      const response = await fetch(`http://localhost:8000/api/recommendations/transaction?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Recommendation response:', data);
      console.log('Recommended card ID:', data.recommended_card_id);
      
      const cardsRes = await fetch('http://localhost:8000/api/cards');
      const cardsData = await cardsRes.json();
      const allCards = Array.isArray(cardsData) ? cardsData : (cardsData.cards || []);
      
      const recommendedCardDetails = allCards.find(card => card.id === data.recommended_card_id);
      
      if (recommendedCardDetails) {
        setRecommendedCard({
          ...recommendedCardDetails,
          rewards_earned: data.rewards_earned || 0,
          reason: data.reason || `Best card for ${purchaseType}`
        });
        setShowRecommendation(true);
      } else {
        console.error('Recommended card not found. Card ID:', data.recommended_card_id);
        console.error('Available cards:', allCards.map(c => c.id));
        alert(`Could not find recommended card with ID: ${data.recommended_card_id}`);
      }
    } catch (err) {
      console.error("Failed to get recommendation:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardRecommendation = () => {
    if (showCardRecommendation) {
      setPurchaseType('Select');
      setAmount('');
      setShowRecommendation(false);
      setRecommendedCard(null);
    }
    setShowCardRecommendation(!showCardRecommendation);
  };

  return (
    <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
      <h1 className="text-xl">Hi User, let's maximize your rewards</h1>

      <section className="flex gap-6">
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Rewards Earned This Month</p>
          <h1 className="text-black text-2xl">$43.22</h1>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Potential Missed Rewards</p>
          <h1 className="text-black text-2xl">$12.80</h1>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Best Performing Card</p>
          <h1 className="text-black text-2xl">Amex Gold</h1>
        </div>
      </section>

      <section>
        <div className="mt-6 bg-white px-6 py-8 rounded-lg">
          <h1 className="text-black text-xl">Import Your Transactions</h1>
          <p className="text-gray-500">Connect your bank or upload a CSV to get personalized recommendations</p>
          <div className="mt-2">
            <button className="mt-4 bg-black text-white px-4 py-3 rounded-lg mr-4 cursor-pointer">Connect Bank</button>
            <button className="mt-4 bg-gray-200 text-black px-4 py-3 rounded-lg cursor-pointer">Upload CSV</button>
          </div>
          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Image src="/lock.png" alt="Security" width={12} height={12} />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/eye.png" alt="Privacy" width={16} height={16} />
              <span>Read-only access</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mt-6 bg-white px-6 py-8 rounded-lg">
          <TransactionsTable userId={userId} />
        </div>
      </section>

      <section className="relative">
        <button
          onClick={toggleCardRecommendation}
          className="relative mt-6 bg-red-600 z-10 text-white px-6 py-4 rounded-3xl flex items-center gap-3 cursor-pointer hover:bg-red-700 transition-colors"
        >
          <Image src="/card.png" alt="Card" width={24} height={24} className="invert" />
          <span>What card should I use?</span>
        </button>

        {showCardRecommendation && (
          <div className="-mt-7 bg-white px-6 pt-12 pb-8 rounded-lg">
            <div className="flex gap-6">
              <form className="space-y-4 flex-1 min-w-[400px]">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type of Purchase
                  </label>
                  <select
                    value={purchaseType}
                    onChange={(e) => setPurchaseType(e.target.value)}
                    className="w-68 px-4 py-2 border text-gray-600 text-sm border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option>Select</option>
                    {categories.map((category) => (
                      <option key={category} value={category} className="text-slate-700">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-68 pl-8 pr-4 py-2 border text-gray-600 text-sm border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {purchaseType !== 'Select' && amount !== '' && (
                  <div className="mt-6">
                    <p className="text-gray-700 mb-3">Would you like to use a credit option?</p>
                    <div className="flex flex-col gap-3">
                      {availableCredits.length > 0 ? (
                        availableCredits.map((credit, index) => (
                          <div 
                            key={index}
                          >
                            <CreditOption 
                              creditName={credit.name}
                              cardName={credit.cardName}
                              amount={credit.amount}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No credit options available from your cards</p>
                      )}
                      <button
                        type="button"
                        onClick={handleGetRecommendation}
                        disabled={loading}
                        className="px-4 py-2 bg-black w-70 cursor-pointer text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'No, show me the best card'}
                      </button>
                    </div>
                  </div>
                )}
              </form>

              {showRecommendation && recommendedCard && !loading && (
                <div className="w-165 ml-4 pl-6">
                  <h2 className="text-xl text-black">Recommended Card</h2>
                  <div className="flex">
                    <Image
                      src={`/${recommendedCard.id}.jpg`}
                      alt={recommendedCard.name}
                      width={360}
                      height={200}
                      className="rounded-lg pt-5"
                    />
                    <section className="p-6">
                      <h3 className="text-black">{recommendedCard.name}</h3>
                      <p className="text-gray-600">{recommendedCard.reason}</p>
                      <p className="text-gray-600 mt-9">
                        Earn {(recommendedCard.rewards_earned || 0).toFixed(2)} Rewards Points
                      </p>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}