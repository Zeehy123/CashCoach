import React from 'react';

import styles from './App.module.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './app/pages/Dashboard';
import Transaction from './app/pages/Transaction';
import Budget from './app/pages/Budget';
import Register from './app/component/authentication/Register';
import Login from './app/component/authentication/Login';
import Layout from './app/layout/Layout';
import UserProfileForm from './app/pages/UserProfileForm';
import ExpenseModal from './app/component/ExpenseModal';
import Categories from './app/pages/Categories';
import Analytics from './app/pages/Analytics';
import Expenses from './app/pages/Expenses';
import Income from './app/pages/Income';
import IncvsExp from './app/pages/IncvsExp';
import LayoutHome from './app/layout/LayountHome';
import Home from './app/component/landingpage/pages/homEPage/Home';


const App = () => {
  return (
    <Router>
      <div className={styles.app}>
    
        
          <Routes>
          <Route path="/" element={<LayoutHome />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path= '/login' element={<Login/>}/>
          <Route path= '/register' element={<Register/>}/>

            <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/categories" element={<Categories/>}/>
            <Route path='/budget' element={<Budget/>}/>
            <Route path='/userprofile' element={<UserProfileForm/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route path="/expenses" element={<Expenses/>}/>
            <Route path="/income" element={<Income/>}/>
            <Route path="/IncxExp" element={<IncvsExp/>}/>
            
            
            </Route>
          </Routes>
      
      </div>
    </Router>
  );
};

export default App;