import React, { useEffect, useState, useTransition } from "react";
import mockData from "src/mockData.json";
import apiData from "src/api";

type Person = (typeof mockData)[number];

const ERROR_DISPLAY_DURATION = 3000;

export const useFetchPersons = () => {
  const [data, setData] = useState<Array<Person>>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    setIsFetching(true);

    try {
      const result = await apiData();
      setError("");
      setData([...data, ...result]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!error) return;

    const timeoutId = setTimeout(() => {
      setError("");
    }, ERROR_DISPLAY_DURATION);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  useEffect(() => {
    getData();
  }, []);

  const loadMore = () => {
    getData();
  };

  return {
    data,
    error,
    isLoading: isFetching,
    loadMore,
    resetError: () => setError(""),
  };
};
