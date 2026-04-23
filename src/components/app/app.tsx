import { FC, useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import styles from './app.module.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading
} from '@slices/rootSlice';
import { useLocation } from 'react-router';
import clsx from 'clsx';

const App: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(loadIngredients());
  }, []);

  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={clsx(styles.error, 'text text_type_main-medium pt-4')}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route element={<ProtectedRoute onlyUnAuth />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/orders' element={<ProfileOrders />} />
            </Route>

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={`#${location.pathname.match(/\d+/)?.[0]}`}
                    onClose={handleModalClose}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleModalClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal
                      title={`#${location.pathname.match(/\d+/)?.[0]}`}
                      onClose={handleModalClose}
                    >
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
