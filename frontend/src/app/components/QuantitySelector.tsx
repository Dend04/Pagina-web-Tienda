"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface QuantitySelectorProps {
  min?: number;
  max?: number;
  initial?: number;
  onChange?: (quantity: number) => void;
}

export const QuantitySelector = ({
  min = 1,
  max = 99,
  initial = 1,
  onChange,
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(initial);

  const increment = () => {
    if (quantity < max) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      onChange?.(newQty);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onChange?.(newQty);
    }
  };

  return (
    <div className="flex items-center border border-gray-200 rounded-full bg-white overflow-hidden shadow-sm">
      <button
        onClick={decrement}
        disabled={quantity <= min}
        className="px-3 py-2 text-gray-600 hover:bg-pucara-red/10 hover:text-pucara-red disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Disminuir cantidad"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <span className="w-12 text-center font-medium text-pucara-black">
        {quantity}
      </span>
      <button
        onClick={increment}
        disabled={quantity >= max}
        className="px-3 py-2 text-gray-600 hover:bg-pucara-red/10 hover:text-pucara-red disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Aumentar cantidad"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};