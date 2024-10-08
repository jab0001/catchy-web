import { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import PasswordResetPage from "./components/PasswordResetPage";
import PaymentPage from "./components/PaymentPage";
import IntroPage from "./components/IntroPage";
/* import ResetCustomPage from "./components/ResetCustomPage"; */
import { LoadingStyle } from "./components/styledComponents/LoadingStyle";
import LoadingImg from "./assets/img/loading.svg";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Добавляем состояние загрузки
  const [switchToRegisterPage, setSwitchToRegisterPage] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);  // Отключаем загрузку после проверки состояния
    });

    return () => unsubscribe();
  }, []);

  const checkSwitchToRegister = (payload: boolean) => {
    setSwitchToRegisterPage(payload)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <LoadingStyle>
      <img className="img" src={LoadingImg}/>
    </LoadingStyle>  // Можно показать спиннер или сообщение о загрузке
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <MainPage handleLogout={handleLogout} /> : <Navigate to="/intro" />}
        />
        <Route
          path="/intro"
          element={<IntroPage switchPage={checkSwitchToRegister}/>}
        />
        <Route
          path="/login"
          element={<LoginPage isRegisterFirst={switchToRegisterPage}/>}
        />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/payment" element={user ? <PaymentPage /> : <Navigate to="/login" />} />
        {/* <Route path="/reset-page" element={<ResetCustomPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;