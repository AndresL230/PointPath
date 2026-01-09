'use client'

import { useState, useEffect } from 'react';

export default function TransactionsTable({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'dining', 'groceries', 'travel', 'gas', 'streaming', 'flights', 'hotels', 'transit', 'other'];

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/users/${userId}`);
        const userData = await res.json();

        const cardsRes = await fetch('http://localhost:8000/api/cards');
        const cardsData = await cardsRes.json();
        const allCards = Array.isArray(cardsData) ? cardsData : (cardsData.cards || []);

        const cardMap = {};
        allCards.forEach(card => {
          cardMap[card.id] = card;
        });
        
        // process transactions with optimal card calculation
        const processedTransactions = userData.transactions.map(transaction => {
          const usedCard = cardMap[transaction.card_id];

          const userCardIds = userData.cards.map(c => c.card_id);
          const userOwnedCards = allCards.filter(card => userCardIds.includes(card.id));
          
          // find optimal card for this transaction from user's cards only
          let optimalCard = null;
          let maxRewards = 0;
          
          userOwnedCards.forEach(card => {
            const rewardCategory = card.rewards.categories.find(
              cat => cat.name === transaction.category
            );
            const rate = rewardCategory ? rewardCategory.rate : card.rewards.base_rate;
            const rewards = transaction.amount * rate;
            
            if (rewards > maxRewards) {
              maxRewards = rewards;
              optimalCard = card;
            }
          });
          
          // calc rewards for used card
          const usedRewardCategory = usedCard?.rewards.categories.find(
            cat => cat.name === transaction.category
          );
          const usedRate = usedRewardCategory ? usedRewardCategory.rate : (usedCard?.rewards.base_rate || 1);
          const usedRewards = transaction.amount * usedRate;
          
          const isOptimal = usedCard?.id === optimalCard?.id;
          
          return {
            ...transaction,
            cardUsed: usedCard?.name || transaction.card_id,
            optimalCard: optimalCard?.name || '—',
            status: isOptimal ? 'Optimal' : 'Suboptimal',
            missedRewards: maxRewards - usedRewards
          };
        });
        // sort transactions by date descending
        processedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactions(processedTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchTransactions();
  }, [userId]);

  if (loading) return <div className='text-gray-600'>Loading transactions...</div>;
  if (!transactions.length) return <div className='text-gray-600'>No transactions found</div>;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const filteredTransactions = selectedCategory === 'all'
    ? transactions
    : transactions.filter(t => t.category === selectedCategory);

  const displayedTransactions = showAll ? filteredTransactions : filteredTransactions.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-black text-xl">Recent Transactions</h1>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Merchant</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Card Used</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Optimal Card</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-700">{formatDate(transaction.date)}</td>
              <td className="py-3 px-4 text-sm text-gray-900">{transaction.merchant}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{transaction.category}</td>
              <td className="py-3 px-4 text-sm text-gray-900 text-right">${transaction.amount.toFixed(2)}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{transaction.cardUsed}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{transaction.optimalCard}</td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'Optimal'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTransactions.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-gray-600 hover:text-black text-sm font-medium cursor-pointer"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}

      {displayedTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found in this category
        </div>
      )}
    </div>
  );
}