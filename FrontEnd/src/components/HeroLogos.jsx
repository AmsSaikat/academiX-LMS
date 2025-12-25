import React from 'react';
import { RiCustomerService2Fill } from "react-icons/ri"; 

const features = [
  "15k+ online courses",
  "Lifetime access",
  "Value for money",
  "Lifetime support",
  "Community support",
];

export default function HeroLogos() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {features.map((feature, idx) => (
        <p
          key={idx}
          className="border-2 bg-gray-500 px-4 py-2 rounded-lg text-white flex items-center gap-2"
        >
          <RiCustomerService2Fill className="text-xl" />
          {feature}
        </p>
      ))}
    </div>
  );
}
