import { prisma } from "../../../../generated/prisma-client";


export default {
    Query: {
        searchByPost: async(_,args) => 
        prisma.posts({
            where:{
                OR: [{
                    location_contains: args.term
                },
                {
                    caption_contains: args.term
                }]
            }
        })
    }
}