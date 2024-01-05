import { useRoute, type RouteProp } from '@react-navigation/core';
import { instanceToPlain } from 'class-transformer';
import { useFormik, type FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { MMKVKeys, ROUTES } from '../../../constants';
import { LOGIN } from '../../../graphql';
import { useMutationWithCancelToken } from '../../../hooks';
import { setStorageString } from '../../../services';
import { SigninFormSchema, navigateWithParam } from '../../../utils';
import type { SigninFormValues, SigninHookReturnType, SigninRouteParamList } from './SigninTypes';

interface LoginVariables {
  email: String;
  password: String;
}

/**
 * Hook that returns the ref to the sign in form and the function to submit the form.
 * @returns formik props
 */
export default function useSignin(): SigninHookReturnType {
  const route = useRoute<RouteProp<SigninRouteParamList, 'Signin'>>();
  const [login, { data, loading }] = useMutationWithCancelToken<LoginPayloadData, LoginVariables>(
    LOGIN
  );
  const [view] = useState('login');

  interface FornikValues {
    email: String;
    password: String;
  }

  interface LoginPayloadData {
    login: LoginCred;
  }
  interface LoginCred {
    token: String;
    user: FornikValues;
  }

  /**
   * this function handle auth actions such as login and sign up
   */
  const handleAuthAction = async (values: FornikValues) => {
    if (view === 'login') {
      login({
        variables: {
          email: values?.email,
          password: values?.password
        }
      });
    }
  };

  /**
   * this function handle auth actions login credentials
   */
  const handleLoginCreds = async (loginCred: LoginCred) => {
    await setStorageString(MMKVKeys.loginDetail, JSON.stringify(instanceToPlain(loginCred)));
    await navigateWithParam(ROUTES.ChatListScreen);
  };

  useEffect(() => {
    if (data?.login) {
      handleLoginCreds(data?.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.login]);
  /* Creating a formik object that is used to submit the form. */
  const formik: FormikProps<SigninFormValues> = useFormik<SigninFormValues>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: SigninFormSchema,
    onSubmit: (values) => handleAuthAction(values)
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

  return { ...formik, loading };
}
