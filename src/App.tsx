import React, { useEffect, useMemo, useRef } from "react";
import { PAGE_SIZE } from "./api";
import PersonInfo from "./PersonInfo";
import { createPortal } from "react-dom";
import { useFetchPersons } from "./hooks/useFetchPersons";

function App() {
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const { data, error, resetError, isLoading, loadMore } = useFetchPersons();

  const hasData = data.length > 0;

  useEffect(() => {
    // don't scroll on initial data load
    if (PAGE_SIZE < data.length) {
      buttonRef?.current?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, [data.length]);

  useEffect(() => {
    counterRef?.current?.scrollIntoView({
      block: "start",
    });
  }, [selected.length]);

  const handleSelect = (id: string) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      }

      return [...prevSelected, id];
    });
  };

  const sortedData = useMemo(
    () =>
      [...data].sort((a, b) => {
        const aSelected = selected.includes(a.id);
        const bSelected = selected.includes(b.id);

        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;

        return a.firstNameLastName.localeCompare(b.firstNameLastName);
      }),
    [data, selected],
  );

  if (isLoading && !hasData) {
    return (
      <div className="loader-container">
        <span className="loader loader-large"></span>
      </div>
    );
  }

  return (
    <div className="App">
      <div ref={counterRef} className="selected">
        Selected contacts: {selected.length}
      </div>
      <div className="list">
        {sortedData?.map((personInfo) => (
          <PersonInfo
            onClick={() => handleSelect(personInfo.id)}
            key={personInfo.id}
            data={personInfo}
            selected={selected.includes(personInfo.id)}
          />
        ))}
      </div>
      {hasData && (
        <div className="loadMoreWrapper">
          <button
            ref={buttonRef}
            aria-label="Load more"
            className="loadMore"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? <span className="loader"></span> : "Load more"}
          </button>
        </div>
      )}

      {error &&
        createPortal(
          <div role="alert" className="error-notification">
            <div className="error-notification-content">
              <p className="error-notification-text">{error}</p>
            </div>
            <button
              onClick={resetError}
              className="error-notification-close"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default App;
