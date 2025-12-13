"use client";

import { useState } from "react";
import Dice from "./components/dice";

export default function Home() {
  const [rollTrigger, setRollTrigger] = useState(0);

  const rollAll = () => setRollTrigger((v) => v + 1);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4 flex-wrap justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Dice key={i} rollTrigger={rollTrigger} />
        ))}
      </div>

      <button
        onClick={rollAll}
        className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-600"
      >
        wÜRFELN!
      </button>
    </div>
  );
}
