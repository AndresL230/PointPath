'use client'

import { useState } from 'react';

export default function TransactionsTable({ transactions }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  if (!transactions || transactions.length === 0) {
    return <div>No transactions found</div>;
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const categories = ['all', 'dining', 'groceries', 'travel', 'gas', 'streaming', 'other'];
  
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
              <td className="py-3 px-4 text-sm text-gray-700">{transaction.cardUsed || '—'}</td>
              <td className="py-3 px-4 text-sm text-gray-700">{transaction.optimalCard || '—'}</td>
              <td className="py-3 px-4">
                {transaction.status ? (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'Optimal' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.status}
                  </span>
                ) : (
                  <span className="text-sm text-gray-700">—</span>
                )}
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