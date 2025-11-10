import React, { createContext, useContext, useState } from "react";

export const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);

  const addCard = (card) => {
    setCards((prev) => [...prev, { ...card, id: Date.now() }]);
  };

  const updateCard = (id, updatedCard) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...updatedCard, id } : card))
    );
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, deleteCard }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => useContext(CardContext);
export default CardProvider;