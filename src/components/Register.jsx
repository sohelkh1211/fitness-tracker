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
        const {name, value } = e.target;
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
            getData(e);
            signUp(e);
            // console.log('Form submitted:', formData);
        }
    };

    const signUp = (e) => {
        e.preventDefault();
        const email1 = formData["email"];
        const password1 = userCredential["password"];
        createUserWithEmailAndPassword(auth,email1,password1).then((userCredential) => {
            console.log(userCredential);
        })
        .catch((error) => {
            console.log(error);
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
            <img src={fitness_bg} className='fixed top-0 left-0 h-full w-full object-cover blur-sm ' />
            <div className='relative flex mx-auto w-[600px] min-h-[600px] rounded-lg container'>
                <form onSubmit={handleSubmit} method='POST'>
                    <div className='flex ml-[200px] border-none border-black mt-20 w-fit'>
                        <h1 className='text-[25px] font-bold'>Create Account</h1>
                    </div>
                    <div className='absolute mt-8 ml-[110px] pl-[10px] pb-4 flex flex-col w-[350px]  pt-6 justify-between gap-y-4 border-[1.35px] border-black'>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' />
                        <select name="gender" className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' value={formData.gender} onChange={handleInputChange}>
                            <option value="gender">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <input type="date" name="dob" className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' value={formData.dob} onChange={handleInputChange} />
                        <input type='number' name="height" placeholder='Your height in Ft' value={formData.height} onChange={handleInputChange} className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' />
                        <input type="password" name="password" placeholder="Set Passsword" value={userCredential.password} onChange={handleUser} className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userCredential.confirmPassword} onChange={handleUser} className='w-[300px] rounded-sm bg-transparent border-[1.4px] border-black pl-1' />
                        <button type='submit' className='border w-fit mx-auto px-10 py-2 bg-emerald-300 border-green-400 rounded-md'>Sign Up</button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Register
