import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { useDispatch } from '../../services/store';
import { setUser } from '@slices/rootSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      const data = await loginUserApi({ email, password });
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch(setUser(data.user));
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (e) {
      setErrorText((e as Error).message);
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
