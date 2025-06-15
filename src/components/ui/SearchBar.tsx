import { ImSearch } from "react-icons/im";

type SearchBarProps = {
  setSearchTerm: (term: string) => void;
};

const SearchBar = ({ setSearchTerm }: SearchBarProps) => {
  return (
    <div className="flex items-center justify-between rounded-[100px] bg-white h-[40px]  border-2 border-[var(--color-yousra)] p-0.5">
      <input
        className="rounded-[100px] h-full w-[90%]  p-2 outline-none focus:ring-0 "
        placeholder="Search..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="bg-[var(--color-yousra)] h-full rounded-[100px] flex items-center justify-center  w-[80px]">
        <ImSearch className="text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default SearchBar;
