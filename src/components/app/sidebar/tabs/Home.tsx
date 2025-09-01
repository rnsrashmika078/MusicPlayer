import { useMusicPlayerStore } from "@/zustand/store";
import { metadata } from "@/types/type";
import MusicImage from "@/assets/music/music.jpeg";
import { useEffect, useState } from "react";
import { CgPlayButton } from "react-icons/cg";
const Home = ({ searchVal }: { searchVal: string | undefined }) => {
  const files = useMusicPlayerStore((store) => store.files);
  const currentSong = useMusicPlayerStore((store) => store.currentSong);
  const setCurrentPlayingSong = useMusicPlayerStore(
    (store) => store.setCurrentPlayingSong
  );

  const [metaArray, setMetaArray] = useState<metadata[]>([]);
  const [filter, setFilter] = useState<File[]>([]);

  async function showMetaDataArray(filePath: string[]) {
    if (!filePath) return;

    try {
      const metadata = await window.electronAPI.getMetadataArray(filePath);
      if (Array.isArray(metadata)) {
        setMetaArray(metadata);
      }
    } catch (err) {
      console.error("Failed to get metadata:", err);
    }
  }

  useEffect(() => {
    if (!files) return;

    if (searchVal) {
      const filteredData = files.filter((item) =>
        item.name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilter(filteredData);
    } else {
      setFilter(files);
    }
  }, [searchVal]);
  useEffect(() => {
    if (!files) return;
    const paths = files.map((items) => items.path);
    showMetaDataArray(paths);
  }, [files]);
  return (
    <div className="p-3 ">
      <h1 className="font-bold text-4xl mb-5 ">All Songs</h1>
      <div className="p-2 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 overflow-y-auto h-[520px]">
        {filter.map((music, idx) => (
          <div onClick={() => setCurrentPlayingSong(music)} className="">
            <div className="  relative bg-white transition-all flex flex-col h-36 w-36  justify-center items-center hover:scale-105 border rounded-md border-gray-200 shadow-md">
              <img
                src={
                  metaArray[idx]?.picture ? metaArray[idx]?.picture : MusicImage
                }
                className={`  ${
                  metaArray[idx]?.picture
                    ? "w-full h-full object-cover rounded-md"
                    : "w-20 h-20 flex flex-shrink-0 rounded-md"
                }`}
                alt="Logo"
              />
              {music.name === currentSong?.name ? (
                <div className="absolute">
                  <CgPlayButton
                    size={200}
                    className="animate-pulse duration-600"
                    color="white"
                  />
                </div>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none`}
                ></div>
              )}
            </div>
            <h1 className="p-1 w-36 truncate text-center">{music.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
