import Card from "../components/Card";

export default function RecCard() {
    const topCategories = [
        { name: "Dining", amount: 450.32, percentage: 35 },
        { name: "Groceries", amount: 320.15, percentage: 25 },
        { name: "Gas", amount: 180.50, percentage: 14 },
    ];

    const recommendedCards = [
        <Card 
            type={"rec"}
            key="1"
            image="/amex-gold.jpg"
            cardName={"American Express Gold"}
            rateName={"Dining"}
            topRate={"4"}
            extra={"60000 Point Sign-On Bonus when you spend 6000 in 180 days"}
        />,
        <Card 
            type={"rec"}
            key="2"
            image="/chase-sapphire-p.jpg"
            cardName={"Chase Sapphire Preferred"}
            rateName={"Travel"}
            topRate={"5"}
            extra={"60000 Point Sign-On Bonus when you spend 4000 in 90 days"}
        />
    ];

    return (
        <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
            <h1 className="text-xl">Based on your transaction history, here are some card recommendations</h1>
            
            <section>
                <div className="mt-8 bg-white px-6 py-8 rounded-lg">
                    <h2 className="text-black text-xl mb-4">Top Spending Categories</h2>
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
                </div>
            </section>

            <section>
                <div className="mt-6 bg-white px-6 py-8 rounded-lg">
                    <h2 className="text-black text-xl mb-4">Recommended Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendedCards}
                    </div>
                </div>
            </section>
        </main>
    );
}