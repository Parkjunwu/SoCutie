import useResendEmailBaseNeedIsWhenFirstCreateAccount from "./useResendEmailBaseNeedIsWhenFirstCreateAccount";

const useResendEmailWhenFirstCreateAccountNeedEmail = (email:string) => {

  const baseAlertResendEmailNeedEmail = useResendEmailBaseNeedIsWhenFirstCreateAccount(true);

  const alertResendEmailWhenFirstCreateAccount = () => {
    baseAlertResendEmailNeedEmail(email);
  };
  
  return alertResendEmailWhenFirstCreateAccount;
};

export default useResendEmailWhenFirstCreateAccountNeedEmail;