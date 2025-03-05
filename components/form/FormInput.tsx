import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  type?: string;
  placeholder?: string;
  error?: string;
  onChange?: (value: string | number) => void;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  control,
  type = 'text',
  placeholder,
  error,
  onChange,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col space-y-1 mb-8">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            id={name}
            onChange={(e) => {
              field.onChange(e);
              onChange?.(
                type === 'number' ? Number(e.target.value) : e.target.value,
              );
            }}
            className="border border-gray-300 w-full h-10 rounded-md text-sm px-3 py-2"
            placeholder={placeholder}
          />
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
