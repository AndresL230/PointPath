"use client";

import { useState, useEffect } from 'react';
import Card from "../components/Card";

export default function MyCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = "user01";

  useEffect(() => {
    fetchUserCards();
  }, []);

  const fetchUserCards = async () => {
    try {
      setLoading(true);

      const userResponse = await fetch(`http://localhost:8000/api/users/${userId}`);
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();

      const cardsResponse = await fetch('http://localhost:8000/api/cards');
      
      if (!cardsResponse.ok) {
        throw new Error('Failed to fetch cards data');
      }

      const cardsData = await cardsResponse.json();
      const allCards = Array.isArray(cardsData) ? cardsData : (cardsData.cards || []);

      const cardDetailsMap = {};
      allCards.forEach(card => {
        cardDetailsMap[card.id] = card;
      });

      const cardsWithDetails = userData.cards.map(userCard => {
        const cardId = userCard.card_id;
        const cardDetails = cardDetailsMap[cardId];
        
        // calculate total balance for this card from transactions
        const cardTransactions = userData.transactions.filter(t => t.card_id === cardId);
        const balance = cardTransactions.reduce((sum, t) => sum + t.amount, 0);

        let points = 0;
        if (cardDetails) {
          cardTransactions.forEach(transaction => {
            // find matching reward category
            const rewardCategory = cardDetails.rewards.categories.find(
              cat => cat.name === transaction.category
            );

            const rate = rewardCategory ? rewardCategory.rate : cardDetails.rewards.base_rate;
            points += transaction.amount * rate;
          });
        }

        return {
          image: `/${cardId}.jpg`,
          cardName: cardDetails?.name || cardId,
          balance: `$${balance.toFixed(2)}`,
          points: Math.floor(points).toLocaleString()
        };
      });

      setCards(cardsWithDetails);
      setError(null);
    } catch (err) {
      setError('Failed to load your cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">
            <div className="text-xl text-gray-600">Loading your cards...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={fetchUserCards}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
      <h1 className="text-xl">Here are your current credit cards</h1>

      <section className="mt-8 bg-white px-6 py-8 rounded-lg pb-20">
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Card
                type="curr"
                key={index}
                image={card.image}
                cardName={card.cardName}
                balance={card.balance}
                points={card.points}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any cards yet.</p>
            <button className="bg-[#5877B4] text-white px-6 py-2 rounded-lg hover:bg-[#4a6599]">
              Add Your First Card
            </button>
          </div>
        )}
      </section>
    </main>
  );
}