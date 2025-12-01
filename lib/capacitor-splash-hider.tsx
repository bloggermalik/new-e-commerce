import { useEffect } from "react";
import {SplashScreen} from "@capacitor/splash-screen";


export default async function HideSplashScreen() {
    useEffect(() =>{

        const hideSplash = async () => {
            try {
                
                await SplashScreen.hide();
            } catch (error) {
                console.error("Error hiding splash screen:", error);
                
            }
        }
        hideSplash();
    },[])
    return null;
}