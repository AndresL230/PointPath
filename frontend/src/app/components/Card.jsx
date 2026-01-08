import Image from "next/image";

export default function Card({ image, cardName, rateName, topRate, extra }) {
  return (
    <div className="bg-slate-200 rounded-lg p-3">
      <div className="relative w-full h-[190px]">
        <Image
          src={image}
          alt={rateName}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <section className="my-3 leading-5 px-1">
        <h3 className="text-black">{cardName}</h3>
        <p className="text-gray-600">
          {`${rateName} Rewards Rate: ${topRate}`}
        </p>
        <p className="text-gray-600 mt-4">{extra}</p>
      </section>
    </div>
  );
}