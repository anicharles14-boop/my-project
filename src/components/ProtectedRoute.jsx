import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

// Only shows the pages inside it to someone who is logged in AND still has
// a record in `recordCollection` ("students" or "admins"). A student whose
// record was deleted by an admin is signed out and sent back to the login.
function ProtectedRoute({ authInstance, redirectTo, recordCollection }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (!currentUser) {
        setStatus("signed-out");
        return;
      }

      if (!recordCollection) {
        setStatus("allowed");
        return;
      }

      try {
        const records = await getDocs(
          query(collection(db, recordCollection), where("uid", "==", currentUser.uid))
        );

        if (records.empty) {
          await signOut(authInstance);
          setStatus("removed");
        } else {
          setStatus("allowed");
        }
      } catch (error) {
        console.error("Could not check account:", error);
        // Don't lock people out if the check itself fails (e.g. offline).
        setStatus("allowed");
      }
    });

    return unsubscribe;
  }, [authInstance, recordCollection]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "removed") {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ message: "Your account has been removed. Please contact the school or register again." }}
      />
    );
  }

  if (status === "signed-out") {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
