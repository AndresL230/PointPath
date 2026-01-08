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
        <div className="bg-slate-200 rounded-lg p-3">
            <div className="relative w-full h-[190px]">
                <Image
                    src={image}
                    alt={cardName}
                    fill
                    className="object-cover rounded-md"
                />
            </div>

            <section className="my-3 leading-5 px-1">
                <h3 className="text-black">{cardName}</h3>

                {type === "rec" && (
                    <>
                        <p className="text-gray-600">
                            {`${rateName} Rewards Rate: ${topRate}`}
                        </p>
                        <p className="text-gray-600 mt-4">{extra}</p>
                    </>
                )}

                {type === "curr" && (
                    <>
                        <div className="flex items-baseline justify-between mt-1">
                            <p className="text-4xl text-gray-600">
                                {balance}
                            </p>
                            <p className="text-gray-600">
                                Points: {points}
                            </p>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
