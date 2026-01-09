'use client';

import { useState, useEffect } from 'react';
import Card from "../components/Card";

export default function RecCard() {
    const [topCategories, setTopCategories] = useState([]);
    const [recommendedCards, setRecommendedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = "user01";

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const userResponse = await fetch(
                    `http://localhost:8000/api/users/${userId}`
                );
                
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                
                const userData = await userResponse.json();

                const categoryTotals = calculateCategoryTotals(userData.transactions);
                setTopCategories(categoryTotals);

                const cardsResponse = await fetch(
                    `http://localhost:8000/api/recommendations/new-cards/${userId}`
                );
                
                if (!cardsResponse.ok) {
                    throw new Error('Failed to fetch recommended cards');
                }
                
                const cardsData = await cardsResponse.json();

                await processRecommendedCards(cardsData);
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        fetchData();
    }, [userId]);

    function calculateCategoryTotals(transactions) {
        if (!transactions || transactions.length === 0) {
            return [];
        }

        // category mapping from API to display
        const categoryMap = {
            'dining': 'Dining',
            'groceries': 'Groceries',
            'grocery': 'Groceries',
            'gas': 'Gas',
            'transit': 'Transportation',
            'transportation': 'Transportation',
            'flights': 'Travel',
            'hotels': 'Travel',
            'travel': 'Travel',
            'streaming': 'Streaming',
            'entertainment': 'Entertainment',
            'drugstores': 'Drugstores',
            'online_shopping': 'Online Shopping'
        };

        // sum up amounts by category
        const totals = {};
        
        transactions.forEach(t => {
            const displayCategory = categoryMap[t.category] || 
                                   t.category.charAt(0).toUpperCase() + t.category.slice(1);
            
            if (!totals[displayCategory]) {
                totals[displayCategory] = 0;
            }
            totals[displayCategory] += t.amount;
        });

        // convert to array and sort by amount
        const categoriesArray = Object.entries(totals).map(([name, amount]) => ({
            name,
            amount,
            percentage: 0
        }));

        categoriesArray.sort((a, b) => b.amount - a.amount);

        const top3 = categoriesArray.slice(0, 3);
        const top3Total = top3.reduce((sum, cat) => sum + cat.amount, 0);
        
        if (top3Total > 0) {
            top3.forEach(cat => {
                cat.percentage = (cat.amount / top3Total) * 100;
            });
        }

        return top3;
    }

    async function processRecommendedCards(cardsData) {
        // convert dictionary to array
        const cardsArray = Object.values(cardsData);
        
        if (cardsArray.length === 0) {
            setRecommendedCards([]);
            return;
        }

        try {
            // fetch the full card details for each recommendation to get reward rates
            const cardDetailsPromises = cardsArray.map(rec => 
                fetch(`http://localhost:8000/api/cards/${rec.cardId}`)
                    .then(res => res.json())
            );
            
            const cards = await Promise.all(cardDetailsPromises);

            const cardComponents = cardsArray.map((rec, index) => {
                const card = cards[index];
                const bestCategory = findBestCategory(card);
                
                return (
                    <Card 
                        type="rec"
                        key={rec.cardId || index}
                        image={`/${rec.cardId}.jpg`}
                        cardName={rec.cardName}
                        rateName={bestCategory.name}
                        topRate={bestCategory.rate}
                        extra={formatSignupBonus(rec.signupBonus)}
                    />
                );
            });
            
            setRecommendedCards(cardComponents);
        } catch (err) {
            console.error('Error fetching card details:', err);
            setRecommendedCards([]);
        }
    }

    function findBestCategory(card) {
        if (!card.rewards || !card.rewards.categories || card.rewards.categories.length === 0) {
            return { name: "Base Rate", rate: card.rewards?.base_rate?.toString() || "1" };
        }

        let bestCat = card.rewards.categories[0];
        
        for (const cat of card.rewards.categories) {
            if (cat.rate > bestCat.rate) {
                bestCat = cat;
            }
        }
        
        return {
            name: formatCategoryName(bestCat.name),
            rate: bestCat.rate.toString()
        };
    }

    function formatCategoryName(name) {
        const nameMap = {
            'dining': 'Dining',
            'restaurant': 'Dining',
            'groceries': 'Groceries',
            'grocery': 'Groceries',
            'gas': 'Gas',
            'transportation': 'Transportation',
            'transit': 'Transit',
            'travel': 'Travel',
            'flights': 'Travel',
            'hotels': 'Travel',
            'hotel': 'Travel',
            'streaming': 'Streaming',
            'entertainment': 'Entertainment'
        };
        
        return nameMap[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
    }

    function formatSignupBonus(bonus) {
        if (!bonus) return "Check issuer website for current offers";
        
        if (typeof bonus === 'string') return bonus;
        
        if (bonus.amount && bonus.amount > 0) {
            const bonusType = bonus.type === 'cash' ? 'Cash' : 'Point';
            const amountText = bonus.type === 'cash' 
                ? `$${bonus.amount.toLocaleString()}` 
                : `${bonus.amount.toLocaleString()} ${bonusType}`;
            
            if (bonus.minimum_spend && bonus.time_period_days) {
                return `${amountText} Sign-On Bonus when you spend $${bonus.minimum_spend.toLocaleString()} in ${bonus.time_period_days} days`;
            }
            
            return `${amountText} Sign-On Bonus`;
        }
        
        return "Check issuer website for current offers";
    }

    if (loading) {
        return (
            <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl">Loading recommendations...</div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
                <div className="flex items-center justify-center h-64">
                    <div className="text-xl text-red-600">Error: {error}</div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
            <h1 className="text-xl">Explore cards with strong rewards for your top spending categories</h1>
            
            <section>
                <div className="mt-8 bg-white px-6 py-8 rounded-lg">
                    <h2 className="text-black text-xl mb-4">Top Spending Categories</h2>
                    {topCategories.length > 0 ? (
                        <div className="space-y-3">
                            {topCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-700 font-medium">{category.name}</span>
                                            <span className="text-gray-900 font-semibold">${category.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-[#5877B4] h-2 rounded-full" 
                                                style={{ width: `${category.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No spending data available</p>
                    )}
                </div>
            </section>

            <section>
                <div className="mt-6 bg-white px-6 py-8 rounded-lg">
                    <h2 className="text-black text-xl">Recommended Cards</h2>
                    <p className="text-gray-600 mb-6">
                        Based on your spending patterns, these cards will maximize your rewards.
                        Approval depends on the issuer and your credit profile.
                    </p>
                    {recommendedCards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedCards}
                        </div>
                    ) : (
                        <p className="text-gray-600">No card recommendations available</p>
                    )}
                </div>
            </section>
        </main>
    );
}