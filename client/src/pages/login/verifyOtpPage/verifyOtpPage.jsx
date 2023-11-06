import * as React from "react";

// Axios
import axios from "axios";

// Styles
import styles from "./verifyOtpPage.module.css";

// Hooks
import { useState, useEffect } from 'react';

// React Router DOM
import { useNavigate } from "react-router-dom";

// User Defined Hooks
import { useRecoveryContext } from "../../../components/hooks/useAuth";

export const VerifyOtpPage = () => {
    const {otp, setOTP, email, setEmail} = useRecoveryContext();
    const [OTPinput, setOTPinput] = useState();
    const [disable, setDisable] = useState(true);
    const [timerCount, setTimer] = useState(60);
    const navigate = useNavigate();

    function verifyOTP() {
        if (parseInt(OTPinput) === otp) {
            navigate('/resetPassword');
        }
        else {
            alert("The code you have entered is not correct, try again re-send the link");
        }
    }

      //function to resend OTP 
  function resendOTP() {
    if (disable) return;
    axios
      .post("http://localhost:5000/resetPassword/sendEmail", {
        otp: otp,
        recipientEmail: email,
      })
      .then(() => setDisable(true))
      .then(() => alert("A new OTP has succesfully been sent to your email."))
      .then(() => setTimer(60))
      .catch(console.log);

  }
  //timer function
  useEffect(() => {
    let interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

    return (
        <div>
          <h3>Email Verification</h3>
          <p>We have sent a verification code to your email.</p>
          <form>
             <input type="text" value={OTPinput} onChange={(e) => { setOTPinput(e.target.value) }} /> 
              <button onClick={() => verifyOTP()}>Verify Account</button> 
              <a onClick={() => resendOTP()} > Did not receive code? {disable ? `Resend OTP in ${timerCount}s` : " Resend OTP"}</a> 
          </form>
        </div>
      );
}