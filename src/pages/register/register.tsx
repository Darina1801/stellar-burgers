import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { useDispatch } from '../../services/store';
import { setUser } from '@slices/rootSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    setErrorText('');
    try {
      const data = await registerUserApi({ email, password, name: userName });
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
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
