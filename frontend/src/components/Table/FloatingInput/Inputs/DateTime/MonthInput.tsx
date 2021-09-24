import { Dayjs } from 'dayjs';
import React, { useLayoutEffect, useRef, useState } from 'react';
import SelectWithInput from './SelectWithInput';

const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, i) => ({ value: String(i), label }));

export default function MonthInput({
  day,
  updateValue,
}: {
  day: Dayjs;
  updateValue(day: Dayjs): void;
}) {
  const [month, setMonth] = useState('');
  const skipMonthUpdate = useRef(false);

  useLayoutEffect(() => {
    if (skipMonthUpdate.current) {
      skipMonthUpdate.current = false;
    } else {
      setMonth(String(day.month() + 1));
    }
  }, [day]);

  const updateMonth = (value: string) => {
    setMonth(value);
    const number = parseInt(value);
    let month: number | undefined;
    if (isNaN(number)) {
      const lower = value.slice(0, 2).toLowerCase();
      const option = monthOptions.find(
        (option) => option.label.slice(0, 2).toLowerCase() === lower,
      );
      if (option) {
        month = parseInt(option.value);
      }
    } else if (number > 1 && number < 13) {
      month = number - 1;
    }

    if (month !== undefined) {
      skipMonthUpdate.current = true;
      updateValue(day.month(month));
    }
  };

  const selectMonth = (value: string) => {
    updateValue(day.month(parseInt(value)));
  };

  return (
    <SelectWithInput
      value={month}
      setValue={updateMonth}
      selectValue={selectMonth}
      options={monthOptions}
    />
  );
}
