import { backgroundImgArray } from "../constants/vars";

export const randomBackground = () => {
  return backgroundImgArray[
    Math.ceil(Math.random() * backgroundImgArray.length - 1)
  ];
};
