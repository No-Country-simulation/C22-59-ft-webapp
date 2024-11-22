import jwt from "jwt-simple";
import moment from "moment";
import { IUser } from "../../interfaces/user";
import "dotenv/config";

interface Payload {
  sub: string;
  iat: number;
  exp: number;
}

export const createToken = (user: IUser) => {
  const secret_token: string = process.env.SECRET_TOKEN as string;
  let payload: Payload = {
    sub: user.email,
    iat: moment().unix(),
    exp: moment().add(24, "hours").unix(),
  };
  return jwt.encode(payload, secret_token);
};
