import path from "path";
import "./env";
import {GraphQLServer} from "graphql-yoga";
import logger from "morgan";
import schema from "./schema"
import {sendSecretMail} from "./utils";
import passport from "passport"
import "./passport"
import {authenticateJwt} from "./passport"

sendSecretMail("airmancho@naver.com","123");

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
    schema,
    context: ({request})=>({request})
}); // context is used when sharing information between resolvers

server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.start({port:PORT}, ()=>
console.log(`Server running on port http://localhost:${PORT}`)
);