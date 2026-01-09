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
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Card Image */}
            <div className="relative w-full aspect-[1.6/1] mb-4">
                <Image
                    src={image}
                    alt={cardName}
                    fill
                    className="object-contain rounded-lg"
                />
            </div>

            {/* Card Content */}
            <div className="space-y-2">
                {/* Card Name - Always shown */}
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {cardName}
                </h3>

                {/* Recommended Card Layout */}
                {type === "rec" && (
                    <div className="space-y-2 pt-1">
                        <p className="text-base text-gray-700">
                            <span className="font-bold text-[#2563EB]">{topRate}%</span>
                            {" "}on {rateName}
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {extra}
                        </p>
                    </div>
                )}

                {/* Current Card Layout */}
                {type === "curr" && (
                    <div className="space-y-3 pt-2">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                                Balance
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {balance}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                                Points Earned
                            </p>
                            <p className="text-xl font-semibold text-[#2563EB]">
                                {points}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}