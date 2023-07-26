'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { writeLogsScript } from '../actions/action';

function convertColorCodesToHTML(text) {
  const colorMap = {
    '^[30m': '<br/><span style="color:grey">',
    '^[31m': '<br/><span style-"color:red">',
    '^[32m': '<br/><span style="color:green">',
    '^[33m': '<br/><span style="color:yellow">',
    '^[34m': '<br/><span style="color:blue">',
    '^[35m': '<br/><span style="color:purple">',
    '^[36m': '<br/><span style="color:cyan">',
    '^[37m': '<br/><span style="color:white">',
    '^[39m': '</span>',
  };

  const pattern = /\^\[\d+m/g;
  const coloredHTML = text.replace(pattern, (match) => colorMap[match]);

  if (typeof document !== 'undefined') {
    const divElement = document.getElementById('coloredText');
    if (divElement) {
      divElement.innerHTML = coloredHTML;
    }
  }
}

const fetcher = (url) => fetch(url).then((res) => res);
export const LogPanel = () => {
  const [status, setStatus] = useState(false);
  const [logs, setLogs] = useState('');
  let reader: any;

  const { data, error, isLoading } = useSWR(
    'http://localhost:8080/api/web',
    fetcher
  );
  React.useEffect(() => {
    writeLogsScript();
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      setStatus(false);
    } else {
      if (data && data.body) {
        reader = data.body.getReader();
        reader.read().then(({ done, value }) => {
          const newLogs = new TextDecoder().decode(value);
          console.log('🚀 ~ reader.read ~ newLogs:', newLogs);
          setLogs((prevLogs) => prevLogs + newLogs);
        });
      }
    }
  }, [isLoading, data]);

  if (error) return <div>Failed to load</div>;
  //Handle the loading state
  if (!(data && data.body)) return <div>Loading...</div>;

  const convertedLogs = convertColorCodesToHTML(logs.replaceAll('[', '^['));
  return (
    <>
      {
        <div className="overflow-scroll h-full bg-slate-800">
          <div
            id="coloredText"
            className="overflow-scroll text-gray-200 h-[90vh]"
          ></div>
        </div>
      }
    </>
  );
};
