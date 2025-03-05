import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string | number) => void;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  control,
  options,
  error,
  onChange,
}: FormSelectProps<T>) {
  return (
    <div className="flex flex-col space-y-1 mb-8">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            value={field.value ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : e.target.value;
              field.onChange(value);
              onChange?.(value as string | number);
            }}
            className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
