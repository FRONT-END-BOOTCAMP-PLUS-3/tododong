import { InputHTMLAttributes } from 'react';
import styles from './AuthInput.module.scss';

type AuthInputProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  isInvalid?: boolean;
  children?: React.ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;

const AuthInput = ({
  name,
  label,
  onChange,
  onBlur,
  isInvalid = false,
  children,
  value,
  ...restProps
}: AuthInputProps) => {
  return (
    <div
      className={`${styles.inputWrapper} ${isInvalid ? styles.isInvalid : ''}`}
    >
      <input
        id={name}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        required
        aria-required
        {...restProps}
      />
      <label htmlFor={name} className={value ? styles.updating : ''}>
        {label}
      </label>
      {children}
    </div>
  );
};

export default AuthInput;
