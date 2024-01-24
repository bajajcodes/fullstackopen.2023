import { Suspense } from 'react';
import { Header } from './Header';
import { Loader } from './Loader';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </>
  );
}
