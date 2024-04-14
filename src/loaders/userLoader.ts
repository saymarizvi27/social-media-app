import { User } from "@prisma/client";
import DataLoader from "dataloader";

type batchUsers = (ids: number[]) => Promise<User[]>

const batchUsers = async(ids) =>{

}