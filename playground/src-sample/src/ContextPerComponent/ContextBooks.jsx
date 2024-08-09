// MUI imports
import { Button } from "@mui/material";
import { BookProvider } from "./BookProvider";
import { useBookContext } from "./bookContext";

const ContextBooks = () => {
  return (
    <div>
      <BookProvider>
        <BookChangeButton changeTo="This book one" />
        <DumbBook />
      </BookProvider>
      <BookProvider>
        <BookChangeButton changeTo="2nd Book" />
        <DumbBook />
      </BookProvider>
    </div>
  );
}

const BookChangeButton = ({ changeTo }) => {
  const theContext = useBookContext();
  if (!theContext) return <p>{changeTo} No Context</p>;

  return (
    <div>
      <Button onClick={() => theContext.changeName(changeTo)}>Set Book</Button>
      {theContext.book.name &&
        <Button onClick={() => theContext.changeName('')}>Clear</Button>
      }
    </div>
  );
}

const DumbBook = () => {
  const theContext = useBookContext();
  if (!theContext) return <p>No Context</p>;

  const { book } = theContext;
  if (!book.name ) return <p>Book name not set</p>;
  const timeChanged = new Date().toLocaleTimeString();

  return <>
    <h1>{book.name}</h1>
    <p>Rendered: {timeChanged}</p>
  </>
}

export default ContextBooks;