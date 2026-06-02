import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export class ThemeSwitch extends React.Component<SwitchProps> {
  private handleClick = (): void => {
    const { disabled, checked, onCheckedChange } = this.props;
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  render(): React.ReactNode {
    const { checked, disabled, id, className, 'aria-label': ariaLabel } = this.props;

    return (
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={this.handleClick}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F6E3D]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EFE8]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-[#5F6E3D]' : 'bg-[#D6C8AF]',
          className
        )}
      >
        <span
          aria-hidden
          className={cn(
            'pointer-events-none block h-6 w-6 rounded-full bg-white shadow-[0_1px_4px_rgba(93,36,19,0.18)] transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    );
  }
}
