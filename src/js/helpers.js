import {globalCssClasses} from "@/js/constants";

export const stopScroll =  {
    stop: () => {
        document.querySelector('body').classList.add(globalCssClasses.stopScroll)
    },
    scroll: () => {
        document.querySelector('body').classList.remove(globalCssClasses.stopScroll)
    }
}