export default function CreditOption({ creditName, cardName, amount }) {
    return (
        <div className="bg-[#5877B4] w-100 rounded px-3 py-2 text-white flex items-center justify-between">
            <div className="text-left leading-tight">
                <h2 className="text-sm font-medium">{creditName || "Credit Option"}</h2>
                <p className="text-xs opacity-80">{cardName || "Card Name"}</p>
            </div>
            <h1 className="text-xl ml-6">${amount || "0"}</h1>
        </div>
    )
}