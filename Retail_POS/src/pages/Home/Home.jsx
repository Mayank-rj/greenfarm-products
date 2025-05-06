import Footer from '../../components/Footer/Footer';
import Display from '../../components/Display/Display';
import Category from '../../components/Category/Category';
import Products from '../../components/Products/Products';

import { useEffect } from "react";
import { toast } from "react-toastify";
import { sendMessage, socket } from '../../app/driverConnection';
import { useDispatch } from 'react-redux';
import { clearPosData, setPosData } from '../../feature/posDataSlice';
export const Home = () => {

  return (
    <div className="grid grid-rows-[90%_10%] h-screen ">
      <div className="grid grid-cols-[40%_20%_40%] h-full" >
        <Display />
        <Category />
        <Products />
      </div>
      <Footer className="h-full" />
    </div>
  );
};
