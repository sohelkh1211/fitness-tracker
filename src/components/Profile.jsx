import { user_profiles } from ".";
import { useContext } from "react";
import Provider, { GlobalContext } from "./Provider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { profile, setProfile } = useContext(GlobalContext);
  // console.log("Profile component :- ",profile);
  return (
    <>
      <div className='absolute flex flex-col top-0 left-0 lg:w-[200px] lg:h-screen bg-gradient-to-tr from-[#AD1DEB] to-[#6E72FC] border'>
        <div className='mt-4 mb-12 mx-auto border border-none'>
          <h1 className='text-[23px] text-white'><span className='font-bold'>Health</span>ify</h1>
        </div>
        {user_profiles.map((item, index) => (
          <div key={index} className="flex flex-row gap-x-3 w-fit ml-14 mb-6 cursor-pointer border border-none">
            {item.name === "Profile" ? <FontAwesomeIcon className={`mt-1 text-white ${profile === item.name ? 'brightness-100': 'brightness-50'}`} icon={faUser} /> : ''}
            <p className={`text-white ${profile === item.name ? 'font-bold' : ''}`} onClick={() => setProfile(item.name)}>{item.name}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Profile;
