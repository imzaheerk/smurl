import { useState, useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthSplitLayout } from './components/auth/AuthSplitLayout';
import { SplashScreen } from './components/SplashScreen';
import { Analytics } from './pages/analytics/Analytics';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Landing } from './pages/landing/Landing';
import { Login } from './pages/login/Login';
import { NotFound } from './pages/not-found/NotFound';
import { Privacy } from './pages/privacy/Privacy';
import { Register } from './pages/register/Register';
import { Settings } from './pages/settings/Settings';
import { Terms } from './pages/terms/Terms';
import { ROUTES } from './constants/routes';

const routeConfig = [
  { path: ROUTES.HOME, element: <Landing /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.SETTINGS, element: <Settings /> },
  { path: ROUTES.ANALYTICS_PATH, element: <Analytics /> },
  { path: ROUTES.TERMS, element: <Terms /> },
  { path: ROUTES.PRIVACY, element: <Privacy /> },
  { path: ROUTES.NOT_FOUND, element: <NotFound /> },
] as const;

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      <Route element={<AuthSplitLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      {routeConfig.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

