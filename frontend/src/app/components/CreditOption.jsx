export default function CreditOption({ cardName, amount }) {
    return (
        <div className="bg-[#5877B4] min-w-[350px] rounded px-4 py-3 text-white flex items-center justify-between">
            <div className="text-left leading-5 my-1">
                <h2 className="text-md">Credit Option</h2>
                <p className="text-md opacity-80">{cardName || "Card Name"}</p>
            </div>
            <h1 className="text-3xl mr-2">${amount || "50"}</h1>
        </div>
    )
}