export default function CreditOption({ cardName, amount }) {
    return (
        <div className="bg-blue-600 w-1/3 rounded-2xl p-4 text-white flex items-center justify-between">
            <div className="text-left leading-3 mb-1">
                <h2 className="text-lg">Credit Option</h2>
                <p className="text-md opacity-80">{cardName || "Card Name"}</p>
            </div>
            <h1 className="text-4xl mr-2">${amount || "50"}</h1>
        </div>
    )
}