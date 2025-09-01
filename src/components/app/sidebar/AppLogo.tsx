import ShadcnLogo from "@/assets/shadcn-logo.png";

const AppLogo = () => {
    return (
        <div className="flex gap-2 justify-start items-center px-2 py-5 w-60">
            <div className="w-5 h-5 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center ">
                <img
                    src={ShadcnLogo}
                    className=" rounded-full flex-shrink-0"
                    alt="Logo"
                />
            </div>
            <div className=" flex-col hidden md:block">
                <h1 className="font-bold text-xl">Ozone Music</h1>
                <p className="text-[var(--secondary)] text-sm ">
                    Enjoy the Music
                </p>
            </div>
        </div>
    );
};

export default AppLogo;
