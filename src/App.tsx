import Main from "./Main";
import {SnackbarProvider} from 'notistack';

export default function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Main />
      </SnackbarProvider>
    </>
  );
}
