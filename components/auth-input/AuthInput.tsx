import { InputHTMLAttributes } from 'react';
import styles from './AuthInput.module.scss';

type AuthInputProps = {
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  children?: React.ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;

const AuthInput = ({
  name,
  onChange,
  onBlur,
  isInvalid = false,
  children,
  ...restProps
}: AuthInputProps) => {
  return (
    <div
      className={`${styles.inputWrapper} ${isInvalid ? styles.isInvalid : ''}`}
    >
      <label htmlFor={name} className="srOnly">
        {name}
      </label>
      <input
        id={name}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        required
        aria-required
        {...restProps}
      />
      {children}
    </div>
  );
};

export default AuthInput;
