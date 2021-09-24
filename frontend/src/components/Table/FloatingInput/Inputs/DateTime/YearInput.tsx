import { Dayjs } from 'dayjs';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import SelectWithInput from './SelectWithInput';

export default function YearInput({
  day,
  updateValue,
}: {
  day: Dayjs;
  updateValue(day: Dayjs): void;
}) {
  const [year, setYear] = useState('');
  const yearOptions = useMemo(() => {
    const count = 50;
    const current = new Date().getFullYear();
    return Array.from({ length: count }).map((_, i) => ({
      value: String(current - i),
    }));
  }, []);

  useLayoutEffect(() => {
    const year = day.year();
    setYear(String(isNaN(year) ? new Date().getFullYear() : year));
  }, [day]);

  const updateYear = (value: string) => {
    setYear(value);
    const year = parseInt(value);
    if (!isNaN(year)) updateValue(day.year(year));
  };

  return (
    <SelectWithInput
      value={year}
      setValue={updateYear}
      options={yearOptions}
      widthClassName="w-16"
    />
  );
}
