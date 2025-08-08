import { SearchIcon } from "../../../assets/icons/index";

const DocumentControl = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-[471px] font-[Livvic]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full h-10 px-[18px] py-2 justify-end items-center gap-[10px] rounded-full border border-[#E8E8E8] bg-[#F5F5F5]"
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
        <SearchIcon />
      </div>
    </div>
  );
};

export default DocumentControl;
