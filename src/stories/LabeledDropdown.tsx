import Dropdown from "./Dropdown";

type LabeledDropdownProps = {
  label: string;
  options: string[];
  isMultiple?: boolean;
  isSearchEnable?: boolean;
  onSelect: (option: string | string[]) => void;
};

export const LabeledDropdown = (props: LabeledDropdownProps) => {
  return (
    <div className='flex gap-2 w-full align-middlea justify-center'>
      <label className="h-auto items-center basis-2/12 flex flex-shrink-0 text-lg font-semibold whitespace-nowrap">{props.label}</label>
      <div className="flex-grow basis-10/12">
        <Dropdown {...props} />
      </div>
    </div>
  );
}