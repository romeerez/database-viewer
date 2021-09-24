import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';
import SelectWithInput from './SelectWithInput';

export default function TimeInput({
  day,
  updateValue,
  max,
  unit,
}: {
  day: Dayjs;
  updateValue(day: Dayjs): void;
  max: number;
  unit: 'hour' | 'minute' | 'second';
}) {
  const [value, setValue] = useState('');
  const options = useMemo(
    () =>
      Array.from({ length: max }).map((_, i) => ({
        value: String(i),
      })),
    [],
  );

  useLayoutEffect(() => {
    const value = day[unit]();
    setValue(String(isNaN(value) ? 0 : value));
  }, [day]);

  const update = (value: string) => {
    setValue(value);
    const number = parseInt(value);
    if (number > 0 && number < max) updateValue(day[unit](number) as Dayjs);
  };

  return <SelectWithInput value={value} setValue={update} options={options} />;
}
