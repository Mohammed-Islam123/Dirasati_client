import SearchBar from "../ui/SearchBar";
import { GrAddCircle } from "react-icons/gr";

import { useState } from "react";

const UpperSearch = () => {
  const [, setSearchTerm] = useState("");

  return (
    <div className="w-full flex justify-between items-center ">
      <SearchBar setSearchTerm={setSearchTerm} />
      <div className="flex justify-between items-center  w-[30%]">
        <select
          id="filtre"
          className="border-2 border-[var(--color-yousra)]  p-1.5 rounded-full text-[var(--color-yousra)] w-[120px] text-[15px]"
        >
          <option value="alphabet">Alphabet</option>
          <option value="age">Âge</option>
        </select>

        <button className="flex items-center gap-2 bg-[var(--color-yousra)] text-white px-4 py-2 rounded-full shadow-lg hover:shadow-2xl hover:cursor-pointer hover:scale-105 transition-all duration-200">
          <span>Ajouter un Eleve</span> <GrAddCircle />
        </button>
      </div>
    </div>
  );
};

export default UpperSearch;
