import Button from "@/components/Common/Button";
import { useActiveTab, useMusicPlayerStore } from "@/zustand/store";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BiFolderPlus } from "react-icons/bi";

const MusicLibrary = ({ searchVal }: { searchVal: string | undefined }) => {
  const setCurrentPlayingSong = useMusicPlayerStore(
    (store) => store.setCurrentPlayingSong
  );
  const currentSong = useMusicPlayerStore((store) => store.currentSong);
  const elapsedTime = useMusicPlayerStore((store) => store.elapsedTime);
  const files = useMusicPlayerStore((store) => store.files);
  const setFiles = useMusicPlayerStore((store) => store.setFiles);
  const setCurrentId = useMusicPlayerStore((store) => store.setCurrentId);
  const tab = useActiveTab((store) => store.tab);
  const height = useMusicPlayerStore((store) => store.height);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const fileArray = Array.from(fileList);
      setFiles(fileArray);
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const openLibraryUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  console.log("height ", height);
  return (
    <div className="relative">
      <div
        className={`bg-white  ${
          files.length > 0 ? "justify-between" : "justify-start "
        } flex items-center mx-5`}
      >
        <div>
          {" "}
          <h1 className="font-bold text-4xl mt-5">{tab}</h1>
        </div>
        {files.length > 0 && (
          <div>
            <Button
              onClick={openLibraryUpload}
              size="xs"
              name="Add Folder"
              radius="md"
            >
              <BiFolderPlus size={20} />
            </Button>
          </div>
        )}
      </div>{" "}
      <input
        type="file"
        ref={inputRef}
        // @ts-ignore
        webkitdirectory="true"
        onChange={handleFolderChange}
        className="hidden"
      />
      <div className={`mt-2 overflow-y-auto`} style={{ height: height - 250 }}>
        {files
          .filter((file) => file.type.startsWith("audio/"))
          .map((file, idx) => (
            <div
              // @ts-ignore
              key={idx}
              className={`flex justify-between ${
                file.name === currentSong?.name ? "bg-gray-400" : "bg-gray-200"
              } p-2 rounded-md mx-2  gap-2 items-center mb-2 px-5 py-2`}
            >
              <div className="flex gap-5">
                <p className="rounded-full h-5 w-5 p-3 bg-white flex justify-center items-center">
                  {idx + 1}
                </p>
                <p className="">{file.name}</p>
              </div>
              <div>
                <Button
                  variant="dark"
                  size="xs"
                  radius="md"
                  onClick={() => {
                    setCurrentId(idx);
                    setCurrentPlayingSong(file);
                  }}
                >
                  {currentSong?.name === file.name ? (
                    <p>
                      {elapsedTime.minutes.toString().padStart(2, "0")}:
                      {elapsedTime.seconds.toString().padStart(2, "0")}
                    </p>
                  ) : (
                    <Play size={20} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        {files.length === 0 && (
          <div className="relative h-full ">
            <EmptyMusic openLibraryUpload={openLibraryUpload} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicLibrary;
interface Music {
  openLibraryUpload: () => void;
}

const EmptyMusic = ({ openLibraryUpload }: Music) => {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-2">
      <h1 className="font-bold text-2xl">No Music Found!</h1>
      <div>
        <Button
          onClick={openLibraryUpload}
          size="xs"
          name="Add Folder"
          radius="md"
        >
          <BiFolderPlus size={20} />
        </Button>
      </div>
    </div>
  );
};
