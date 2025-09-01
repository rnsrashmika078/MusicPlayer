import { Home, Info, Music, Settings } from "lucide-react";
import AppLogo from "@/components/app/sidebar/AppLogo";
import { useActiveTab } from "@/zustand/store";

const Sidebar = () => {
  const sidebarTabs = [
    { name: "Home", icon: <Home size={18} /> },
    { name: "Music Library", icon: <Music size={20} /> },
    { name: "App Info", icon: <Info size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];
  const setActiveTab = useActiveTab((store) => store.setActiveTab);
  const tab = useActiveTab((store) => store.tab);

  return (
    <div className="flex h-screen overflow-x-auto">
      <div className="transition-all fixed space-y-5  py-2  top-0 left-0 w-11 md:w-60  h-screen border-r shadow-md border-[var(--border-color)] bg-[var(--background)] z-[9999]">
        <div className="flex flex-col h-[calc(100vh-2rem)] justify-between text-[var(--foreground)]">
          {/* {select === "Settings" && <Widgets />} */}
          <div className="flex flex-col justify-between px-1 py-5 space-y-2">
            <AppLogo />
            <hr className="text-gray-200"></hr>
            {sidebarTabs.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  window.electronAPI.saveTab(item.name);
                  setActiveTab(item.name);
                }}
              >
                <ul
                  className={`${item.name === "Settings" ? "mt-0" : "mt-0"} ${
                    tab === item.name ? "bg-blue-950 text-white" : ""
                  } list-none flex gap-2 hover:bg-blue-950 justify-start items-center hover:text-white p-2 rounded-xl`}
                >
                  <li>{item.icon}</li>
                  <p className="transition-all hidden md:block">{item.name}</p>
                </ul>
              </div>
            ))}
            {/* Settings */}
          </div>
          {/* <div>
                        {[
                            { name: "App Info", icon: <Info size={18} /> },
                            { name: "Settings", icon: <Settings size={18} /> },
                        ].map((items, i) => (
                            <div
                                key={i}
                                className=" transition-all flex flex-col px-1"
                                onClick={() => setSelect(items.name)}
                            >
                                <div className="flex flex-col">
                                    <li
                                        className={`mb-2 ${
                                            select === items.name
                                                ? "bg-blue-950 text-white"
                                                : ""
                                        } list-none flex gap-2 hover:bg-blue-950 justify-start items-center hover:text-white p-2 rounded-xl`}
                                    >
                                        <span>{items.icon}</span>
                                        <p className="transition-all hidden sm:block">
                                            {items.name}
                                        </p>
                                    </li>
                                </div>
                            </div>
                        ))}
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
