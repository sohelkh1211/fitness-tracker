import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import fitness_bg from '../assets/bg1.jpg';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const ages = [];
    for (let i = 18; i <= 60; i++) {
        ages.push(i);
    }

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        dob: '',
        height: ''
    });

    const [userCredential, setUserCredential] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUser = (e) => {
        const { name, value } = e.target;
        setUserCredential({
            ...userCredential,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation logic
        if (!formData.name || !formData.email || !formData.gender || !formData.dob || !formData.height || !userCredential.password || !userCredential.confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        // Additional validation logic (e.g., password match)
        else if (userCredential.password !== userCredential.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Form submission logic (e.g., sending data to server)
        else {
            signUp(e)
                .then((error) => {
                    getData(e);
                })
                .catch((error) => {
                    // console.error("Error in sign up:", error);
                    alert(error);
                });

            // console.log('Form submitted:', formData);
        }
    };

    const signUp = (e) => {
        e.preventDefault();
        const email1 = formData["email"];
        const password1 = userCredential["password"];
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, email1, password1)
                .then((userCredential) => {
                    resolve(""); // Resolve with an empty string if sign up is successful
                })
                .catch((error) => {
                    let errorMessage = "";
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = `Email address ${email1} already in use.`;
                            break;
                        case 'auth/invalid-email':
                            errorMessage = `Email address ${email1} is invalid.`;
                            break;
                        case 'auth/operation-not-allowed':
                            errorMessage = `Error during sign up.`;
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Password is not strong enough. Add additional characters including special characters and numbers.';
                            break;
                        default:
                            errorMessage = error.message;
                            break;
                    }
                    console.log(errorMessage); // Log the error message
                    reject(errorMessage); // Reject with the error message
                });
        });
    }

    const getData = async (e) => {
        const { name, email, gender, dob, height } = formData;
        var dob1 = new Date(dob);
        var month_diff = Date.now() - dob1.getTime();
        var age_dt = new Date(month_diff);   //convert the calculated difference in date format
        var year = age_dt.getUTCFullYear();  //extract year from date
        var age = Math.abs(year - 1970);  //now calculate the age of the user
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, email, gender, dob, age, height
            })
        }
        const res = await fetch('https://algo231-ee50a-default-rtdb.firebaseio.com/UserData.json', options);
        if (res) {
            alert("Registered Successfully");
            navigate("/login");
        }
        else {
            alert("Error Occured");
        }
    }

    return (
        <>
            <img src={fitness_bg} className='fixed top-0 left-0 sm:h-full sm:w-full xs:w-full xs:h-full object-cover blur-sm ' />
            <div className='relative flex mx-auto sm:w-[600px] sm:h-[570px] xs:w-full xs:h-[520px] rounded-lg container'>
                <form onSubmit={handleSubmit} method='POST'>
                    <div className='flex sm:ml-[180px] xs:ml-[40px] border-none border-black sm:mt-14 xs:mt-6 w-fit'>
                        <h1 className='sm:text-[35px] xs:text-[25px] font-bold'>Create Account</h1>
                    </div>
                    <div className='absolute sm:mt-4 xs:mt-2 sm:ml-[110px] xs:ml-[25px] sm:pl-[10px] xs:pl-0 pb-4 flex flex-col sm:w-[400px] xs:w-[200px] pt-6 justify-between gap-y-4 border-none border-[1.35px] border-black'>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1 ' />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' />
                        <select name="gender" className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' value={formData.gender} onChange={handleInputChange}>
                            <option value="gender">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <input type="date" name="dob" className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' value={formData.dob} onChange={handleInputChange} />
                        <input type='number' name="height" placeholder='Your height in Ft' value={formData.height} onChange={handleInputChange} className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' />
                        <input type="password" name="password" placeholder="Set Passsword" value={userCredential.password} onChange={handleUser} className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userCredential.confirmPassword} onChange={handleUser} className='sm:w-[350px] xs:w-[200px] rounded-md bg-transparent focus:border-cyan-700 outline-none border-[1.4px] border-black pl-1 py-1' />
                        <button type='submit' className='border  sm:w-fit xs:w-[100px] sm:ml-[115px] xs:ml-[50px] sm:px-10 xs:px-4 sm:py-2 xs:py-2 bg-emerald-300 border-green-400 rounded-md'>Sign Up</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Register
