// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps {
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode>("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string, label: React.ReactNode) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    setIsOpen(false);
    onValueChange(value);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              selectedLabel,
              isOpen,
            });
          }
          if (child.type === SelectContent) {
            return isOpen
              ? React.cloneElement(child, { onSelect: handleSelect })
              : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<
  SelectTriggerProps & {
    onClick?: () => void;
    selectedLabel?: React.ReactNode;
    isOpen?: boolean;
  }
> = ({ children, className = "", onClick, selectedLabel, isOpen }) => {
  return (
    <button
      type="button"
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between ${className}`}
      onClick={onClick}
    >
      <span className={selectedLabel ? "text-gray-900" : "text-gray-500"}>
        {selectedLabel ||
          (
            React.Children.toArray(children).find(
              (child) =>
                React.isValidElement(child) && child.type === SelectValue
            ) as React.ReactElement
          )?.props.placeholder}
      </span>
      <ChevronDown
        className={`h-4 w-4 text-gray-400 transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};

export const SelectContent: React.FC<
  SelectContentProps & {
    onSelect?: (value: string, label: React.ReactNode) => void;
  }
> = ({ children, onSelect }) => {
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, { onSelect });
        }
        return child;
      })}
    </div>
  );
};

export const SelectItem: React.FC<
  SelectItemProps & {
    onSelect?: (value: string, label: React.ReactNode) => void;
  }
> = ({ value, children, onSelect }) => {
  return (
    <div
      className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
      onClick={() => onSelect?.(value, children)}
    >
      {children}
    </div>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};
