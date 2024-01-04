import { useRoute, type RouteProp } from '@react-navigation/core';
import { useFormik, type FormikProps } from 'formik';
import { useEffect } from 'react';
import { SigninFormSchema } from '../../../utils';
import type { SigninFormValues, SigninHookReturnType, SigninRouteParamList } from './SigninTypes';
/**
 * Hook that returns the ref to the sign in form and the function to submit the form.
 * @returns formik props
 */
export default function useSignin(): SigninHookReturnType {
  const route = useRoute<RouteProp<SigninRouteParamList, 'Signin'>>();
  /* Creating a formik object that is used to submit the form. */
  const formik: FormikProps<SigninFormValues> = useFormik<SigninFormValues>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SigninFormSchema,
    onSubmit: () => {
      // signinRequest({
      //   variables: {
      //     email: values.email,
      //     password: values.password
      //   }
      // });
    }
  });

  useEffect(() => {
    formik?.setFieldValue('email', route.params?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.email]);

  useEffect(() => {
    return () => {
      // abort();
    };
  }, []);

  return { ...formik, loading: false };
}
