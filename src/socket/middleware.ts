import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import config from "../config";

const authentication = (socket: Socket, next: any) => {
    if (socket.handshake.query && socket.handshake.query.token){
        const token: string = socket.handshake.query.token as string

        jwt.verify(token, config.get("private_key"), function(err: any, decoded: any) {
            if (err) return next(new Error('Authentication error'));
            socket.data.username = decoded.username
            next();
        });
    }
    else {
      next(new Error('Authentication error'));
    }    
}

export { authentication }