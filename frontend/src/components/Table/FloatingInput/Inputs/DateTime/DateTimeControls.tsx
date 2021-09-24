import React, { useMemo } from 'react';
import { useTablePageContext } from '../../../TablePage.context';
import dayjs, { Dayjs } from 'dayjs';
import DateInput from './DateInput';
import MonthInput from './MonthInput';
import YearInput from './YearInput';
import TimeInput from './TimeInput';

export default React.memo(function DateTimeControls() {
  const { floatingInputService } = useTablePageContext();
  const store = floatingInputService.dateTimeInputStore;
  const value = store.use('value');

  const day = useMemo(() => dayjs(value), [value]);

  const updateValue = (day: Dayjs) => {
    const formatted = day.format('YYYY-MM-DD HH:mm:ss.SSS');
    if (dayjs(formatted).valueOf() === day.valueOf()) {
      floatingInputService.setValue(formatted);
    }
  };

  return (
    <div className="py-2 px-4 mt-1 text-sm space-y-2">
      <div className="flex space-x-2">
        <DateInput day={day} updateValue={updateValue} />
        <MonthInput day={day} updateValue={updateValue} />
        <YearInput day={day} updateValue={updateValue} />
      </div>
      <div className="flex space-x-2">
        <TimeInput day={day} updateValue={updateValue} max={24} unit="hour" />
        <TimeInput day={day} updateValue={updateValue} max={60} unit="minute" />
        <TimeInput day={day} updateValue={updateValue} max={60} unit="second" />
      </div>
    </div>
  );
});
