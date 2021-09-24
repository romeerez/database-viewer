import { Dayjs } from 'dayjs';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import SelectWithInput from './SelectWithInput';

export default function DateInput({
  day,
  updateValue,
}: {
  day: Dayjs;
  updateValue(day: Dayjs): void;
}) {
  const [date, setDate] = useState('');
  const daysInMonth = useMemo(() => day.daysInMonth(), [day]);
  const dateOptions = useMemo(
    () =>
      Array.from({ length: daysInMonth }).map((_, i) => ({
        value: String(i + 1),
      })),
    [daysInMonth],
  );

  useLayoutEffect(() => {
    const date = day.date();
    setDate(String(isNaN(date) ? '' : date));
  }, [day]);

  const updateDate = (value: string) => {
    setDate(value);
    const date = parseInt(value);
    if (date > 1 && date < daysInMonth) updateValue(day.date(date));
  };

  return (
    <SelectWithInput value={date} setValue={updateDate} options={dateOptions} />
  );
}
