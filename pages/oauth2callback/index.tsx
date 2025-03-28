// For Cutstom Google Login Without Any NPM Library
import { useRouter } from "next/router";
import { useEffect } from "react";

const OAuth2Callback = () => {
  const router = useRouter();

  // If Redirection Has Token Then Redirect To Chat Or Else Show Error
  useEffect(() => {
    const { token, error } = router.query;
    if (token) {
      localStorage.setItem("token", token.toString());
      router.push("/chat");
    } else if (error) {
      console.error("Login failed", error);
    }
  }, [router.query]);

  return (
    <>
      <div>Loading ...</div>
    </>
  );
};

export default OAuth2Callback;
