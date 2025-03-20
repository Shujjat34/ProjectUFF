import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronRight } from 'lucide-react';

import Img1 from '../img/img1.jpg'
import Img2 from '../img/img2.jpg'
import Img3 from '../img/img3.jpg'
import Img4 from '../img/img4.jpg'

import Music1 from '../music/ankhon.mp3'
import Music2 from '../music/bulleya.mp3'
import Music3 from '../music/perfect.mp3'
import Music4 from '../music/rangrez.mp3'

interface PhotoGalleryProps {
  onNext: () => void;
}

interface UnoCardData {
  color: string;
  number: string;
  photoUrl: string;
  caption: string;
  musicName: string;
  musicUrl: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onNext }) => {
  // Example data: 4 cards with details
  const cards: UnoCardData[] = [
    {
      color: "bg-red-500",
      number: "1",
      photoUrl: Img1,
      caption: "How i imagine u when you wiwiwiiw",
      musicName: "Ajab Si",
      musicUrl: Music1
    },
    {
      color: "bg-blue-500",
      number: "2",
      photoUrl: Img2,
      caption: "How i imagine you when u jealouss",
      musicName: "Bulleya",
      musicUrl: Music2
    },
    {
      color: "bg-green-500",
      number: "3",
      photoUrl: Img3,
      caption: "How i imagine you when u angyyy",
      musicName: "Perfect",
      musicUrl: Music3
    },
    {
      color: "bg-yellow-500",
      number: "4",
      photoUrl: Img4,
      caption: "wiwiwi",
      musicName: "Rangrez",
      musicUrl: Music4
    },
  ];

  // Track flipped state for each card
  const [flipped, setFlipped] = useState<boolean[]>(Array(cards.length).fill(false));
  // Track which card’s music is playing
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  // Refs for each audio element
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  // Used to trigger entrance animations
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Flip or unflip a card
  const handleFlip = (index: number) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);

    // If flipping a card face-down while its music is playing, pause the music
    if (!newFlipped[index] && playingIndex === index) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
    }
  };

  // Play or pause music on a specific card
  const togglePlay = (index: number) => {
    // Pause any currently playing track if it's a different card
    if (playingIndex !== null && playingIndex !== index) {
      audioRefs.current[playingIndex]?.pause();
    }

    // If clicking the same card that's playing, stop it
    if (playingIndex === index) {
      audioRefs.current[index]?.pause();
      setPlayingIndex(null);
      return;
    }

    // Otherwise, play the new track
    audioRefs.current[index]?.play();
    setPlayingIndex(index);
  };

  return (
    <div
      className={`relative transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
    >
      <h2 className="text-white text-3xl font-bold text-center mb-12">
        Here are some best photos of you and the songs i dedicated to you...
      </h2>

      {/* Cards Grid with staggered entrance animation */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleFlip(index)}
            className={`relative w-64 h-96 cursor-pointer transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ perspective: "1000px", transitionDelay: `${index * 200}ms` }}
          >
            {/* Flipping Card Wrapper */}
            <div
              className={`
                relative w-full h-full rounded-2xl shadow-2xl border-8 border-white
                transition-transform duration-500 transform-style-3d
                ${flipped[index] ? "rotate-y-180" : ""}
              `}
            >
              {/* FRONT: UNO-style card */}
              <div
                className={`
                  absolute w-full h-full rounded-lg flex items-center justify-center
                  ${card.color} backface-hidden
                `}
              >
                <span className="absolute top-2 left-2 text-white text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute top-2 right-2 text-white text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute bottom-2 left-2 text-white text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute bottom-2 right-2 text-white text-sm font-bold">
                  {card.number}
                </span>
                <span className="text-white text-5xl font-extrabold">
                  {card.number}
                </span>
              </div>

              {/* BACK: Photo, caption, and music controls */}
              <div
                className="
                  absolute w-full h-full rounded-lg bg-white backface-hidden
                  rotate-y-180 flex flex-col
                "
              >
                <span className="absolute top-2 left-2 text-gray-500 text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute top-2 right-2 text-gray-500 text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute bottom-2 left-2 text-gray-500 text-sm font-bold">
                  {card.number}
                </span>
                <span className="absolute bottom-2 right-2 text-gray-500 text-sm font-bold">
                  {card.number}
                </span>

                {/* Photo */}
                <div className="relative flex-1 overflow-hidden rounded-t-lg">
                  <img
                    src={card.photoUrl}
                    alt="Memory"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Caption & Music Controls */}
                <div className="p-3 flex flex-col items-center justify-center">
                  <p className="text-gray-800 text-base font-semibold mb-2 text-center">
                    {card.caption}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 text-sm">{card.musicName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card flip when clicking button
                        togglePlay(index);
                      }}
                      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      {playingIndex === index ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  </div>
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={(el) => (audioRefs.current[index] = el)}
                  src={card.musicUrl}
                  onEnded={() => setPlayingIndex(null)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button: only appears if all cards are flipped */}
      {flipped.every((isFlipped) => isFlipped) && (
        <div className={`text-center transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <button
            onClick={onNext}
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-all duration-300 inline-flex items-center"
          >
            Well, i have written something for you madam jiii<ChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
