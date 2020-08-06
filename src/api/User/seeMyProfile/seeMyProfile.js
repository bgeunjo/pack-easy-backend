import { prisma } from "../../../../generated/prisma-client";

export default {
    Query:{
        seeMyProfile: async(_,__,{request,isAuthenticated}) => {
            isAuthenticated(request);
            const {user}= request;
            return await prisma.user({id:user.id});
        }
    },
}