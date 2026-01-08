import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-custom-blue min-h-screen mx-17 mt-8">
      <h1 className="text-xl">Hi User, let's maximize your rewards</h1>

      <section className="flex gap-6">
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Rewards Earned This Month</p>
          <h1 className="text-black text-2xl">$43.22</h1>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Potential Missed Rewards</p>
          <h1 className="text-black text-2xl">$12.80</h1>
        </div>
        <div className="mt-8 bg-white p-6 rounded-lg w-1/3">
          <p className="text-gray-500 text-sm">Best Performing Card</p>
          <h1 className="text-black text-2xl">Amex Gold</h1>
        </div>
      </section>

      <section>
        <div className="mt-6 bg-white p-6 rounded-lg">
          <h1 className="text-black text-xl">Import Your Transactions</h1>
          <p className="text-gray-500">Connect your bank or upload a CSV to get personalized recommendations</p>
          <div className="mt-2">
            <button className="mt-4 bg-black text-white px-4 py-3 rounded-lg mr-4 cursor-pointer">Connect Bank</button>
            <button className="mt-4 bg-gray-200 text-black px-4 py-3 rounded-lg cursor-pointer">Upload CSV</button>
          </div>
          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Image 
                src="/lock.png" 
                alt="Security" 
                width={12}
                height={12}
              />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Image 
                src="/eye.png" 
                alt="Privacy" 
                width={16} 
                height={16}
              />
              <span>Read-only access</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        
      </section>
    </main>
  );
}