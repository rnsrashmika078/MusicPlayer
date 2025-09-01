import { useEffect } from "react";
import Main from "./components/app/main/Main";
import { useMusicPlayerStore } from "./zustand/store";
export default function App() {
  const setHeight = useMusicPlayerStore((store) => store.setHeight);
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      setHeight(height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="font-custom text-[var(--foreground)]">
      <Main />
    </div>
  );
}
