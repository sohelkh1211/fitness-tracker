import Startup from "./Startup";
import Register from "./Register";
import Login from "./Login";
import Preloader from "./Preloader";
import Startup1 from "./Startup1";
import Profile from "./Profile";
import UserProfile from "./UserProfile";

export const user_profiles = [{
    name: "Dashboard",
},
{
    name: "Profile",
},
{
    name: "Exercise",
},
{
    name: "Logout",
}
];

export const dashboard_card = [{
    name: "Heart Rate",
    measure: "BPM",
},
{
    name: "Calories Burnt",
    measure: "Kcal",
},
{
    name: "Sleep",
    measure: "",
},];

export const tracker_graph = [{
    name: "Daily",
},
{
    name: "Weekly",
},
{
    name: "Monthly",
},
]

export {
    Startup,
    Startup1,
    Register,
    Login,
    Preloader,
    Profile,
    UserProfile,
}