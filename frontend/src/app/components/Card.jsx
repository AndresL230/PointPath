import Image from "next/image";

export default function Card({
    type,          // "rec" | "curr"
    image,
    cardName,
    rateName,
    topRate,
    extra,
    balance,
    points
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className={`relative w-full ${type === "curr" ? "h-[140px]" : "h-[150px]"}`}>
                <Image
                    src={image}
                    alt={cardName}
                    fill
                    className="object-cover rounded-md"
                />
            </div>

            <section className="my-3 leading-5 px-1">
                <h3 className="text-black font-semibold">{cardName}</h3>

                {type === "rec" && (
                    <>
                        <div className="mt-3 space-y-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-[#5877B4]">{topRate}%</span> on {rateName}
                            </p>
                            <p className="text-xs text-gray-500 mt-3 leading-relaxed">{extra}</p>
                        </div>
                    </>
                )}

                {type === "curr" && (
                    <>
                        <div className="mt-3 space-y-2">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
                                <p className="text-2xl font-semibold text-black">
                                    {balance}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
                                <p className="text-lg font-medium text-[#5877B4]">
                                    {points}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
