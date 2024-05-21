// ************** Exercise data fetch code ************** //
export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '5eedf50b18mshf876e48a4210fecp1e0825jsn7bf338cb9b81',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

export const youtubeOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
    'X-RapidAPI-Key': '5eedf50b18mshf876e48a4210fecp1e0825jsn7bf338cb9b81',
  },
};

export const fetchData = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();

  return data;
};
// ******************************************************* //

// ******************* For fetching user data ***************** //
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref as dbRef, get } from "firebase/database";

export const fetchUserData = (uid) => {
  const [res, setRes] = useState('');

  useEffect(() => {
    const fetchData1 = async () => {
      try {
        const userRef = dbRef(db, `UserData/${uid}`);
        const snapshot = await get(userRef);
        setRes(snapshot.val());
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchData1();
  }, [uid]);

  return res;
}