import { Repository, Resource } from './repository/repository';

export type InputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
  disabled?: boolean;
  hidden?: boolean;
};

export type ReferenceInputProps<T extends Resource> = InputProps & {
  reference: string;
  referenceLabel: string;
  repository?: Repository<T>;
};

export type ImagePickerProps = InputProps & {
  folder?: string;
  height?: number;
};

export type SelectFieldProps = InputProps & {
  options: string[];
};
