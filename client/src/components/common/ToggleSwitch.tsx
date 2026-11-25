import React, { useId } from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  ariaLabel?: string;
  activeColor?: string;
}

/**
 * Accessible toggle switch using a hidden/visually-integrated checkbox input
 * with native switch semantics and HSBC crisp pill visual presentation.
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  ariaLabel,
  activeColor = 'bg-[#16864A]',
}) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer select-none shrink-0"
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        aria-label={ariaLabel || label || 'Toggle setting'}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`w-11 h-6 rounded-full transition-colors relative block peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#DB0011] ${
          checked ? activeColor : 'bg-gray-300'
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-1 transition-transform duration-150 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </label>
  );
};
