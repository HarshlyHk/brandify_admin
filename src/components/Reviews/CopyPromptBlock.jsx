import React, { useState } from "react";

const CopyPromptBlock = ({ productDetails }) => {
  const [copied, setCopied] = useState(false);

  const promptText = `You are an AI that generates realistic customer reviews for ecommerce products.

INPUTS YOU RECEIVE:
1) A product screenshot showing its look/design (provided above or as an attached file).
2) A short technical description with cloth, fit, print types, and quality (provided above).

TASK:
- Produce 5-10 ( can be any number between 5-10 for more realistic results) fake but realistic reviews in pure JSON (array of objects). No extra text before or after the JSON.
- Each object must include:
  "title": short, catchy headline,
  "name": full Indian name (first & last),
  "comment": 2-3 sentences in natural human language (English or Hinglish). Mix praise with small issues (e.g., sizing, weight, print feel, delivery).
  "rating": integer 1-5.

STYLE & DIVERSITY RULES:
- Sound like real people. Vary tone and vocabulary. Keep it casual, occasionally Hinglish (e.g., "mast hai", "thoda late aaya").
- Include use cases: daily wear, gifting, parties, college, office, styling tips.
- Ensure 1-2 reviews have a 2-star rating explicitly for late delivery or shipping delays.
- Include a few neutral/constructive points (e.g., runs big/small, thick fabric feels warm in summer).
- Avoid repeating names, phrases, or identical sentence structures.
- Ratings distribution should feel organic (mostly 4-5, a couple 3, and 1-2 at 2 stars for delivery issues).

Product Name - ${productDetails?.name || ""}

Product Short Description
${productDetails?.shortDescription || ""}

OUTPUT FORMAT EXAMPLE (structure only; generate fresh content each time):
[
  {
    "title": "Premium feel!",
    "name": "Nikhil Arora",
    "comment": "Embroidery is crisp and feels premium. Fabric is thick and comfy—totally worth it.",
    "rating": 5
  },
  {
    "title": "Delivery was late",
    "name": "Sameer Joshi",
    "comment": "Quality is solid but parcel reached a week late. Missed the event I planned it for.",
    "rating": 2
  }
]`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="border rounded-xl p-4 mb-6 relative">
      <p className="text-xs uppercase text-gray-500 mb-2">Copy-Ready Prompt</p>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-1 rounded hover:bg-gray-700 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
        {promptText}
      </pre>
    </div>
  );
};

export default CopyPromptBlock;
