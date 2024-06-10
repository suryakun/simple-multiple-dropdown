import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArrowDown from '../assets/arrow-down.svg';
import SearchIcon from '../assets/search.svg';
import { OptionPill } from './OptionPill';

type DropdownProps = {
  options: string[];
  isMultiple?: boolean;
  isSearchEnable?: boolean;
  onSelect:(option: string | string[]) => void;
};

const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, search] = useState('');
  const deferredKeyword = useDeferredValue(keyword);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [selectedMultipleOptions, setSelectedMultipleOptions] = useState<string[]>([]);
  const [selectedSingleOption, setSelectedSingleOption] = useState<string | null>(null);

  const [options, setOptions] = useState([...new Set(props.options)]);

  const handleOptionSelect = useCallback((option: string) => {
    if (props.isMultiple) {
      setSelectedMultipleOptions(options => [...options, option]);
      setSelectedSingleOption('');
    } else {
      setSelectedSingleOption(option);
      setSelectedMultipleOptions([]);
      setIsOpen(false);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
      search('');
      setOptions(options => options.filter(o => o !== option));
    }
    props.onSelect(props.isMultiple ? [...selectedMultipleOptions, option] : option);
  }, [props.isMultiple, setSelectedMultipleOptions, setSelectedSingleOption, setOptions]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
    setIsOpen(true);
  }, []);

  const filteredOptions = useMemo(() => {
    return deferredKeyword.length ? options.filter(option => option.toLowerCase().includes(deferredKeyword.toLowerCase())).sort()
      : options.sort();
  }, [deferredKeyword, options]);

  const onOptionRemove = useCallback((option: string) => {
    setSelectedMultipleOptions(options => options.filter(o => o !== option));
  }, [setSelectedMultipleOptions]);

  useEffect(() => {
    if (rootRef.current && portalRef.current) {
      portalRef.current.style.top = `${rootRef.current.getBoundingClientRect().bottom}`;
    }
  }, [selectedMultipleOptions]);


  return (
    <div className='relative min-w-[600px]'>
      <div className='flex min-h-16 border border-blue-900 w-full rounded-md relative justify-center align-middle flex-wrap' ref={rootRef}>
        <section className='flex p-4 flex-1'>
          {props.isMultiple && (
            <div className='flex flex-wrap gap-2 flex-grow'>
              {selectedMultipleOptions.map((option, index) => (
                <OptionPill key={index} label={option} onRemove={onOptionRemove} />
              ))}
            </div>
          )}
          {!props.isMultiple && (
            <span className='flex-grow text-left'>
              {selectedSingleOption }
            </span>
          )}
        </section>
        <div 
          className='p-2 justify-center flex align-middle border border-l-2 flex-shrink-0 transition-transform duration-200 ease-in-out transform' 
          onClick={() => setIsOpen(open => !open)}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <img src={ArrowDown} className='w-8 h-full' alt=''/>
        </div>
      </div>
      {isOpen && rootRef.current &&
        createPortal(
          <div 
            ref={portalRef}
            className='flex absolute flex-col z-2000 border-blue-900 border rounded-md w-full max-h-[600px] overflow-y-scroll justify-start transition-transform duration-200 ease-in-out transform translate' 
            style={{top: rootRef.current?.getBoundingClientRect().bottom}}>
            {props.isSearchEnable && (
              <div className='flex w-full p-4 items-center gap-2 sticky top-0 z-10 bg-white'>
                <img src={SearchIcon} className='w-4 h-4' alt=''/>
                <input type='text' className='border-0 flex-grow focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0'
                  onChange={(e) => handleInputChange(e)}
                  ref={inputRef}
                />
              </div>
            )}
            {filteredOptions.length > 0 && filteredOptions.map((option, index) => (
              <div key={index} onClick={() => handleOptionSelect(option)} className='px-4 py-2 text-left hover:bg-blue-300'>
                {option}
              </div>
            ))}
            {!filteredOptions.length && <div className='px-4 py-2 text-center'>No options found</div>}
          </div>,
          rootRef.current as HTMLDivElement
        )}
    </div>
  );
};

export default Dropdown;