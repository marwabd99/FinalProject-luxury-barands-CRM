import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.currentUser); // משתמש מחובר

  if (!user) {
    // אם אין משתמש מחובר -> נשלח ל-login
    return <Navigate to="/login" />;
  }

  // אם מחובר אך לא מנהל -> נשלח ל-dashboard (או ניתן לשנות ל-access denied)
  return user.isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
