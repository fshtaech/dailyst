export const OutsiderModal = () => {
  return {
    title: "Uh-Oh!",
    content: (
      <>
        <p className="text-center px-2">
          Only signed up users can use Dailyst and its features. We ask that you
          create an account first!
        </p>

        <p className="text-center italic text-sm my-4">
          Don't worry, your account is safe with us
          <br />
          (you can also create a guest account if you are privacy-inclined)
        </p>
      </>
    ),
  };
};
