import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, userDataSelector } from '@slices/rootSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const [userError, setUserError] = useState<string | undefined>(undefined);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (formValue.password && formValue.password.length < 6) {
      return setUserError(
        'Некорректный пароль. Пароль должен состоять не менее чем из 6 символов'
      );
    }
    setUserError(undefined);
    const dataToUpdate = formValue.password
      ? formValue
      : { name: formValue.name, email: formValue.email };
    dispatch(
      updateUser(
        dataToUpdate as { name: string; email: string; password: string }
      )
    );
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={userError}
    />
  );
};
