import { useCallback, useRef } from 'react';
import { ObjectSchema, ValidationError } from 'yup';
import { useForm as useFormOriginal } from 'react-hook-form';
import {
  FieldValues,
  UseFormMethods,
  UseFormOptions,
} from 'react-hook-form/dist/types';

/* eslint-disable @typescript-eslint/ban-types */
const useYupValidationResolver = <T extends object | undefined>(
  validationSchema?: ObjectSchema<T>,
) =>
  useCallback(
    async (data) => {
      if (!validationSchema) return { values: data, errors: {} };

      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: (errors as ValidationError).inner.reduce(
            (
              allErrors: Record<string, unknown>,
              currentError: { path: string; type?: string; message: string },
            ) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );

// eslint-disable-next-line
export type Form<T = any> = UseFormMethods<Exclude<T, undefined>> & {
  formRef: React.RefObject<HTMLFormElement>;
};

export function useForm<
  T extends object | undefined,
  TFieldValues extends FieldValues = FieldValues,
  TContext extends Record<string, unknown> = Record<string, unknown>,
>({
  schema,
  ...params
}: UseFormOptions<TFieldValues, TContext> & {
  schema?: ObjectSchema<T>;
} = {}): Form<T> {
  const resolver = useYupValidationResolver(schema);
  const result = useFormOriginal({
    ...params,
    resolver,
  }) as Form<T>;

  result.formRef = useRef<HTMLFormElement>(null);

  return result;
}
