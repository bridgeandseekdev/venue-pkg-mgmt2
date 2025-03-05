import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormTextAreaProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function FormTextArea<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  error,
  onChange,
}: FormTextAreaProps<T>) {
  return (
    <div className="flex flex-col space-y-1 mb-8">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value);
            }}
            className="border border-gray-300 w-full h-24 rounded-md text-sm px-3 py-2"
            placeholder={placeholder}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
