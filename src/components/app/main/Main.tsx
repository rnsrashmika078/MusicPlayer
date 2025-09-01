import Sidebar from "../sidebar/Sidebar";

import { useActiveTab, useMusicPlayerStore } from "@/zustand/store";

import SearchArea from "../sidebar/SearchArea";
import MusicLibrary from "../sidebar/tabs/MusicLibrary";
import MusicPlayerController from "../musicplayer/MusicPlayerController";
import { useEffect, useState } from "react";
import Home from "@/components/app/sidebar/tabs/Home";
import Settings from "../sidebar/tabs/Settings";
const Main = () => {
  const [searchVal, setSearchVal] = useState<string | undefined>(undefined);

  const tab = useActiveTab((store) => store.tab);
  const setActiveTab = useActiveTab((store) => store.setActiveTab);

  useEffect(() => {
    window.electronAPI.getTab().then((v) => setActiveTab(v));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="z-[9999] fixed bottom-0 bg-white w-full left-0 border-t border-gray-300">
        <MusicPlayerController />
      </div>
      <div className="relative flex-[1] w-60 ml-14 md:ml-64">
        <div className="w-1/3 mt-5">
          <SearchArea handleOnChange={(e) => setSearchVal(e.target.value)} />
        </div>
        {tab === "Music Library" && (
          <div>
            <MusicLibrary searchVal={searchVal} />
          </div>
        )}
        {tab === "Home" && (
          <div>
            <Home searchVal={searchVal} />
          </div>
        )}
        {tab === "Settings" && (
          <div>
            <Settings searchVal={searchVal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
