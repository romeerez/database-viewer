import React from 'react';
import Menu from 'components/Common/Menu/Menu';
import Input from 'components/Common/Form/Input';
import MenuItem from 'components/Common/Menu/MenuItem';
import { Form } from 'lib/useForm';
import { useWatch } from 'react-hook-form';
import FormGroup from 'components/Common/Form/FormGroup';

export type Option = {
  label?: string;
  value: string;
};

const menuClassId = 'select-menu';

export default function SelectGroup({
  form,
  name,
  autoFocus,
  label,
  options,
}: {
  form: Form;
  name: string;
  autoFocus?: boolean;
  label: string;
  options: Option[];
}) {
  const [open, setOpen] = React.useState(false);

  const onFocus = () => setOpen(true);

  const onBlur = (e: React.SyntheticEvent) => {
    const el = ((e.nativeEvent as unknown) as { relatedTarget: HTMLElement })
      .relatedTarget;

    if (el?.closest(`.${menuClassId}`)) return;
    setOpen(false);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);
  const refs = React.useRef<HTMLButtonElement[]>([]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      refs.current[0]?.focus();
    } else if (e.key === 'ArrowUp') {
      refs.current[refs.current.length - 1]?.focus();
    }
  };

  const setButtonRef = (el: HTMLButtonElement | null) => {
    if (!el) return;
    if (refs.current.length === options.length) refs.current.length = 0;
    refs.current.push(el);
  };

  const onOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onOptionSelect(e);
      return;
    }

    const down = e.key === 'ArrowDown';
    const up = e.key === 'ArrowUp';
    if (!down && !up) return;

    const current = e.target as HTMLButtonElement;
    const index = refs.current.indexOf(current);
    if (index === -1) return;

    let toFocus: HTMLButtonElement | HTMLInputElement | null =
      refs.current[down ? index + 1 : index - 1];

    if (!toFocus) toFocus = inputRef.current;

    if (toFocus) toFocus.focus();
  };

  const onOptionSelect = (e: React.SyntheticEvent) => {
    const el = e.target as HTMLButtonElement;
    form.setValue(name, el.value);
    setOpen(false);

    const formElement = form.formRef.current;
    const inputElement = inputRef.current;
    if (!formElement || !inputElement) return;

    const lastButtonIndex = Array.prototype.indexOf.call(
      formElement.elements,
      refs.current[refs.current.length - 1],
    );
    if (lastButtonIndex === -1) return;

    const nextInput = formElement.elements[lastButtonIndex + 1] as HTMLElement;
    if (nextInput) nextInput.focus();
  };

  const value = useWatch({
    control: form.control,
    name,
  }) as string;

  const lowerValue = value?.toLocaleLowerCase();
  const processedOptions = lowerValue
    ? options.sort(({ label, value }) =>
        (label || value).toLocaleLowerCase().includes(lowerValue) ? -1 : 0,
      )
    : options;

  return (
    <FormGroup form={form} name={name} label={label}>
      <Menu
        open={open}
        setOpen={setOpen}
        className={`w-full ${menuClassId}`}
        button={() => (
          <Input
            autoComplete="off"
            inputRef={(input) => {
              form.register(input);
              (inputRef as {
                current: HTMLInputElement | null;
              }).current = input;
            }}
            name={name}
            autoFocus={autoFocus}
            onKeyDown={onInputKeyDown}
            onFocus={onFocus}
            onClick={onFocus}
            onBlur={onBlur}
          />
        )}
      >
        {() => (
          <>
            {processedOptions.map(({ label, value }) => (
              <MenuItem
                key={value}
                buttonRef={setButtonRef}
                onKeyDown={onOptionKeyDown}
                onClick={onOptionSelect}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                tabIndex={-1}
              >
                {label || value}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </FormGroup>
  );
}
