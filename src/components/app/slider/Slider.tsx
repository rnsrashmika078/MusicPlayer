import { useMusicPlayerStore } from "@/zustand/store";
import React, { useEffect, useRef, useState } from "react";
interface Props {
  externalPosition?: number;
  purpose: string;
}
const Slider = ({ externalPosition, purpose }: Props) => {
  const seekPosition = useMusicPlayerStore((store) => store.seekPosition);
  const volumeLevel = useMusicPlayerStore((store) => store.volumeLevel);
  const setSeekPosition = useMusicPlayerStore((store) => store.setSeekPosition);
  const setVolumeLevel = useMusicPlayerStore((store) => store.setVolumeLevel);
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    moveDot(e);
  };

  const stopDrag = () => setDragging(false);

  const moveDot = (e: MouseEvent | React.MouseEvent) => {
    if (!barRef.current) return;
    const bar = barRef.current;
    const rect = bar.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    if (purpose === "volume") {
      const val = (x / rect.width) * 100;
      setVolumeLevel(val);
      window.electronAPI.saveVolume(val);
    } else {
      setSeekPosition((x / rect.width) * 100);
    }
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) moveDot(e);
  };

  // Add/remove mousemove listener
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopDrag);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return (
    <div className="flex w-full z-100">
      <div
        ref={barRef}
        className=" relative h-1 mx-5 bg-gray-400 rounded w-full cursor-pointer"
        onMouseDown={startDrag}
      >
        <div
          ref={barRef}
          className="p-0.5 bg-[#61d7f1]  backdrop-blur-xs rounded cursor-pointer top-2"
          onMouseDown={startDrag}
          style={{
            width: `${
              externalPosition
                ? externalPosition
                : purpose === "volume"
                ? volumeLevel
                : seekPosition
            }%`,
          }}
        ></div>

        <div
          className="absolute top-0.5 -translate-y-1/2 left-1/2 w-5 h-5 bg-gray-600 rounded-full transition-transform"
          style={{
            left: `${
              externalPosition
                ? externalPosition
                : purpose === "volume"
                ? volumeLevel
                : seekPosition
            }%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="absolute transition-all bg-[#61d7f1] backdrop-blur-xs  hover:p-2 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3"></div>
          {dragging && (
            <div
              className="select-none relative flex justify-center items-center -top-6 -translate-y-1  place-items-center text-white w-9 h-7 text-xs  bg-[#2525259a] border rounded-sm "
              style={{
                left: `${
                  externalPosition
                    ? externalPosition
                    : purpose === "volume"
                    ? volumeLevel
                    : seekPosition
                }%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {purpose === "volume" ? volumeLevel.toFixed(0) : "Seek"}
            </div>
          )}
        </div>
      </div>
      {/* <p className="mt-2 text-sm">Position: {position.toFixed(1)}%</p> */}
    </div>
  );
};

export default Slider;
