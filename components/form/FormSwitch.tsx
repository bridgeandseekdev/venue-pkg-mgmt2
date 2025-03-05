import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Switch } from '../ui/Switch';

interface FormSwitchProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  onChange?: (checked: boolean) => void;
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  control,
  onChange,
}: FormSwitchProps<T>) {
  return (
    <div className="flex justify-between align-middle mb-8">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              onChange?.(checked);
            }}
          />
        )}
      />
    </div>
  );
}
