import React, { useEffect, useState } from "react";

interface PostPromptProps {
  onPrompt: () => void; // meghívódik, amikor a felhasználó rákattint a posztolásra
}

const PostPrompt: React.FC<PostPromptProps> = ({ onPrompt }) => {
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    const schedulePrompt = () => {
      // Random idő 1-2 órán belül (3600000ms = 1 óra)
      const randomDelay = Math.floor(Math.random() * 2 * 60 * 60 * 1000);
      setTimeout(() => {
        setShowPrompt(true);
      }, randomDelay);
    };

    schedulePrompt();
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
    // újra ütemezés a következő értesítésre
    const randomDelay = Math.floor(Math.random() * 2 * 60 * 60 * 1000);
    setTimeout(() => setShowPrompt(true), randomDelay);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 w-80">
        <h2 className="text-xl font-bold text-blue-600">Ideje posztolni!</h2>
        <p className="text-gray-700 text-sm">
          Oszd meg, miért voltál ma büszke! Csak így láthatod mások posztját.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              onPrompt();
              handleClose();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Posztolok
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Később
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPrompt;
