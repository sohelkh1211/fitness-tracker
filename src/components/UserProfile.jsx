import { useContext, useState } from "react";
import { GlobalContext } from "../context/Provider";

const UserProfile = ({ data, setData }) => {
    // const { data, setData } = useContext(GlobalContext);
    // console.log("User profile: ",data);
    const [change,setChange] = useState(false);
    return (
        <div className="absolute top-0 ml-[167px] lg:w-[850px] lg:h-[890px] border border-l-0 border-y-0 border-[#CBD5E1]">
            <div className="absolute flex mt-[18px] ml-[40px]">
                <h1 className="text-[25px] dashboard">My Profile</h1>
            </div>
            <form className="">
                <div className="absolute flex lg:mt-[80px] lg:ml-[42px] lg:pt-3 lg:pb-6 lg:w-[766px] lg:h-[200px] rounded-md border border-gray-400">
                    <div className="">
                        <p className="text-left lg:ml-4">First Name</p>
                        <input disabled={!change} type="text" name="first_name" placeholder="First Name" defaultValue={data.first_name} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:ml-4 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="">
                        <p className="text-left lg:ml-28">Last Name</p>
                        <input disabled={!change} type="text" name="last_name" placeholder="Last Name" defaultValue={data.last_name} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:ml-28 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-20 lg:ml-4">
                        <p className="text-left">Height</p>
                        <input disabled={!change} type="number" name="height" placeholder="Height" defaultValue={data.height} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    <div className="absolute lg:mt-20 lg:ml-[428px]">
                        <p className="text-left">Weight</p>
                        <input disabled={!change} type="number" name="weight" placeholder="Weight" defaultValue={data.weight} onKeyDown={(e) => { if (e.key == ' ') e.preventDefault() }} className="right-0 lg:mt-1 lg:px-2 lg:py-0.5 lg:w-[300px] rounded-md border border-black outline-none focus:border-emerald-300" />
                    </div>
                    
                </div>
            </form>
        </div>
    )
}

export default UserProfile;
