import { stores } from "../store/stores";
import { App } from "../tpl/App.tpl";
import Axios from "axios";
import * as React from "react";

export namespace app{
    export interface Props{
        title: string;
        children: React.ReactElement;      
    }
}