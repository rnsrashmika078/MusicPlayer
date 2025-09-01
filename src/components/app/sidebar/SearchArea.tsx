import { Search } from "lucide-react";
import React from "react";

interface SearchAreaProps extends React.InputHTMLAttributes<HTMLInputElement> {
  radius?: "xs" | "md" | "xl" | "full";
  placeholder?: string;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchArea = React.forwardRef<HTMLInputElement, SearchAreaProps>(
  (props, ref) => {
    const { placeholder, handleOnChange, ...rest } = props;
    return (
      <div className="relative">
        <div
          className="absolute text-white 
                top-1/2 -translate-y-1/2 bg-gray-500 h-full flex justify-center items-center w-10 rounded-l-2xl"
        >
          <Search size={20} />
        </div>
        <input
          ref={ref}
          placeholder={placeholder}
          {...rest}
          onChange={handleOnChange}
          className="border shadow-sm rounded-2xl p-1 pl-12 w-full bg-gray-100 border-gray-200"
        />
      </div>
    );
  }
);

SearchArea.displayName = "SearchArea";

export default SearchArea;
