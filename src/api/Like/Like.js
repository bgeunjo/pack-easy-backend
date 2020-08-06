import {prisma} from "../../../generated/prisma-client"

export default {
    Like :{
        post: ({id})=>prisma.comment({id}).post(),
        user: ({id})=>prisma.comment({id}).user()
    }
}