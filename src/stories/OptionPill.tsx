import CloseIcon from '../assets/close.svg';

type OptionPillProps = {
  label: string;
  onRemove: (option: string) => void;
};

export const OptionPill = (props: OptionPillProps) => {
  return (
    <div className='bg-blue-500 text-white px-4 py-2 rounded-full flex gap-2 flex-nowrap whitespace-nowrap align-middle'>
      <span className="overflow-ellipsis overflow-hidden whitespace-nowrap max-w-[200px] text-xs">{props.label}</span>
      <img 
        src={CloseIcon} 
        className='font-bold w-4 text-white h-4 hover:cursor-pointer z-10' 
        onClick={() => props.onRemove(props.label) } 
      />
    </div>
  );
}