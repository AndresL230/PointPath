import Card from "../components/Card";

export default function MyCards() {
  const cards = [
    {
      image: "/chase-sapphire-p.jpg",
      cardName: "Chase Sapphire Preferred",
      balance: "$1,240.50",
      points: "42,000"
    },
    {
      image: "/amex-gold.jpg",
      cardName: "Amex Gold",
      balance: "$860.10",
      points: "18,500"
    },
    {
      image: "/c1-venture.avif",
      cardName: "Capital One Venture",
      balance: "$2,015.00",
      points: "61,200"
    }
  ];

  return (
    <main className="bg-custom-blue min-h-screen mx-17 mt-8 mb-10">
      <h1 className="text-xl">Here are your current credit cards</h1>

      <section className="mt-8 bg-white px-6 py-8 rounded-lg pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Card
              type={"curr"}
              key={index}
              image={card.image}
              cardName={card.cardName}
              balance={card.balance}
              points={card.points}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
