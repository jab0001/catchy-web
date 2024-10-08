import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, update, set } from "firebase/database";
import ACTIONS from "./state/actions/helpActions";
import { getServerTime } from "./helpers";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const updatePaymentStatus = async (userId: string, isPaid: boolean) => {
  const userRef = ref(database, `users/${userId}`);

  try {
    await update(userRef, {
      subscriptionPaid: isPaid
    });
    console.log("Payment status updated successfully");
  } catch (error) {
    console.error("Error updating payment status:", error);
  }
};

export const checkSubscriptionStatus = async (dispatch: React.Dispatch<any>) => {
  if (!auth.currentUser) return;

  const userRef = ref(database, 'users/' + auth.currentUser.uid);
  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('USER', userData);

      // Диспатчим экшен для обновления статуса подписки
      dispatch({
        type: ACTIONS.SET_IS_PAID,
        payload: userData.subscriptionPaid, // Обновляем состояние с данными о подписке
      });
    } else {
      console.log("No data available");

      // Если данных нет, диспатчим false
      dispatch({
        type: ACTIONS.SET_IS_PAID,
        payload: false,
      });
    }
  } catch (error) {
    console.error("Error checking subscription status:", error);
  }
};

export const checkApiUsageLimit = async (number: number, dispatch: React.Dispatch<any>): Promise<boolean> => {
  if (!auth.currentUser) {
    console.error("User is not authenticated");
    return false;
  }

  const serverTime = await getServerTime();

  let currentDate = '';

  if (serverTime) {
    currentDate = serverTime.toISOString().split('T')[0];
  } else {
    currentDate = new Date().toISOString().split('T')[0];
    console.error('Could not fetch server time');
  }

  const userRef = ref(database, `users/${auth.currentUser.uid}`);


  try {
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      // Если у пользователя нет записей, создаем новую запись с полем apiUsage для отслеживания запросов
      await set(userRef, {
        apiUsage: { [currentDate]: number },
      });
      return true;
    }

    const userData = snapshot.val();
    const apiUsage = userData.apiUsage || {};
    const requestsToday = apiUsage[currentDate] || 0;

    // Ограничение на количество запросов в день
    const requestLimit = 5;

    dispatch({
      type: ACTIONS.DAY_LIMIT_NUMBER,
      payload: requestLimit - requestsToday,
    });

    if ((requestsToday + number) > requestLimit) {
      console.log(`Не можете выполнить запросы для всех сервисов так как превышаете лимит ежедневных запросов, вам доступен ${requestLimit - requestsToday} запрос`);
      return false;
    }

    if (requestsToday >= requestLimit) {
      console.log(`Daily request limit reached`);
      return false; // Лимит достигнут
    }

    // Обновляем количество запросов на текущий день
    await update(userRef, { [`apiUsage/${currentDate}`]: requestsToday + number });

    return true; // Разрешаем выполнение запроса
  } catch (error) {
    console.error("Error checking API usage limit:", error);
    return false;
  }
};